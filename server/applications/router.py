"""
Applications API Router
CRUD operations for student admission applications
Uses applications table created by setup script
"""
import os
import uuid
import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from supabase import create_client, Client

from .schemas import (
    ApplicationCreate,
    ApplicationUpdate,
    ApplicationResponse,
    ApplicationListResponse,
)

# Setup logging
logger = logging.getLogger(__name__)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Table name from setup script
TABLE_NAME = "applications"

applications_router = APIRouter(prefix="/api/applications", tags=["Applications"])


def check_supabase():
    """Check if Supabase is connected"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not connected")


@applications_router.get("/stats")
async def get_application_stats():
    """
    Get count of pending applications for sidebar indicator
    """
    check_supabase()
    
    try:
        result = supabase.table(TABLE_NAME).select("id", count="exact").eq("status", "pending").execute()
        return {"pending_count": result.count or 0}
    except Exception as e:
        logger.error(f"Error getting application stats: {e}")
        return {"pending_count": 0}


@applications_router.get("", response_model=ApplicationListResponse)
async def list_applications(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    grade: Optional[str] = Query(None),
    search: Optional[str] = None,
):
    """
    List all applications with optional filtering and pagination
    """
    check_supabase()
    
    try:
        # Start query
        query = supabase.table(TABLE_NAME).select("*", count="exact")
        
        # Apply filters
        if status:
            query = query.eq("status", status)
        
        if grade:
            query = query.ilike("grade_applying", f"%{grade}%")
        
        if search:
            query = query.or_(f"student_name.ilike.%{search}%,parent_name.ilike.%{search}%,email.ilike.%{search}%")
        
        # Apply pagination
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)
        
        # Order by newest first
        query = query.order("created_at", desc=True)
        
        result = query.execute()
        
        # Format response
        applications = []
        for app in result.data:
            applications.append({
                "id": app["id"],
                "student_name": app["student_name"],
                "parent_name": app["parent_name"],
                "email": app["email"],
                "phone": app["phone"],
                "grade_applying": app["grade_applying"],
                "date_of_birth": str(app["date_of_birth"]) if app.get("date_of_birth") else None,
                "address": app.get("address"),
                "previous_school": app.get("previous_school"),
                "notes": app.get("notes"),
                "status": app.get("status", "pending"),
                "created_at": app.get("created_at"),
                "updated_at": app.get("updated_at"),
            })
        
        return ApplicationListResponse(
            applications=applications,
            total=result.count or len(result.data),
            page=page,
            page_size=page_size
        )
    except Exception as e:
        logger.error(f"Error listing applications: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch applications: {str(e)}")


@applications_router.get("/{application_id}", response_model=ApplicationResponse)
async def get_application(application_id: str):
    """
    Get a single application by ID
    """
    check_supabase()
    
    try:
        result = supabase.table(TABLE_NAME).select("*").eq("id", application_id).single().execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Application not found")
        
        app = result.data
        return {
            "id": app["id"],
            "student_name": app["student_name"],
            "parent_name": app["parent_name"],
            "email": app["email"],
            "phone": app["phone"],
            "grade_applying": app["grade_applying"],
            "date_of_birth": str(app["date_of_birth"]) if app.get("date_of_birth") else None,
            "address": app.get("address"),
            "previous_school": app.get("previous_school"),
            "notes": app.get("notes"),
            "status": app.get("status", "pending"),
            "created_at": app.get("created_at"),
            "updated_at": app.get("updated_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching application: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch application: {str(e)}")


@applications_router.post("", response_model=ApplicationResponse, status_code=201)
async def create_application(application: ApplicationCreate):
    """
    Create a new application
    """
    check_supabase()
    
    try:
        # Prepare data
        data = {
            "id": str(uuid.uuid4()),
            "student_name": application.student_name,
            "parent_name": application.parent_name,
            "email": application.email,
            "phone": application.phone,
            "grade_applying": application.grade_applying,
            "date_of_birth": application.date_of_birth.isoformat() if application.date_of_birth else None,
            "address": application.address,
            "previous_school": application.previous_school,
            "notes": application.notes,
            "status": "pending",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        
        result = supabase.table(TABLE_NAME).insert(data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create application")
        
        created = result.data[0]
        return {
            "id": created["id"],
            "student_name": created["student_name"],
            "parent_name": created["parent_name"],
            "email": created["email"],
            "phone": created["phone"],
            "grade_applying": created["grade_applying"],
            "date_of_birth": str(created["date_of_birth"]) if created.get("date_of_birth") else None,
            "address": created.get("address"),
            "previous_school": created.get("previous_school"),
            "notes": created.get("notes"),
            "status": created.get("status", "pending"),
            "created_at": created.get("created_at"),
            "updated_at": created.get("updated_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating application: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create application: {str(e)}")


@applications_router.put("/{application_id}", response_model=ApplicationResponse)
async def update_application(application_id: str, application: ApplicationUpdate):
    """
    Update an application
    """
    check_supabase()
    
    try:
        # Check if exists
        existing = supabase.table(TABLE_NAME).select("id").eq("id", application_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Application not found")
        
        # Prepare update data
        data = {}
        if application.student_name is not None:
            data["student_name"] = application.student_name
        if application.parent_name is not None:
            data["parent_name"] = application.parent_name
        if application.email is not None:
            data["email"] = application.email
        if application.phone is not None:
            data["phone"] = application.phone
        if application.grade_applying is not None:
            data["grade_applying"] = application.grade_applying
        if application.date_of_birth is not None:
            data["date_of_birth"] = application.date_of_birth.isoformat()
        if application.address is not None:
            data["address"] = application.address
        if application.previous_school is not None:
            data["previous_school"] = application.previous_school
        if application.notes is not None:
            data["notes"] = application.notes
        if application.status is not None:
            data["status"] = application.status
        
        if not data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        data["updated_at"] = datetime.utcnow().isoformat()
        
        result = supabase.table(TABLE_NAME).update(data).eq("id", application_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update application")
        
        updated = result.data[0]
        return {
            "id": updated["id"],
            "student_name": updated["student_name"],
            "parent_name": updated["parent_name"],
            "email": updated["email"],
            "phone": updated["phone"],
            "grade_applying": updated["grade_applying"],
            "date_of_birth": str(updated["date_of_birth"]) if updated.get("date_of_birth") else None,
            "address": updated.get("address"),
            "previous_school": updated.get("previous_school"),
            "notes": updated.get("notes"),
            "status": updated.get("status", "pending"),
            "created_at": updated.get("created_at"),
            "updated_at": updated.get("updated_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating application: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update application: {str(e)}")


@applications_router.patch("/{application_id}/status")
async def update_application_status(application_id: str, status: str = Query(...)):
    """
    Update only the status of an application (pending, approved, rejected)
    """
    check_supabase()
    
    if status not in ["pending", "approved", "rejected"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be pending, approved, or rejected")
    
    try:
        existing = supabase.table(TABLE_NAME).select("id").eq("id", application_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Application not found")
        
        result = supabase.table(TABLE_NAME).update({
            "status": status,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", application_id).execute()
        
        return {"message": f"Application status updated to {status}", "id": application_id, "status": status}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating application status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update application status: {str(e)}")


@applications_router.delete("/{application_id}")
async def delete_application(application_id: str):
    """
    Delete an application permanently
    """
    check_supabase()
    
    try:
        existing = supabase.table(TABLE_NAME).select("id").eq("id", application_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Application not found")
        
        supabase.table(TABLE_NAME).delete().eq("id", application_id).execute()
        
        return {"message": "Application deleted successfully", "id": application_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting application: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete application: {str(e)}")
