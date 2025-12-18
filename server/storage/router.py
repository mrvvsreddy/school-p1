"""
Storage API Router
Operations for Supabase storage buckets (list, delete, download images)
All routes require authentication
"""
import os
import re
import logging
from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends
from fastapi.responses import RedirectResponse
from supabase import create_client, Client

# Import authentication utilities
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from admin.auth_utils import get_current_user, require_admin, TokenData

# Setup logging
logger = logging.getLogger(__name__)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

BUCKET_NAME = "site-images"

storage_router = APIRouter(prefix="/api/storage", tags=["Storage"])


def check_supabase():
    """Check if Supabase is connected"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not connected")


def sanitize_file_path(file_path: str) -> str:
    """
    Sanitize file path to prevent path traversal attacks
    Removes ../ and other dangerous patterns
    """
    if not file_path:
        return ""
    
    # Normalize path and remove dangerous patterns
    # Remove any path traversal attempts
    sanitized = file_path.replace("\\", "/")
    sanitized = re.sub(r'\.\./', '', sanitized)
    sanitized = re.sub(r'/\.\.', '', sanitized)
    sanitized = re.sub(r'^\.\.', '', sanitized)
    
    # Remove leading slashes
    sanitized = sanitized.lstrip("/")
    
    # Remove any remaining suspicious patterns
    sanitized = re.sub(r'[<>:"|?*]', '', sanitized)
    
    return sanitized


@storage_router.get("/images")
async def list_images(
    folder: Optional[str] = Query(None, description="Folder path within bucket"),
    limit: int = Query(100, ge=1, le=500),
    offset: int = Query(0, ge=0),
    current_user: TokenData = Depends(get_current_user)
):
    """
    List all images from the site-images bucket (requires authentication)
    """
    check_supabase()
    
    try:
        # Sanitize folder path
        path = sanitize_file_path(folder) if folder else ""
        result = supabase.storage.from_(BUCKET_NAME).list(path, {"limit": limit, "offset": offset})
        
        # Format response with public URLs
        images = []
        for file in result:
            if file.get("name") and not file.get("id") is None:  # Skip folders
                file_path = f"{path}/{file['name']}" if path else file["name"]
                public_url = supabase.storage.from_(BUCKET_NAME).get_public_url(file_path)
                
                images.append({
                    "id": file.get("id"),
                    "name": file.get("name"),
                    "path": file_path,
                    "url": public_url,
                    "size": file.get("metadata", {}).get("size", 0),
                    "mimetype": file.get("metadata", {}).get("mimetype", ""),
                    "created_at": file.get("created_at"),
                    "updated_at": file.get("updated_at"),
                })
        
        return {
            "images": images,
            "total": len(images),
            "bucket": BUCKET_NAME,
            "folder": path or "root"
        }
    except Exception as e:
        logger.error(f"Error listing images: {e}")
        raise HTTPException(status_code=500, detail="Failed to list images")


@storage_router.get("/images/{file_path:path}/download")
async def download_image(
    file_path: str,
    current_user: TokenData = Depends(get_current_user)
):
    """
    Get download URL for an image (requires authentication)
    """
    check_supabase()
    
    # Sanitize file path to prevent path traversal
    safe_path = sanitize_file_path(file_path)
    if not safe_path:
        raise HTTPException(status_code=400, detail="Invalid file path")
    
    try:
        # Create a signed URL for download (valid for 1 hour)
        signed_url = supabase.storage.from_(BUCKET_NAME).create_signed_url(safe_path, 3600)
        
        if signed_url and signed_url.get("signedURL"):
            return RedirectResponse(url=signed_url["signedURL"])
        else:
            raise HTTPException(status_code=404, detail="Could not generate download URL")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error generating download URL: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate download URL")


@storage_router.delete("/images/{file_path:path}")
async def delete_image(
    file_path: str,
    current_user: TokenData = Depends(require_admin)
):
    """
    Delete an image from the bucket (requires admin role)
    """
    check_supabase()
    
    # Sanitize file path to prevent path traversal
    safe_path = sanitize_file_path(file_path)
    if not safe_path:
        raise HTTPException(status_code=400, detail="Invalid file path")
    
    try:
        # Delete the file
        result = supabase.storage.from_(BUCKET_NAME).remove([safe_path])
        
        logger.info(f"Deleted image: {safe_path} by user {current_user.email}")
        return {
            "success": True,
            "message": f"Image deleted successfully",
            "path": safe_path
        }
    except Exception as e:
        logger.error(f"Error deleting image: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete image")


@storage_router.get("/buckets")
async def list_buckets(
    current_user: TokenData = Depends(require_admin)
):
    """
    List all available storage buckets (requires admin role)
    """
    check_supabase()
    
    try:
        result = supabase.storage.list_buckets()
        buckets = [{"id": b.id, "name": b.name, "public": b.public} for b in result]
        return {"buckets": buckets}
    except Exception as e:
        logger.error(f"Error listing buckets: {e}")
        raise HTTPException(status_code=500, detail="Failed to list buckets")

