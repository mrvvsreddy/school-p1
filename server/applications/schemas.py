"""
Applications Pydantic schemas
"""
from datetime import datetime, date
from typing import Optional, List
from pydantic import BaseModel, Field


class ApplicationBase(BaseModel):
    """Base application fields"""
    student_name: str = Field(..., min_length=1, max_length=100)
    parent_name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=5, max_length=100)
    phone: str = Field(..., min_length=5, max_length=30)
    grade_applying: str = Field(..., min_length=1, max_length=20)
    date_of_birth: Optional[date] = None
    address: Optional[str] = None
    previous_school: Optional[str] = None
    notes: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    """Schema for creating an application"""
    pass


class ApplicationUpdate(BaseModel):
    """Schema for updating an application (all fields optional)"""
    student_name: Optional[str] = None
    parent_name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    grade_applying: Optional[str] = None
    notes: Optional[str] = None
    status: Optional[str] = None  # pending, approved, rejected


class ApplicationResponse(BaseModel):
    """Schema for application response"""
    id: str
    application_id: Optional[str] = None
    student_name: str
    parent_name: str
    email: str
    phone: str
    grade_applying: str
    date_of_birth: Optional[str] = None
    address: Optional[str] = None
    previous_school: Optional[str] = None
    notes: Optional[str] = None
    status: str = "pending"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class ApplicationListResponse(BaseModel):
    """Schema for paginated applications list"""
    applications: List[ApplicationResponse]
    total: int
    page: int = 1
    page_size: int = 50
