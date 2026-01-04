"""
JWT Authentication Utilities
Handles token creation, verification, user authentication, and password hashing
"""

import os
import logging
import bcrypt
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt, ExpiredSignatureError
from fastapi import HTTPException, Security, Depends, Cookie
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

# Configure logger
logger = logging.getLogger(__name__)

# JWT Configuration - FAIL if not set (no insecure defaults)
SECRET_KEY = os.getenv("JWT_SECRET_KEY")
if not SECRET_KEY:
    logger.warning("JWT_SECRET_KEY not set! Authentication will fail. Set this in your .env file.")
    SECRET_KEY = None  # Will cause auth to fail safely

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 420  # 7 hours

security = HTTPBearer(auto_error=False)

class TokenData(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    user_id: int
    role: str
    exp: datetime


# ============= PASSWORD UTILITIES =============

def hash_password(password: str) -> str:
    """
    Hash a password using bcrypt
    
    Args:
        password: Plain text password
        
    Returns:
        Hashed password string
    """
    # Encode password to bytes, hash it, and return as string
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a password against its hash
    
    Args:
        plain_password: Plain text password to verify
        hashed_password: Stored password hash
        
    Returns:
        True if password matches, False otherwise
    """
    try:
        password_bytes = plain_password.encode('utf-8')
        hashed_bytes = hashed_password.encode('utf-8')
        return bcrypt.checkpw(password_bytes, hashed_bytes)
    except Exception as e:
        logger.error(f"Password verification error: {e}")
        return False

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Dictionary containing user data (email, user_id, role)
        expires_delta: Optional custom expiration time
    
    Returns:
        Encoded JWT token string
    
    Raises:
        HTTPException: If JWT_SECRET_KEY is not configured
    """
    if not SECRET_KEY:
        logger.error("JWT_SECRET_KEY not configured - cannot create tokens")
        raise HTTPException(
            status_code=500,
            detail="Server authentication not configured"
        )
    
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    return encoded_jwt

def verify_token(token: str) -> TokenData:
    """
    Verify and decode a JWT token
    
    Args:
        token: JWT token string
    
    Returns:
        TokenData object with user information
    
    Raises:
        HTTPException: If token is invalid, expired, or server not configured
    """
    if not SECRET_KEY:
        logger.error("JWT_SECRET_KEY not configured - cannot verify tokens")
        raise HTTPException(
            status_code=500,
            detail="Server authentication not configured"
        )
    
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("username")
        email: str = payload.get("email")
        user_id: int = payload.get("user_id")
        role: str = payload.get("role")
        
        # Require either username or email, and user_id
        if (username is None and email is None) or user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return TokenData(
            username=username,
            email=email,
            user_id=user_id,
            role=role,
            exp=datetime.fromtimestamp(payload.get("exp"))
        )
    
    except ExpiredSignatureError:
        logger.warning(f"JWT token expired for user")
        raise HTTPException(
            status_code=401,
            detail="Token has expired. Please login again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError as e:
        logger.error(f"JWT verification failed: {type(e).__name__}: {str(e)}")
        raise HTTPException(
            status_code=401,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def get_current_user(
    auth_token: Optional[str] = Cookie(None, alias="auth_token"),
    credentials: Optional[HTTPAuthorizationCredentials] = Security(security)
) -> TokenData:
    """
    Dependency to get current authenticated user from JWT token
    Checks cookie first, then Authorization header as fallback
    
    Usage in routes:
        @router.get("/protected")
        async def protected_route(current_user: TokenData = Depends(get_current_user)):
            return {"user": current_user.email}
    """
    # Try cookie first (preferred method)
    token = auth_token
    
    # Fallback to Authorization header
    if not token and credentials:
        token = credentials.credentials
    
    if not token:
        logger.warning(f"Authentication attempt without token")
        raise HTTPException(
            status_code=401,
            detail="Not authenticated - no token provided",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    logger.debug(f"Verifying token from {'cookie' if auth_token else 'header'}")
    return verify_token(token)

async def require_admin(current_user: TokenData = Depends(get_current_user)) -> TokenData:
    """
    Dependency to require admin role
    
    Usage in routes:
        @router.get("/admin-only")
        async def admin_route(current_user: TokenData = Depends(require_admin)):
            return {"message": "Admin access granted"}
    """
    if current_user.role not in ["admin", "super_admin"]:
        raise HTTPException(
            status_code=403,
            detail="Admin access required"
        )
    return current_user

async def require_editor(current_user: TokenData = Depends(get_current_user)) -> TokenData:
    """
    Dependency to require editor or admin role
    
    Usage in routes:
        @router.put("/editor/page")
        async def edit_page(current_user: TokenData = Depends(require_editor)):
            return {"message": "Editor access granted"}
    """
    if current_user.role not in ["admin", "super_admin", "editor"]:
        raise HTTPException(
            status_code=403,
            detail="Editor access required"
        )
    return current_user

# SECURITY: decode_token_without_verification function removed
# It was a security risk as it could be misused to bypass signature verification
