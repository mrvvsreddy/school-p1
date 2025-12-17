"""
Students API Router
CRUD operations for student management with class_id FK
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
    StudentCreate,
    StudentUpdate,
    StudentResponse,
    StudentListResponse,
)

# Setup logging
logger = logging.getLogger(__name__)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

TABLE_NAME = "students"

students_router = APIRouter(prefix="/api/students", tags=["Students"])


def check_supabase():
    """Check if Supabase is connected"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not connected")


@students_router.get("", response_model=StudentListResponse)
async def list_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    class_id: Optional[str] = Query(None),  # Filter by class_id
    search: Optional[str] = None,
    active_only: bool = True
):
    """
    List all students with optional filtering and pagination
    """
    check_supabase()
    
    try:
        # Start query
        query = supabase.table(TABLE_NAME).select("*", count="exact")
        
        # Apply filters
        if active_only:
            query = query.eq("is_active", True)
        
        if class_id:
            query = query.eq("class_id", class_id)
        
        if search:
            query = query.or_(f"name.ilike.%{search}%,roll_no.ilike.%{search}%")
        
        # Apply pagination
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)
        
        # Order by name
        query = query.order("name")
        
        result = query.execute()
        
        return StudentListResponse(
            students=result.data,
            total=result.count or len(result.data),
            page=page,
            page_size=page_size
        )
    except Exception as e:
        logger.error(f"Error listing students: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch students: {str(e)}")


@students_router.get("/{student_id}", response_model=StudentResponse)
async def get_student(student_id: UUID):
    """
    Get a single student by ID
    """
    check_supabase()
    
    try:
        result = supabase.table(TABLE_NAME).select("*").eq("id", str(student_id)).single().execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Student not found")
        
        return result.data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching student: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch student: {str(e)}")


@students_router.post("", response_model=StudentResponse, status_code=201)
async def create_student(student: StudentCreate):
    """
    Create a new student
    """
    check_supabase()
    
    try:
        # Check for duplicate roll_no within the same class
        existing = supabase.table(TABLE_NAME).select("id").eq("roll_no", student.roll_no).eq("class_id", str(student.class_id)).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Roll number already exists in this class")
        
        # Prepare data
        data = student.model_dump(by_alias=False, exclude_none=True)
        
        # Convert UUID to string
        data["class_id"] = str(data["class_id"])
        
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.utcnow().isoformat()
        data["updated_at"] = datetime.utcnow().isoformat()
        data["is_active"] = True
        
        # Convert admission_date if present
        if "admission_date" in data and data["admission_date"]:
            data["admission_date"] = data["admission_date"].isoformat() if hasattr(data["admission_date"], 'isoformat') else str(data["admission_date"])
        
        result = supabase.table(TABLE_NAME).insert(data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create student")
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating student: {e}")
        raise HTTPException(status_code=500, detail="Failed to create student. Check server logs.")


@students_router.put("/{student_id}", response_model=StudentResponse)
async def update_student(student_id: UUID, student: StudentUpdate):
    """
    Update a student
    """
    check_supabase()
    
    try:
        # Check if student exists
        existing = supabase.table(TABLE_NAME).select("id").eq("id", str(student_id)).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Prepare update data (only non-None fields)
        data = student.model_dump(by_alias=False, exclude_none=True)
        
        if not data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # Convert UUID if present
        if "class_id" in data:
            data["class_id"] = str(data["class_id"])
        
        # Convert admission_date if present
        if "admission_date" in data and data["admission_date"]:
            data["admission_date"] = data["admission_date"].isoformat() if hasattr(data["admission_date"], 'isoformat') else str(data["admission_date"])
        
        data["updated_at"] = datetime.utcnow().isoformat()
        
        result = supabase.table(TABLE_NAME).update(data).eq("id", str(student_id)).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update student")
        
        return result.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating student: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update student: {str(e)}")


@students_router.delete("/{student_id}")
async def delete_student(student_id: UUID, hard_delete: bool = False):
    """
    Delete a student (soft delete by default)
    """
    check_supabase()
    
    try:
        # Check if student exists
        existing = supabase.table(TABLE_NAME).select("id").eq("id", str(student_id)).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Student not found")
        
        if hard_delete:
            # Permanent delete
            supabase.table(TABLE_NAME).delete().eq("id", str(student_id)).execute()
        else:
            # Soft delete
            supabase.table(TABLE_NAME).update({
                "is_active": False,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", str(student_id)).execute()
        
        return {"message": "Student deleted successfully", "id": str(student_id)}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting student: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete student: {str(e)}")


@students_router.post("/{student_id}/photo")
async def upload_student_photo(student_id: UUID, file: UploadFile = File(...)):
    """
    Upload a photo for a student
    """
    check_supabase()
    
    try:
        # Validate file type
        allowed_types = ["image/jpeg", "image/png", "image/webp"]
        if file.content_type not in allowed_types:
            raise HTTPException(status_code=400, detail="Invalid file type. Allowed: JPEG, PNG, WebP")
        
        # Check if student exists
        existing = supabase.table(TABLE_NAME).select("id, photo_url").eq("id", str(student_id)).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Delete old photo if exists
        old_photo_url = existing.data.get("photo_url")
        if old_photo_url:
            try:
                old_path = old_photo_url.split("/photos/")[-1] if "/photos/" in old_photo_url else None
                if old_path:
                    supabase.storage.from_("photos").remove([old_path])
            except Exception as del_err:
                logger.warning(f"Could not delete old photo: {del_err}")
        
        # Read file content
        content = await file.read()
        
        # Upload to Supabase Storage
        file_ext = file.filename.split(".")[-1] if file.filename else "jpg"
        file_path = f"students/{student_id}.{file_ext}"
        
        # Upload file
        supabase.storage.from_("photos").upload(
            file_path,
            content,
            {"content-type": file.content_type, "upsert": "true"}
        )
        
        # Get public URL
        public_url = supabase.storage.from_("photos").get_public_url(file_path)
        
        # Update student record with photo URL
        supabase.table(TABLE_NAME).update({
            "photo_url": public_url,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", str(student_id)).execute()
        
        return {"message": "Photo uploaded successfully", "photo_url": public_url}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error uploading photo: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to upload photo: {str(e)}")
