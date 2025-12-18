"""
Exam Pydantic Schemas
"""
from datetime import date, time, datetime
from typing import Optional, List
from uuid import UUID
from pydantic import BaseModel, Field


class ExamBase(BaseModel):
    """Base exam schema with common fields"""
    subject: str = Field(..., min_length=1, max_length=100)
    grade: str = Field(..., min_length=1, max_length=20)
    academic_year: str = Field(..., min_length=1, max_length=10)
    exam_date: date
    start_time: time
    end_time: time
    duration: Optional[str] = None
    location: Optional[str] = None
    participants: int = 0
    status: str = "Draft"  # Draft, Scheduled, Completed
    color: str = "#3B82F6"


class ExamCreate(ExamBase):
    """Schema for creating an exam"""
    pass


class ExamUpdate(BaseModel):
    """Schema for updating an exam (all fields optional)"""
    subject: Optional[str] = None
    grade: Optional[str] = None
    academic_year: Optional[str] = None
    exam_date: Optional[date] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None
    duration: Optional[str] = None
    location: Optional[str] = None
    participants: Optional[int] = None
    status: Optional[str] = None
    color: Optional[str] = None


class ExamResponse(BaseModel):
    """Response schema for a single exam"""
    id: str
    subject: str
    grade: str
    academic_year: str
    exam_date: str  # Will be formatted as string
    start_time: str
    end_time: str
    duration: Optional[str] = None
    location: Optional[str] = None
    participants: int = 0
    status: str = "Draft"
    color: str = "#3B82F6"
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class ExamListResponse(BaseModel):
    """Response schema for list of exams"""
    exams: List[ExamResponse]
    total: int
    page: int
    page_size: int


# Academic Year Schemas
class AcademicYearBase(BaseModel):
    """Base academic year schema"""
    year_name: str = Field(..., min_length=1, max_length=10)
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    is_current: bool = False
    is_active: bool = True


class AcademicYearCreate(AcademicYearBase):
    """Schema for creating academic year"""
    pass


class AcademicYearResponse(BaseModel):
    """Response schema for academic year"""
    id: str
    year_name: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_current: bool = False
    is_active: bool = True
    created_at: Optional[str] = None
    updated_at: Optional[str] = None

    class Config:
        from_attributes = True


class AcademicYearListResponse(BaseModel):
    """Response schema for list of academic years"""
    academic_years: List[AcademicYearResponse]
    total: int
