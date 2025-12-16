"""
Classes API Router
CRUD operations for class management with student count relationships
"""
import os
import uuid
import logging
from datetime import datetime
from typing import Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query
from supabase import create_client, Client

from .schemas import (
    ClassCreate,
    ClassUpdate,
    ClassResponse,
    ClassListResponse,
)

# Setup logging
logger = logging.getLogger(__name__)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

TABLE_NAME = "classes"

classes_router = APIRouter(prefix="/api/classes", tags=["Classes"])


def check_supabase():
    """Check if Supabase is connected"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not connected")


def get_class_with_details(class_data: dict) -> dict:
    """Enrich class data with student count and teacher name"""
    class_id = class_data.get("id")
    
    # Get student count for this class
    try:
        students_result = supabase.table("students").select("id", count="exact").eq("class_id", class_id).eq("is_active", True).execute()
        class_data["students_count"] = students_result.count or 0
    except Exception:
        class_data["students_count"] = 0
    
    # Get class teacher name
    teacher_id = class_data.get("class_teacher_id")
    if teacher_id:
        try:
            teacher = supabase.table("teachers").select("name").eq("id", teacher_id).single().execute()
            class_data["class_teacher_name"] = teacher.data.get("name") if teacher.data else None
        except Exception:
            class_data["class_teacher_name"] = None
    else:
        class_data["class_teacher_name"] = None
    
    return class_data


@classes_router.get("", response_model=ClassListResponse)
async def list_classes(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    search: Optional[str] = None,
    active_only: bool = True
):
    """List all classes with student counts"""
    check_supabase()
    
    try:
        query = supabase.table(TABLE_NAME).select("*", count="exact")
        
        if active_only:
            query = query.eq("is_active", True)
        
        if search:
            query = query.or_(f"class.ilike.%{search}%,section.ilike.%{search}%,room.ilike.%{search}%")
        
        # Pagination
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)
        query = query.order("class").order("section")
        
        result = query.execute()
        
        # Enrich with student counts and teacher names
        classes = [get_class_with_details(c) for c in result.data]
        
        return ClassListResponse(
            classes=classes,
            total=result.count or len(classes),
            page=page,
            page_size=page_size
        )
    except Exception as e:
        logger.error(f"Error listing classes: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch classes")


@classes_router.get("/{class_id}", response_model=ClassResponse)
async def get_class(class_id: UUID):
    """Get a single class by ID"""
    check_supabase()
    
    try:
        result = supabase.table(TABLE_NAME).select("*").eq("id", str(class_id)).single().execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Class not found")
        
        return get_class_with_details(result.data)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching class: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch class")


@classes_router.get("/{class_id}/students")
async def get_class_students(class_id: UUID, page: int = 1, page_size: int = 50):
    """Get all students in a class"""
    check_supabase()
    
    try:
        # Verify class exists
        class_check = supabase.table(TABLE_NAME).select("id").eq("id", str(class_id)).single().execute()
        if not class_check.data:
            raise HTTPException(status_code=404, detail="Class not found")
        
        # Get students
        offset = (page - 1) * page_size
        result = supabase.table("students").select("*", count="exact").eq("class_id", str(class_id)).eq("is_active", True).range(offset, offset + page_size - 1).order("name").execute()
        
        return {
            "students": result.data,
            "total": result.count or len(result.data),
            "page": page,
            "page_size": page_size
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching class students: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch students")


@classes_router.post("", response_model=ClassResponse, status_code=201)
async def create_class(class_data: ClassCreate):
    """Create a new class"""
    check_supabase()
    
    try:
        # Check for duplicate class+section+year
        data = class_data.model_dump(by_alias=False, exclude_none=True)
        
        # Rename class_name to class for DB
        if "class_name" in data:
            data["class"] = data.pop("class_name")
        
        existing = supabase.table(TABLE_NAME).select("id").eq("class", data.get("class", "")).eq("section", data.get("section", "")).eq("academic_year", data.get("academic_year", "2024-25")).execute()
        
        if existing.data:
            raise HTTPException(status_code=400, detail="Class with this section already exists")
        
        # Add system fields
        data["id"] = str(uuid.uuid4())
        data["created_at"] = datetime.utcnow().isoformat()
        data["updated_at"] = datetime.utcnow().isoformat()
        data["is_active"] = True
        
        result = supabase.table(TABLE_NAME).insert(data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create class")
        
        return get_class_with_details(result.data[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating class: {e}")
        raise HTTPException(status_code=500, detail="Failed to create class")


@classes_router.put("/{class_id}", response_model=ClassResponse)
async def update_class(class_id: UUID, class_data: ClassUpdate):
    """Update a class"""
    check_supabase()
    
    try:
        # Check if class exists
        existing = supabase.table(TABLE_NAME).select("id").eq("id", str(class_id)).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Class not found")
        
        data = class_data.model_dump(by_alias=False, exclude_none=True)
        
        if not data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        # Rename class_name to class for DB
        if "class_name" in data:
            data["class"] = data.pop("class_name")
        
        data["updated_at"] = datetime.utcnow().isoformat()
        
        result = supabase.table(TABLE_NAME).update(data).eq("id", str(class_id)).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update class")
        
        return get_class_with_details(result.data[0])
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating class: {e}")
        raise HTTPException(status_code=500, detail="Failed to update class")


@classes_router.delete("/{class_id}")
async def delete_class(class_id: UUID, hard_delete: bool = False):
    """Delete a class (soft delete by default)"""
    check_supabase()
    
    try:
        existing = supabase.table(TABLE_NAME).select("id").eq("id", str(class_id)).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Class not found")
        
        if hard_delete:
            supabase.table(TABLE_NAME).delete().eq("id", str(class_id)).execute()
        else:
            supabase.table(TABLE_NAME).update({
                "is_active": False,
                "updated_at": datetime.utcnow().isoformat()
            }).eq("id", str(class_id)).execute()
        
        return {"message": "Class deleted successfully", "id": str(class_id)}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting class: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete class")
