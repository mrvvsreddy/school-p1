"""
Pydantic schemas for Teacher API

Schema Design:
- Fixed columns: School-essential data (id, name, employee_id, department, subject, join_date, photo)
- personal_info JSONB: Flexible personal data (contact, address, bank details, etc.)
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import date, datetime
from uuid import UUID


class TeacherBase(BaseModel):
    """Base teacher schema - school-essential columns only"""
    # Required school data
    name: str = Field(..., min_length=1, max_length=100)
    employee_id: str = Field(..., min_length=1, max_length=20)
    subject: str = Field(..., min_length=1, max_length=100)
    
    # Optional school records
    department: Optional[str] = None  # Optional - subject already identifies teaching area
    designation: Optional[str] = None
    join_date: Optional[date] = None
    photo_url: Optional[str] = None
    status: Optional[str] = "Active"
    
    # Flexible personal info (JSONB)
    personal_info: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True


class TeacherCreate(TeacherBase):
    """Schema for creating a teacher"""
    pass


class TeacherUpdate(BaseModel):
    """Schema for updating a teacher (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    employee_id: Optional[str] = Field(None, min_length=1, max_length=20)
    department: Optional[str] = Field(None, min_length=1, max_length=50)
    subject: Optional[str] = Field(None, min_length=1, max_length=100)
    designation: Optional[str] = None
    join_date: Optional[date] = None
    photo_url: Optional[str] = None
    status: Optional[str] = None
    personal_info: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    
    class Config:
        populate_by_name = True


class TeacherResponse(TeacherBase):
    """Schema for teacher response"""
    id: UUID
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        from_attributes = True


class TeacherListResponse(BaseModel):
    """Schema for list of teachers"""
    teachers: List[TeacherResponse]
    total: int
    page: int = 1
    page_size: int = 50
