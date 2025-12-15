"""
JWT Authentication Utilities
Handles token creation, verification, and user authentication
"""

import os
import logging
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt, ExpiredSignatureError
from fastapi import HTTPException, Security, Depends, Cookie
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel

# Configure logger
logger = logging.getLogger(__name__)

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 420  # 7 hours

security = HTTPBearer(auto_error=False)

class TokenData(BaseModel):
    email: str
    user_id: int
    role: str
    exp: datetime

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token
    
    Args:
        data: Dictionary containing user data (email, user_id, role)
        expires_delta: Optional custom expiration time
    
    Returns:
        Encoded JWT token string
    """
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
        HTTPException: If token is invalid or expired
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("email")
        user_id: int = payload.get("user_id")
        role: str = payload.get("role")
        
        if email is None or user_id is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        return TokenData(
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

def decode_token_without_verification(token: str) -> dict:
    """
    Decode token without verification (for debugging)
    WARNING: Do not use for authentication!
    """
    try:
        return jwt.decode(token, options={"verify_signature": False})
    except:
        return {}
