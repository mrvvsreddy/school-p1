"""
Authentication API Routes
Handles admin login with JWT token generation
"""

import logging
from fastapi import APIRouter, HTTPException, Depends, Response
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime, timedelta

# Import JWT utilities
from .auth_utils import create_access_token, get_current_user, TokenData, require_admin

# Configure logger
logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/auth", tags=["auth"])

# ============= PYDANTIC MODELS =============

class LoginRequest(BaseModel):
    email: EmailStr

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
async def login(request: LoginRequest, response: Response):
    """
    Login - generates JWT token and sets secure HTTP-only cookie
    """
    db = get_supabase()
    
    try:
        # Check if user exists in database
        user_result = db.table("admin_users").select("*").eq("email", request.email).execute()
        
        if not user_result.data:
            # Security: Don't create users automatically in production
            raise HTTPException(status_code=404, detail="User not found")
        
        user = user_result.data[0]
        
        # Check if user is active
        if user.get("status") != "active":
            raise HTTPException(status_code=403, detail="User account is inactive")
        
        # Update last login
        db.table("admin_users").update({"last_login": datetime.now().isoformat()}).eq("id", user["id"]).execute()
        
        # Create JWT token
        token_data = {
            "email": user["email"],
            "user_id": user["id"],
            "role": user["role"]
        }
        access_token = create_access_token(token_data)
        
        logger.info(f"Login successful for {user['email']}, token created")
        
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
            "email": user["email"],
            "name": user["name"],
            "role": user["role"],
            "image_url": user.get("image_url")
        }
        
        return AuthResponse(
            success=True,
            message="Login successful",
            token=access_token,  # Return token for localStorage
            user=user_response
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Login error for {request.email}: {type(e).__name__}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

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
