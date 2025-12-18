"""
Exams API Router
CRUD operations for exam management
"""
import os
import uuid
import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query
from supabase import create_client, Client

from .schemas import (
    ExamCreate,
    ExamUpdate,
    ExamResponse,
    ExamListResponse,
    AcademicYearResponse,
    AcademicYearListResponse,
)

# Setup logging
logger = logging.getLogger(__name__)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

EXAMS_TABLE = "exams"
ACADEMIC_YEARS_TABLE = "academic_years"

exams_router = APIRouter(prefix="/api/exams", tags=["Exams"])


def check_supabase():
    """Check if Supabase is connected"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not connected")


# ============================================================
# EXAM ENDPOINTS
# ============================================================

@exams_router.get("", response_model=ExamListResponse)
async def list_exams(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    academic_year: Optional[str] = Query(None),
    grade: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    search: Optional[str] = None,
):
    """
    List all exams with optional filtering and pagination
    """
    check_supabase()
    
    try:
        # Start query
        query = supabase.table(EXAMS_TABLE).select("*", count="exact")
        
        # Apply filters
        if academic_year:
            query = query.eq("academic_year", academic_year)
        
        if grade:
            query = query.ilike("grade", f"%{grade}%")
        
        if status:
            query = query.eq("status", status)
        
        if search:
            query = query.ilike("subject", f"%{search}%")
        
        # Apply pagination
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)
        
        # Order by date (newest first)
        query = query.order("exam_date", desc=True)
        
        result = query.execute()
        
        # Format response
        exams = []
        for exam in result.data:
            exams.append({
                "id": exam["id"],
                "subject": exam["subject"],
                "grade": exam["grade"],
                "academic_year": exam["academic_year"],
                "exam_date": str(exam["exam_date"]) if exam["exam_date"] else None,
                "start_time": str(exam["start_time"]) if exam["start_time"] else None,
                "end_time": str(exam["end_time"]) if exam["end_time"] else None,
                "duration": exam.get("duration"),
                "location": exam.get("location"),
                "participants": exam.get("participants", 0),
                "status": exam.get("status", "Draft"),
                "color": exam.get("color", "#3B82F6"),
                "created_at": exam.get("created_at"),
                "updated_at": exam.get("updated_at"),
            })
        
        return ExamListResponse(
            exams=exams,
            total=result.count or len(result.data),
            page=page,
            page_size=page_size
        )
    except Exception as e:
        logger.error(f"Error listing exams: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch exams: {str(e)}")


@exams_router.get("/{exam_id}", response_model=ExamResponse)
async def get_exam(exam_id: str):
    """
    Get a single exam by ID
    """
    check_supabase()
    
    try:
        result = supabase.table(EXAMS_TABLE).select("*").eq("id", exam_id).single().execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        exam = result.data
        return {
            "id": exam["id"],
            "subject": exam["subject"],
            "grade": exam["grade"],
            "academic_year": exam["academic_year"],
            "exam_date": str(exam["exam_date"]) if exam["exam_date"] else None,
            "start_time": str(exam["start_time"]) if exam["start_time"] else None,
            "end_time": str(exam["end_time"]) if exam["end_time"] else None,
            "duration": exam.get("duration"),
            "location": exam.get("location"),
            "participants": exam.get("participants", 0),
            "status": exam.get("status", "Draft"),
            "color": exam.get("color", "#3B82F6"),
            "created_at": exam.get("created_at"),
            "updated_at": exam.get("updated_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching exam: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch exam: {str(e)}")


@exams_router.post("", response_model=ExamResponse, status_code=201)
async def create_exam(exam: ExamCreate):
    """
    Create a new exam
    """
    check_supabase()
    
    try:
        # Prepare data
        data = {
            "id": str(uuid.uuid4()),
            "subject": exam.subject,
            "grade": exam.grade,
            "academic_year": exam.academic_year,
            "exam_date": exam.exam_date.isoformat(),
            "start_time": exam.start_time.isoformat(),
            "end_time": exam.end_time.isoformat(),
            "duration": exam.duration,
            "location": exam.location,
            "participants": exam.participants,
            "status": exam.status,
            "color": exam.color,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        
        result = supabase.table(EXAMS_TABLE).insert(data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create exam")
        
        created = result.data[0]
        return {
            "id": created["id"],
            "subject": created["subject"],
            "grade": created["grade"],
            "academic_year": created["academic_year"],
            "exam_date": str(created["exam_date"]),
            "start_time": str(created["start_time"]),
            "end_time": str(created["end_time"]),
            "duration": created.get("duration"),
            "location": created.get("location"),
            "participants": created.get("participants", 0),
            "status": created.get("status", "Draft"),
            "color": created.get("color", "#3B82F6"),
            "created_at": created.get("created_at"),
            "updated_at": created.get("updated_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating exam: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to create exam: {str(e)}")


@exams_router.put("/{exam_id}", response_model=ExamResponse)
async def update_exam(exam_id: str, exam: ExamUpdate):
    """
    Update an exam
    """
    check_supabase()
    
    try:
        # Check if exam exists
        existing = supabase.table(EXAMS_TABLE).select("id").eq("id", exam_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        # Prepare update data (only non-None fields)
        data = {}
        if exam.subject is not None:
            data["subject"] = exam.subject
        if exam.grade is not None:
            data["grade"] = exam.grade
        if exam.academic_year is not None:
            data["academic_year"] = exam.academic_year
        if exam.exam_date is not None:
            data["exam_date"] = exam.exam_date.isoformat()
        if exam.start_time is not None:
            data["start_time"] = exam.start_time.isoformat()
        if exam.end_time is not None:
            data["end_time"] = exam.end_time.isoformat()
        if exam.duration is not None:
            data["duration"] = exam.duration
        if exam.location is not None:
            data["location"] = exam.location
        if exam.participants is not None:
            data["participants"] = exam.participants
        if exam.status is not None:
            data["status"] = exam.status
        if exam.color is not None:
            data["color"] = exam.color
        
        if not data:
            raise HTTPException(status_code=400, detail="No fields to update")
        
        data["updated_at"] = datetime.utcnow().isoformat()
        
        result = supabase.table(EXAMS_TABLE).update(data).eq("id", exam_id).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to update exam")
        
        updated = result.data[0]
        return {
            "id": updated["id"],
            "subject": updated["subject"],
            "grade": updated["grade"],
            "academic_year": updated["academic_year"],
            "exam_date": str(updated["exam_date"]),
            "start_time": str(updated["start_time"]),
            "end_time": str(updated["end_time"]),
            "duration": updated.get("duration"),
            "location": updated.get("location"),
            "participants": updated.get("participants", 0),
            "status": updated.get("status", "Draft"),
            "color": updated.get("color", "#3B82F6"),
            "created_at": updated.get("created_at"),
            "updated_at": updated.get("updated_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating exam: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update exam: {str(e)}")


@exams_router.patch("/{exam_id}/status")
async def update_exam_status(exam_id: str, status: str = Query(...)):
    """
    Update only the status of an exam (Draft, Scheduled, Completed)
    """
    check_supabase()
    
    if status not in ["Draft", "Scheduled", "Completed"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be Draft, Scheduled, or Completed")
    
    try:
        # Check if exam exists
        existing = supabase.table(EXAMS_TABLE).select("id").eq("id", exam_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        result = supabase.table(EXAMS_TABLE).update({
            "status": status,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", exam_id).execute()
        
        return {"message": f"Exam status updated to {status}", "id": exam_id, "status": status}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating exam status: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to update exam status: {str(e)}")


@exams_router.delete("/{exam_id}")
async def delete_exam(exam_id: str):
    """
    Delete an exam permanently
    """
    check_supabase()
    
    try:
        # Check if exam exists
        existing = supabase.table(EXAMS_TABLE).select("id").eq("id", exam_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        supabase.table(EXAMS_TABLE).delete().eq("id", exam_id).execute()
        
        return {"message": "Exam deleted successfully", "id": exam_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting exam: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to delete exam: {str(e)}")


@exams_router.post("/{exam_id}/duplicate", response_model=ExamResponse)
async def duplicate_exam(exam_id: str):
    """
    Duplicate an existing exam as a new draft
    """
    check_supabase()
    
    try:
        # Get existing exam
        existing = supabase.table(EXAMS_TABLE).select("*").eq("id", exam_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Exam not found")
        
        original = existing.data
        
        # Create duplicate
        data = {
            "id": str(uuid.uuid4()),
            "subject": f"{original['subject']} (Copy)",
            "grade": original["grade"],
            "academic_year": original["academic_year"],
            "exam_date": original["exam_date"],
            "start_time": original["start_time"],
            "end_time": original["end_time"],
            "duration": original.get("duration"),
            "location": original.get("location"),
            "participants": 0,  # Reset participants
            "status": "Draft",  # Always starts as draft
            "color": original.get("color", "#3B82F6"),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        
        result = supabase.table(EXAMS_TABLE).insert(data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to duplicate exam")
        
        created = result.data[0]
        return {
            "id": created["id"],
            "subject": created["subject"],
            "grade": created["grade"],
            "academic_year": created["academic_year"],
            "exam_date": str(created["exam_date"]),
            "start_time": str(created["start_time"]),
            "end_time": str(created["end_time"]),
            "duration": created.get("duration"),
            "location": created.get("location"),
            "participants": created.get("participants", 0),
            "status": created.get("status", "Draft"),
            "color": created.get("color", "#3B82F6"),
            "created_at": created.get("created_at"),
            "updated_at": created.get("updated_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error duplicating exam: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to duplicate exam: {str(e)}")


# ============================================================
# ACADEMIC YEAR ENDPOINTS
# ============================================================

@exams_router.get("/academic-years/list", response_model=AcademicYearListResponse)
async def list_academic_years():
    """
    Get all academic years
    """
    check_supabase()
    
    try:
        result = supabase.table(ACADEMIC_YEARS_TABLE).select("*").eq("is_active", True).order("year_name", desc=True).execute()
        
        years = []
        for year in result.data:
            years.append({
                "id": year["id"],
                "year_name": year["year_name"],
                "start_date": str(year["start_date"]) if year.get("start_date") else None,
                "end_date": str(year["end_date"]) if year.get("end_date") else None,
                "is_current": year.get("is_current", False),
                "is_active": year.get("is_active", True),
                "created_at": year.get("created_at"),
                "updated_at": year.get("updated_at"),
            })
        
        return AcademicYearListResponse(
            academic_years=years,
            total=len(years)
        )
    except Exception as e:
        logger.error(f"Error listing academic years: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch academic years: {str(e)}")


@exams_router.get("/academic-years/current", response_model=AcademicYearResponse)
async def get_current_academic_year():
    """
    Get the current active academic year
    """
    check_supabase()
    
    try:
        result = supabase.table(ACADEMIC_YEARS_TABLE).select("*").eq("is_current", True).single().execute()
        
        if not result.data:
            # Fallback to most recent
            result = supabase.table(ACADEMIC_YEARS_TABLE).select("*").eq("is_active", True).order("year_name", desc=True).limit(1).execute()
            if result.data:
                year = result.data[0]
            else:
                raise HTTPException(status_code=404, detail="No academic year found")
        else:
            year = result.data
        
        return {
            "id": year["id"],
            "year_name": year["year_name"],
            "start_date": str(year["start_date"]) if year.get("start_date") else None,
            "end_date": str(year["end_date"]) if year.get("end_date") else None,
            "is_current": year.get("is_current", False),
            "is_active": year.get("is_active", True),
            "created_at": year.get("created_at"),
            "updated_at": year.get("updated_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching current academic year: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to fetch current academic year: {str(e)}")
