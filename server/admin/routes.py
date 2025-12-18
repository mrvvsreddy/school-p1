"""
School Admin API Routes
FastAPI routes for all admin operations
All routes require authentication
"""

import re
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from pydantic import BaseModel, field_validator
from datetime import date, time, datetime
from decimal import Decimal

# Import authentication utilities
from .auth_utils import get_current_user, require_admin, TokenData

router = APIRouter(prefix="/api/admin", tags=["admin"])

# ============= PYDANTIC MODELS =============

# Student Models
class StudentBase(BaseModel):
    student_id: str
    name: str
    class_name: str = ""
    section: Optional[str] = None
    roll_number: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    address: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None
    parent_email: Optional[str] = None
    admission_date: Optional[date] = None
    status: str = "active"
    photo_url: Optional[str] = None

    class Config:
        from_attributes = True

class StudentCreate(StudentBase):
    pass

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    class_name: Optional[str] = None
    section: Optional[str] = None
    roll_number: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    status: Optional[str] = None

# Teacher Models
class TeacherBase(BaseModel):
    teacher_id: str
    name: str
    subject: Optional[str] = None
    qualification: Optional[str] = None
    experience: Optional[int] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None
    joining_date: Optional[date] = None
    salary: Optional[Decimal] = None
    status: str = "active"
    photo_url: Optional[str] = None

class TeacherCreate(TeacherBase):
    pass


class TeacherUpdate(BaseModel):
    """Model for updating teacher - only includes updatable fields"""
    name: Optional[str] = None
    subject: Optional[str] = None
    qualification: Optional[str] = None
    experience: Optional[int] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None
    salary: Optional[Decimal] = None
    status: Optional[str] = None
    photo_url: Optional[str] = None

# Class Models
class ClassBase(BaseModel):
    class_name: str
    section: Optional[str] = None
    class_teacher_id: Optional[int] = None
    room_number: Optional[str] = None
    capacity: Optional[int] = None
    subjects: List[dict] = []
    schedule: dict = {}

class ClassCreate(ClassBase):
    pass

# Exam Models
class ExamBase(BaseModel):
    exam_name: str
    exam_type: Optional[str] = None
    class_name: str = ""
    subject: Optional[str] = None
    date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    total_marks: Optional[int] = None
    passing_marks: Optional[int] = None
    status: str = "scheduled"

class ExamCreate(ExamBase):
    pass

# Notice Models
class NoticeBase(BaseModel):
    title: str
    content: str
    category: Optional[str] = None
    priority: str = "normal"
    target_audience: Optional[str] = None
    published_by: Optional[str] = None
    published_date: Optional[date] = None
    expiry_date: Optional[date] = None
    status: str = "draft"
    attachments: List[dict] = []

class NoticeCreate(NoticeBase):
    pass


class NoticeUpdate(BaseModel):
    """Model for updating notice"""
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    target_audience: Optional[str] = None
    expiry_date: Optional[date] = None
    status: Optional[str] = None

# Admission Application Models
class AdmissionApplicationCreate(BaseModel):
    student_name: str
    parent_name: str
    email: str
    dial_code: str = "+91"
    phone: str
    class_applying: str

class AdmissionApplicationUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

def get_supabase():
    """Get Supabase client from main app"""
    from server import supabase
    if not supabase:
        raise HTTPException(status_code=500, detail="Database not configured")
    return supabase


def sanitize_search(search: str) -> str:
    """
    Sanitize search parameter to prevent SQL injection via PostgREST
    Removes special characters that could manipulate queries
    """
    if not search:
        return ""
    # Remove characters that could be used for injection in PostgREST
    # Allow only alphanumeric, spaces, and common safe characters
    sanitized = re.sub(r'[^\w\s\-@.]', '', search)
    return sanitized.strip()


# ============= STUDENT ROUTES =============

@router.get("/students")
async def get_students(
    class_name: Optional[str] = None,
    status: Optional[str] = None,
    search: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user)
):
    """Get all students with optional filters (requires authentication)"""
    db = get_supabase()
    
    query = db.table("students").select("*")
    
    if class_name:
        query = query.eq("class", class_name)
    if status:
        query = query.eq("status", status)
    if search:
        # Sanitize search to prevent injection
        safe_search = sanitize_search(search)
        if safe_search:
            query = query.or_(f"name.ilike.%{safe_search}%,student_id.ilike.%{safe_search}%")
    
    result = query.order("name").execute()
    return {"students": result.data}

