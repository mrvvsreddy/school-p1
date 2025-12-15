"""
Image upload endpoint using Supabase Storage.
Handles file uploads from the editor pages and returns public URLs.
"""

import os
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, UploadFile, File
from supabase import create_client, Client

router = APIRouter()

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

# Storage bucket name (defaults to 'site-images' if not set)
STORAGE_BUCKET = os.getenv("SUPABASE_STORAGE_BUCKET", "site-images")

# Allowed file types and max size
ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/gif", "image/webp", "image/svg+xml"}
ALLOWED_VIDEO_TYPES = {"video/mp4", "video/webm", "video/ogg", "video/quicktime"}
ALLOWED_TYPES = ALLOWED_IMAGE_TYPES | ALLOWED_VIDEO_TYPES
MAX_IMAGE_SIZE = 10 * 1024 * 1024  # 10MB for images
MAX_VIDEO_SIZE = 50 * 1024 * 1024  # 50MB for videos


def get_supabase_client() -> Client:
    """Get Supabase client instance."""
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise HTTPException(
            status_code=500,
            detail="Supabase not configured. Set SUPABASE_URL and SUPABASE_KEY."
        )
    return create_client(SUPABASE_URL, SUPABASE_KEY)


@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    """
    Upload an image to Supabase Storage.
    
    Args:
        file: The image file to upload
        
    Returns:
        dict with 'url' containing the public URL of the uploaded image
    """
    # Validate file type
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"File type not allowed. Allowed types: {', '.join(ALLOWED_TYPES)}"
        )
    
    # Read file content
    content = await file.read()
    
    # Validate file size based on type
    is_video = file.content_type in ALLOWED_VIDEO_TYPES
    max_size = MAX_VIDEO_SIZE if is_video else MAX_IMAGE_SIZE
    
    if len(content) > max_size:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size is {max_size // (1024 * 1024)}MB"
        )
    
    # Generate unique filename
    ext = os.path.splitext(file.filename or "image.jpg")[1].lower()
    if not ext:
        # Determine extension from content type
        ext_map = {
            "image/jpeg": ".jpg",
            "image/png": ".png",
            "image/gif": ".gif",
            "image/webp": ".webp",
            "image/svg+xml": ".svg",
            "video/mp4": ".mp4",
            "video/webm": ".webm",
            "video/ogg": ".ogg",
            "video/quicktime": ".mov"
        }
        ext = ext_map.get(file.content_type, ".jpg")
    
    # Create unique filename with timestamp
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    unique_id = str(uuid.uuid4())[:8]
    filename = f"{timestamp}_{unique_id}{ext}"
    
    try:
        supabase = get_supabase_client()
        
        # Upload to Supabase Storage
        response = supabase.storage.from_(STORAGE_BUCKET).upload(
            path=filename,
            file=content,
            file_options={"content-type": file.content_type}
        )
        
        # Get public URL
        public_url = supabase.storage.from_(STORAGE_BUCKET).get_public_url(filename)
        
        return {
            "url": public_url,
            "success": True,
            "filename": filename,
            "mediaType": "video" if is_video else "image"
        }
        
    except Exception as e:
        error_msg = str(e)
        
        # Check for common errors
        if "Bucket not found" in error_msg:
            raise HTTPException(
                status_code=500,
                detail=f"Storage bucket '{STORAGE_BUCKET}' not found. Please create it in Supabase."
            )
        elif "new row violates row-level security" in error_msg:
            raise HTTPException(
                status_code=500,
                detail="Storage bucket RLS policy prevents uploads. Configure bucket for public access."
            )
        else:
            print(f"Upload error: {e}")
            raise HTTPException(
                status_code=500,
                detail=f"Failed to upload image: {error_msg}"
            )
