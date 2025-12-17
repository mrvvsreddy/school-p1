"""
Pydantic schemas for Student API

Schema Design:
- Uses class_id FK to reference classes table
- personal_info JSONB: Flexible personal data (contact, parents, address, etc.)
"""
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import date, datetime
from uuid import UUID


class PersonalInfo(BaseModel):
    """Flexible personal information - teachers can add any fields"""
    # Contact
    phone: Optional[str] = None
    email: Optional[str] = None
    
    # Address
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    
    # Personal
    dob: Optional[str] = None  # String for flexibility
    gender: Optional[str] = None
    blood_group: Optional[str] = None
    
    # Parents/Guardian
    father_name: Optional[str] = None
    mother_name: Optional[str] = None
    guardian_name: Optional[str] = None
    guardian_phone: Optional[str] = None
    guardian_email: Optional[str] = None
    
    # Previous school
    previous_school: Optional[str] = None
    
    # Allow any additional fields teachers want to add
    class Config:
        extra = "allow"


class StudentBase(BaseModel):
    """Base student schema - uses class_id FK"""
    # Required school data
    name: str = Field(..., min_length=1, max_length=100)
    roll_no: str = Field(..., min_length=1, max_length=20)
    class_id: UUID  # FK to classes table
    
    # School records
    admission_no: Optional[str] = None
    admission_date: Optional[date] = None
    photo_url: Optional[str] = None
    
    # Flexible personal info (JSONB)
    personal_info: Optional[Dict[str, Any]] = Field(default_factory=dict)
    
    class Config:
        populate_by_name = True


class StudentCreate(StudentBase):
    """Schema for creating a student"""
    pass


class StudentUpdate(BaseModel):
    """Schema for updating a student (all fields optional)"""
    name: Optional[str] = Field(None, min_length=1, max_length=100)
    roll_no: Optional[str] = Field(None, min_length=1, max_length=20)
    class_id: Optional[UUID] = None
    admission_no: Optional[str] = None
    admission_date: Optional[date] = None
    photo_url: Optional[str] = None
    personal_info: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None
    
    class Config:
        populate_by_name = True


class StudentResponse(BaseModel):
    """Schema for student response"""
    id: UUID
    name: str
    roll_no: str
    class_id: UUID
    admission_no: Optional[str] = None
    admission_date: Optional[date] = None
    photo_url: Optional[str] = None
    personal_info: Optional[Dict[str, Any]] = None
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    
    class Config:
        populate_by_name = True
        from_attributes = True


class StudentListResponse(BaseModel):
    """Schema for list of students"""
    students: List[StudentResponse]
    total: int
    page: int = 1
    page_size: int = 50