@router.post("/students")
async def create_student(
    student: StudentCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new student (requires authentication)"""
    db = get_supabase()
    
    student_dict = student.model_dump()
    student_dict["class"] = student_dict.pop("class_name", "")
    
    result = db.table("students").insert(student_dict).execute()
    return {"success": True, "student": result.data[0]}

@router.get("/students/{student_id}")
async def get_student(
    student_id: int,
    current_user: TokenData = Depends(get_current_user)
):
    """Get a specific student by ID (requires authentication)"""
    db = get_supabase()
    
    result = db.table("students").select("*").eq("id", student_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Student not found")
    
    return result.data[0]

@router.put("/students/{student_id}")
async def update_student(
    student_id: int,
    student: StudentUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    """Update a student (requires authentication)"""
    db = get_supabase()
    
    update_data = {k: v for k, v in student.model_dump().items() if v is not None}
    if "class_name" in update_data:
        update_data["class"] = update_data.pop("class_name")
    
    result = db.table("students").update(update_data).eq("id", student_id).execute()
    return {"success": True, "student": result.data[0]}

@router.delete("/students/{student_id}")
async def delete_student(
    student_id: int,
    current_user: TokenData = Depends(require_admin)
):
    """Delete a student (requires admin role)"""
    db = get_supabase()
    
    db.table("students").delete().eq("id", student_id).execute()
    return {"success": True, "message": "Student deleted"}

# ============= TEACHER ROUTES =============

@router.get("/teachers")
async def get_teachers(
    subject: Optional[str] = None,
    status: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user)
):
    """Get all teachers (requires authentication)"""
    db = get_supabase()
    
    query = db.table("teachers").select("*")
    
    if subject:
        query = query.eq("subject", subject)
    if status:
        query = query.eq("status", status)
    
    result = query.order("name").execute()
    return {"teachers": result.data}

@router.post("/teachers")
async def create_teacher(
    teacher: TeacherCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new teacher (requires authentication)"""
    db = get_supabase()
    
    result = db.table("teachers").insert(teacher.model_dump()).execute()
    return {"success": True, "teacher": result.data[0]}

@router.put("/teachers/{teacher_id}")
async def update_teacher(
    teacher_id: int,
    teacher: TeacherUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    """Update a teacher (requires authentication)"""
    db = get_supabase()
    
    update_data = {k: v for k, v in teacher.model_dump().items() if v is not None}
    result = db.table("teachers").update(update_data).eq("id", teacher_id).execute()
    return {"success": True, "teacher": result.data[0]}

@router.delete("/teachers/{teacher_id}")
async def delete_teacher(
    teacher_id: int,
    current_user: TokenData = Depends(require_admin)
):
    """Delete a teacher (requires admin role)"""
    db = get_supabase()
    
    db.table("teachers").delete().eq("id", teacher_id).execute()
    return {"success": True, "message": "Teacher deleted"}

# ============= CLASS ROUTES =============

@router.get("/classes")
async def get_classes(
    current_user: TokenData = Depends(get_current_user)
):
    """Get all classes (requires authentication)"""
    db = get_supabase()
    
    result = db.table("classes").select("*").execute()
    return {"classes": result.data}

@router.post("/classes")
async def create_class(
    class_data: ClassCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new class (requires authentication)"""
    db = get_supabase()
    
    result = db.table("classes").insert(class_data.model_dump()).execute()
    return {"success": True, "class": result.data[0]}

# ============= EXAM ROUTES =============

@router.get("/exams")
async def get_exams(
    class_name: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user)
):
    """Get all exams (requires authentication)"""
    db = get_supabase()
    
    query = db.table("exams").select("*")
    if class_name:
        query = query.eq("class", class_name)
    
    result = query.order("date", desc=True).execute()
    return {"exams": result.data}

@router.post("/exams")
async def create_exam(
    exam: ExamCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new exam (requires authentication)"""
    db = get_supabase()
    
    exam_dict = exam.model_dump()
    exam_dict["class"] = exam_dict.pop("class_name", "")
    
    result = db.table("exams").insert(exam_dict).execute()
    return {"success": True, "exam": result.data[0]}

# ============= NOTICE ROUTES =============

@router.get("/notices")
async def get_notices(
    status: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user)
):
    """Get all notices (requires authentication)"""
    db = get_supabase()
    
    query = db.table("notices").select("*")
    if status:
        query = query.eq("status", status)
    
    result = query.order("created_at", desc=True).execute()
    return {"notices": result.data}

@router.post("/notices")
async def create_notice(
    notice: NoticeCreate,
    current_user: TokenData = Depends(get_current_user)
):
    """Create a new notice (requires authentication)"""
    db = get_supabase()
    
    result = db.table("notices").insert(notice.model_dump()).execute()
    return {"success": True, "notice": result.data[0]}

@router.put("/notices/{notice_id}")
async def update_notice(
    notice_id: int,
    notice: NoticeUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    """Update a notice (requires authentication)"""
    db = get_supabase()
    
    update_data = {k: v for k, v in notice.model_dump().items() if v is not None}
    result = db.table("notices").update(update_data).eq("id", notice_id).execute()
    return {"success": True, "notice": result.data[0]}

# ============= SETTINGS ROUTES =============

@router.get("/settings")
async def get_settings(
    category: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user)
):
    """Get all settings (requires authentication)"""
    db = get_supabase()
    
    query = db.table("school_settings").select("*")
    if category:
        query = query.eq("category", category)
    
    result = query.execute()
    return {"settings": result.data}

@router.put("/settings/{setting_key}")
async def update_setting(
    setting_key: str,
    value: dict,
    current_user: TokenData = Depends(require_admin)
):
    """Update a setting (requires admin role)"""
    db = get_supabase()
    
    result = db.table("school_settings").upsert({
        "setting_key": setting_key,
        "setting_value": value,
        "updated_at": datetime.now().isoformat()
    }, on_conflict="setting_key").execute()
    
    return {"success": True, "setting": result.data[0]}

# ============= ADMISSION APPLICATION ROUTES =============

def generate_application_id():
    """Generate unique application ID like APP-2024-0001"""
    year = datetime.now().year
    import random
    num = random.randint(1000, 9999)
    return f"APP-{year}-{num}"

@router.get("/admissions/applications")
async def get_admission_applications(
    status: Optional[str] = None,
    class_applying: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user)
):
    """Get all admission applications (requires authentication)"""
    db = get_supabase()
    
    query = db.table("admission_applications").select("*")
    
    if status:
        query = query.eq("status", status)
    if class_applying:
        query = query.eq("class_applying", class_applying)
    
    result = query.order("created_at", desc=True).execute()
    return {"applications": result.data}

@router.post("/admissions/apply")
async def submit_admission_application(application: AdmissionApplicationCreate):
    """
    Submit a new admission application (PUBLIC endpoint - no auth required)
    This allows prospective parents/students to apply.
    """
    db = get_supabase()
    
    # Generate unique application ID
    app_id = generate_application_id()
    
    # Prepare data for insertion
    app_data = application.model_dump()
    app_data["application_id"] = app_id
    app_data["status"] = "pending"
    
    result = db.table("admission_applications").insert(app_data).execute()
    
    return {
        "success": True, 
        "message": "Application submitted successfully",
        "application_id": app_id,
        "application": result.data[0]
    }

@router.get("/admissions/applications/{app_id}")
async def get_admission_application(
    app_id: int,
    current_user: TokenData = Depends(get_current_user)
):
    """Get a specific admission application (requires authentication)"""
    db = get_supabase()
    
    result = db.table("admission_applications").select("*").eq("id", app_id).execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return result.data[0]

@router.put("/admissions/applications/{app_id}")
async def update_admission_application(
    app_id: int,
    update: AdmissionApplicationUpdate,
    current_user: TokenData = Depends(get_current_user)
):
    """Update admission application status/notes (requires authentication)"""
    db = get_supabase()
    
    update_data = {k: v for k, v in update.model_dump().items() if v is not None}
    update_data["updated_at"] = datetime.now().isoformat()
    
    result = db.table("admission_applications").update(update_data).eq("id", app_id).execute()
    
    if not result.data:
        raise HTTPException(status_code=404, detail="Application not found")
    
    return {"success": True, "application": result.data[0]}

@router.delete("/admissions/applications/{app_id}")
async def delete_admission_application(
    app_id: int,
    current_user: TokenData = Depends(require_admin)
):
    """Delete an admission application (requires admin role)"""
    db = get_supabase()
    
    db.table("admission_applications").delete().eq("id", app_id).execute()
    return {"success": True, "message": "Application deleted"}

