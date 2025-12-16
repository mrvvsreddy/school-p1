"""
Students API Router
CRUD operations for student management
"""
import os
import uuid
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


def transform_student_data(data: dict) -> dict:
    """Transform frontend field names to database field names"""
    transformed = {}
    
    # Map 'class' to 'class_name' for database
    field_mapping = {
        "class": "class_name",
        "class_name": "class_name",
    }
    
    for key, value in data.items():
        if key in field_mapping:
            transformed[field_mapping[key]] = value
        else:
            transformed[key] = value
    
    return transformed


def transform_db_to_response(row: dict) -> dict:
    """Transform database row to response format"""
    result = dict(row)
    # Map class_name back to class for frontend
    if "class_name" in result:
        result["class"] = result.pop("class_name")
    return result


@students_router.get("", response_model=StudentListResponse)
async def list_students(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    class_filter: Optional[str] = Query(None, alias="class"),
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
        
        if class_filter:
            query = query.eq("class_name", class_filter)
        
        if search:
            query = query.or_(f"name.ilike.%{search}%,roll_no.ilike.%{search}%")
        
        # Apply pagination
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)
        
        # Order by name
        query = query.order("name")
        
        result = query.execute()
        
        # Transform rows
        students = [transform_db_to_response(row) for row in result.data]
        
        return StudentListResponse(
            students=students,
            total=result.count or len(students),
            page=page,
            page_size=page_size
        )
    except Exception as e:
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
        
        return transform_db_to_response(result.data)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch student: {str(e)}")


@students_router.post("", response_model=StudentResponse, status_code=201)
async def create_student(student: StudentCreate):
    """
    Create a new student
    """
    check_supabase()
    
    try:
        # Check for duplicate roll_no
        existing = supabase.table(TABLE_NAME).select("id").eq("roll_no", student.roll_no).execute()
        if existing.data:
            raise HTTPException(status_code=400, detail="Roll number already exists")
        
        # Prepare data with UUID
        data = student.model_dump(by_alias=False, exclude_none=True)
        data = transform_student_data(data)
        data["id"] = str(uuid.uuid4())  # Generate UUID for new student
        data["created_at"] = datetime.utcnow().isoformat()
        data["updated_at"] = datetime.utcnow().isoformat()
        data["is_active"] = True
        
        result = supabase.table(TABLE_NAME).insert(data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create student")
        
        return transform_db_to_response(result.data[0])
    except HTTPException:
        raise
    except Exception as e:
        # Log error on server instead of exposing to client
        print(f"Error creating student: {e}")
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
        
        data = transform_student_data(data)
        data["updated_at"] = datetime.utcnow().isoformat()
        
        result = supabase.table(TABLE_NAME).update(data).eq("id", str(student_id)).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update student")
        
        return transform_db_to_response(result.data[0])
    except HTTPException:
        raise
    except Exception as e:
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
        existing = supabase.table(TABLE_NAME).select("id").eq("id", str(student_id)).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Student not found")
        
        # Read file content
        content = await file.read()
        
        # Upload to Supabase Storage
        file_ext = file.filename.split(".")[-1] if file.filename else "jpg"
        file_path = f"students/{student_id}.{file_ext}"
        
        # Upload file
        storage_result = supabase.storage.from_("photos").upload(
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
        raise HTTPException(status_code=500, detail=f"Failed to upload photo: {str(e)}")
