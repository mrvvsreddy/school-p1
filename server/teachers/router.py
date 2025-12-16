"""
Teachers API Router
CRUD operations for teacher management
"""
import os
import uuid
import logging
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, UploadFile, File
from supabase import create_client, Client

from .schemas import (
    TeacherCreate,
    TeacherUpdate,
    TeacherResponse,
    TeacherListResponse,
)

# Setup logging
logger = logging.getLogger(__name__)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

TABLE_NAME = "teachers"

teachers_router = APIRouter(prefix="/api/teachers", tags=["Teachers"])


def check_supabase():
    """Check if Supabase is connected"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not connected")


@teachers_router.get("", response_model=TeacherListResponse)
async def list_teachers(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    department: Optional[str] = None,
    search: Optional[str] = None,
    active_only: bool = True
):
    """
    List all teachers with optional filtering and pagination
    """
    check_supabase()
    
    try:
        # Start query
        query = supabase.table(TABLE_NAME).select("*", count="exact")
        
        # Apply filters
        if active_only:
            query = query.eq("is_active", True)
        
        if department:
            query = query.eq("department", department)
        
        if search:
            query = query.or_(f"name.ilike.%{search}%,subject.ilike.%{search}%,employee_id.ilike.%{search}%")
        
        # Apply pagination
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)
        
        # Order by name
        query = query.order("name")
        
        result = query.execute()
        
        return TeacherListResponse(
            teachers=result.data,
            total=result.count or len(result.data),
            page=page,
            page_size=page_size
        )
    except Exception as e:
        logger.error(f"Error listing teachers: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch teachers")


@teachers_router.get("/{teacher_id}", response_model=TeacherResponse)
async def get_teacher(teacher_id: UUID):
    """
    Get a single teacher by ID
    """
    check_supabase()
    
    try:
        result = supabase.table(TABLE_NAME).select("*").eq("id", str(teacher_id)).single().execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Teacher not found")
        
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching teacher: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch teacher")


@teachers_router.post("", response_model=TeacherResponse, status_code=201)
async def create_teacher(teacher: TeacherCreate):
    """
    Create a new teacher
    """
    check_supabase()
    
    try:
        # Check for duplicate employee_id
        existing = supabase.table(TABLE_NAME).select("id").eq("employee_id", teacher.employee_id).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Employee ID already exists")
        
        # Prepare data with UUID
        data = teacher.model_dump(by_alias=False, exclude_none=True)
        
        # Convert date objects to ISO strings
        if "join_date" in data and data["join_date"]:
            data["join_date"] = data["join_date"].isoformat() if hasattr(data["join_date"], 'isoformat') else str(data["join_date"])
        
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.utcnow().isoformat()
        data["updated_at"] = datetime.utcnow().isoformat()
        data["is_active"] = True
        
        result = supabase.table(TABLE_NAME).insert(data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create teacher")
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating teacher: {e}")
        raise HTTPException(status_code=500, detail="Failed to create teacher. Check server logs.")


@teachers_router.put("/{teacher_id}", response_model=TeacherResponse)
async def update_teacher(teacher_id: UUID, teacher: TeacherUpdate):
    """
    Update a teacher
    """
    check_supabase()
    
    try:
        # Check if teacher exists
        existing = supabase.table(TABLE_NAME).select("id").eq("id", str(teacher_id)).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Teacher not found")
        
        # Prepare update data (only non-None fields)
        data = teacher.model_dump(by_alias=False, exclude_none=True)
        
        if not data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # Convert date objects to ISO strings
        if "join_date" in data and data["join_date"]:
            data["join_date"] = data["join_date"].isoformat() if hasattr(data["join_date"], 'isoformat') else str(data["join_date"])
        
        data["updated_at"] = datetime.utcnow().isoformat()
        
        result = supabase.table(TABLE_NAME).update(data).eq("id", str(teacher_id)).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update teacher")
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating teacher: {e}")
        raise HTTPException(status_code=500, detail="Failed to update teacher")


@teachers_router.delete("/{teacher_id}")
async def delete_teacher(teacher_id: UUID, hard_delete: bool = False):
    """
    Delete a teacher (soft delete by default)
    """
    check_supabase()
    
    try:
        # Check if teacher exists
        existing = supabase.table(TABLE_NAME).select("id").eq("id", str(teacher_id)).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Teacher not found")
        
        if hard_delete:
            # Permanent delete
            supabase.table(TABLE_NAME).delete().eq("id", str(teacher_id)).execute()
        else:
            # Soft delete
            supabase.table(TABLE_NAME).update({
                "is_active": False,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", str(teacher_id)).execute()
        
        return {"message": "Teacher deleted successfully", "id": str(teacher_id)}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting teacher: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete teacher")


@teachers_router.post("/{teacher_id}/photo")
async def upload_teacher_photo(teacher_id: UUID, file: UploadFile = File(...)):
    """
    Upload a photo for a teacher
    """
    check_supabase()
    
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type. Allowed: JPEG, PNG, WebP")
        
        # Check if teacher exists and get current photo
        existing = supabase.table(TABLE_NAME).select("id, photo_url").eq("id", str(teacher_id)).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Teacher not found")
        
        # Delete old photo if exists
        old_photo_url = existing.data.get("photo_url")
        if old_photo_url:
            try:
                # Extract file path from URL (e.g., teachers/uuid.jpg)
                old_path = old_photo_url.split("/photos/")[-1] if "/photos/" in old_photo_url else None
                if old_path:
                    supabase.storage.from_("photos").remove([old_path])
            except Exception as del_err:
                logger.warning(f"Could not delete old photo: {del_err}")
        
        # Read file content
        content = await file.read()
        
        # Upload to Supabase Storage
        file_ext = file.filename.split(".")[-1] if file.filename else "jpg"
        file_path = f"teachers/{teacher_id}.{file_ext}"
        
        # Upload file (upsert = overwrite if exists)
        supabase.storage.from_("photos").upload(
            file_path,
            content,
            {"content-type": file.content_type, "upsert": "true"}
        )
        
        # Get public URL
        public_url = supabase.storage.from_("photos").get_public_url(file_path)
        
        # Update teacher record with photo URL
        result = supabase.table(TABLE_NAME).update({
            "photo_url": public_url,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", str(teacher_id)).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update teacher record")
        
        return {"message": "Photo uploaded successfully", "photo_url": public_url}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading photo: {e}")
        raise HTTPException(status_code=500, detail="Failed to upload photo")

