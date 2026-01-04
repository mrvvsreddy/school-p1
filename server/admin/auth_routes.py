"""
Authentication API Routes
Handles admin login with JWT token generation
Includes rate limiting and account lockout
"""

import logging
import sys
import os
from fastapi import APIRouter, HTTPException, Depends, Response, Request
from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime, timedelta

# Import JWT utilities
from .auth_utils import create_access_token, get_current_user, TokenData, require_admin, verify_password

# Import rate limiting
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from security import check_rate_limit, record_failed_login, clear_failed_logins

# Configure logger
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ============= PYDANTIC MODELS =============

class LoginRequest(BaseModel):
    username: str
    password: str
    
    @field_validator('username')
    @classmethod
    def username_not_empty(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Username cannot be empty')
        return v.strip()
    
    @field_validator('password')
    @classmethod
    def password_not_empty(cls, v):
        if not v or len(v.strip()) == 0:
            raise ValueError('Password cannot be empty')
        return v

class AuthResponse(BaseModel):
    success: bool
    message: str
    token: Optional[str] = None
    user: Optional[dict] = None

# ============= HELPER FUNCTIONS =============

def get_supabase():
    """Get Supabase client from main app"""
    from server import supabase
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
    return supabase

# ============= AUTH ROUTES =============

@router.post("/login", response_model=AuthResponse)
async def login(login_request: LoginRequest, request: Request, response: Response):
    """
    Login - verifies credentials, generates JWT token and sets secure HTTP-only cookie
    
    Security features:
        - Rate limited to 5 requests per minute per IP
        - Account lockout after 5 failed attempts (5 minute cooldown)
        - Password verification with bcrypt
    """
    # Check rate limit first
    check_rate_limit(request, "login")
    
    db = get_supabase()
    
    try:
        # Check if user exists in database by username
        user_result = db.table("admin_users").select("*").eq("username", login_request.username).execute()
        
        if not user_result.data:
            # Record failed attempt and check for lockout
            if record_failed_login(request):
                raise HTTPException(status_code=429, detail="Too many failed attempts. Please try again later.")
            logger.warning(f"Login attempt for non-existent username: {login_request.username}")
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        user = user_result.data[0]
        
        # Verify password
        password_hash = user.get("password_hash")
        if not password_hash:
            logger.error(f"User {login_request.username} has no password_hash set")
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        if not verify_password(login_request.password, password_hash):
            # Record failed attempt and check for lockout
            if record_failed_login(request):
                raise HTTPException(status_code=429, detail="Too many failed attempts. Please try again later.")
            logger.warning(f"Invalid password attempt for: {login_request.username}")
            raise HTTPException(status_code=401, detail="Invalid username or password")
        
        # Check if user is active
        if user.get("status") != "active":
            logger.warning(f"Inactive user login attempt: {login_request.username}")
            raise HTTPException(status_code=403, detail="User account is inactive")
        
        # Update last login
        db.table("admin_users").update({"last_login": datetime.now().isoformat()}).eq("id", user["id"]).execute()
        
        # Create JWT token
        token_data = {
            "username": user.get("username"),
            "email": user.get("email"),
            "user_id": user["id"],
            "role": user["role"]
        }
        access_token = create_access_token(token_data)
        
        # Clear failed login attempts on successful login
        clear_failed_logins(request)
        
        logger.info(f"Login successful for {user.get('username')}")
        
        # Also set cookie as fallback (may not work in all browsers due to cross-origin restrictions)
        try:
            response.set_cookie(
                key="auth_token",
                value=access_token,
                httponly=True,
                secure=True,
                samesite="none",
                max_age=25200,
                path="/"
            )
        except Exception as cookie_err:
            logger.warning(f"Could not set cookie: {cookie_err}")
        
        # Return user info AND token (for localStorage storage)
        user_response = {
            "id": user["id"],
            "username": user.get("username"),
            "email": user.get("email"),
            "name": user["name"],
            "role": user["role"],
            "image_url": user.get("image_url")
        }
        
        return AuthResponse(
            success=True,
            message="Login successful",
            token=access_token,
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error: {type(e).__name__}: {e}")
        # Security: Don't expose internal error details
        raise HTTPException(status_code=500, detail="An error occurred during login")

@router.post("/logout")
async def logout(response: Response):
    """Logout - clears secure HTTP-only cookie"""
    logger.info("User logout requested")
    response.delete_cookie(key="auth_token", path="/")
    return {"success": True, "message": "Logged out successfully"}

@router.get("/me")
async def get_me(current_user: TokenData = Depends(get_current_user)):
    """
    Get current logged-in user from JWT token
    Fetches full user data from database including image
    """
    db = get_supabase()
    
    try:
        # Fetch full user data from database
        user_result = db.table("admin_users").select("id, email, name, role, image_url, status").eq("email", current_user.email).single().execute()
        
        if user_result.data:
            user = user_result.data
            return {
                "authenticated": True,
                "user": {
                    "id": user["id"],
                    "email": user["email"],
                    "name": user["name"],
                    "role": user["role"],
                    "image_url": user.get("image_url"),
                    "status": user.get("status")
                }
            }
    except Exception as e:
        logger.warning(f"Could not fetch full user data: {e}")
    
    # Fallback to token data
    return {
        "authenticated": True,
        "user": {
            "email": current_user.email,
            "user_id": current_user.user_id,
            "role": current_user.role
        }
    }

@router.get("/verify")
async def verify_token(current_user: TokenData = Depends(get_current_user)):
    """
    Verify if token is valid
    Returns user data if valid, 401 if invalid
    """
    return {
        "valid": True,
        "user": {
            "email": current_user.email,
            "user_id": current_user.user_id,
            "role": current_user.role,
            "expires": current_user.exp.isoformat()
        }
    }

# ============= ADMIN MANAGEMENT ROUTES =============

@router.get("/users")
async def get_admin_users(current_user: TokenData = Depends(require_admin)):
    """Get all admin users (admin only)"""
    db = get_supabase()
    
    result = db.table("admin_users").select("id, email, name, role, status, last_login, created_at").execute()
    return {"users": result.data}

@router.post("/users")
async def create_admin_user(
    email: EmailStr,
    name: str,
    role: str = "admin",
    current_user: TokenData = Depends(require_admin)
):
    """Create a new admin user (admin only)"""
    db = get_supabase()
    
    user_data = {
        "email": email,
        "name": name,
        "role": role,
        "status": "active"
    }
    
    try:
        result = db.table("admin_users").insert(user_data).execute()
        return {"success": True, "user": result.data[0]}
    except Exception as e:
        if "duplicate key" in str(e).lower():
            raise HTTPException(status_code=400, detail="User with this email already exists")
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/users/{user_id}/status")
async def update_user_status(
    user_id: int,
    status: str,
    current_user: TokenData = Depends(require_admin)
):
    """Activate/deactivate admin user (admin only)"""
    db = get_supabase()
    
    if status not in ["active", "inactive"]:
        raise HTTPException(status_code=400, detail="Status must be 'active' or 'inactive'")
    
    result = db.table("admin_users").update({"status": status}).eq("id", user_id).execute()
    return {"success": True, "user": result.data[0]}
