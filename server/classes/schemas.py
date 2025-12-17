"""
Pydantic schemas for Classes API
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime
from uuid import UUID


class ClassBase(BaseModel):
    """Base class schema"""
    class_name: str = Field(..., alias="class", min_length=1, max_length=20)
    section: str = Field(..., min_length=1, max_length=10)
    class_teacher_id: Optional[str] = None  # TEXT in DB, can be UUID or employee ID
    capacity: int = Field(default=40, ge=1, le=100)
    room: Optional[str] = None
    academic_year: Optional[str] = "2024-25"
    
    class Config:
        populate_by_name = True


class ClassCreate(ClassBase):
    """Schema for creating a class"""
    pass


class ClassUpdate(BaseModel):
    """Schema for updating a class"""
    class_name: Optional[str] = Field(None, alias="class", min_length=1, max_length=20)
    section: Optional[str] = Field(None, min_length=1, max_length=10)
    class_teacher_id: Optional[str] = None
    capacity: Optional[int] = Field(None, ge=1, le=100)
    room: Optional[str] = None
    academic_year: Optional[str] = None
    is_active: Optional[bool] = None
    
    class Config:
        populate_by_name = True


class ClassResponse(BaseModel):
    """Schema for class response"""
    id: UUID
    class_name: str = Field(..., alias="class")
    section: str
    class_teacher_id: Optional[str] = None
    capacity: int = 40
    room: Optional[str] = None
    academic_year: Optional[str] = "2024-25"
    is_active: bool = True
    created_at: datetime
    updated_at: datetime
    # Computed fields
    students_count: int = 0
    class_teacher_name: Optional[str] = None
    
    class Config:
        populate_by_name = True
        from_attributes = True


class ClassListResponse(BaseModel):
    """Schema for list of classes"""
    classes: List[ClassResponse]
    total: int
    page: int = 1
    page_size: int = 50
