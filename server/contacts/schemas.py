"""
Contact Requests Pydantic schemas
"""
from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, Field


class ContactCreate(BaseModel):
    """Schema for creating a contact request"""
    name: str = Field(..., min_length=1, max_length=100)
    email: str = Field(..., min_length=5, max_length=100)
    dial_code: str = Field(default="+91", max_length=10)
    phone: str = Field(..., min_length=5, max_length=20)
    subject: Optional[str] = None
    message: str = Field(..., min_length=1, max_length=2000)


class ContactUpdate(BaseModel):
    """Schema for updating a contact request"""
    status: Optional[str] = None  # new, read, replied, closed
    notes: Optional[str] = None


class ContactResponse(BaseModel):
    """Schema for contact request response"""
    id: str
    name: str
    email: str
    dial_code: str
    phone: str
    subject: Optional[str] = None
    message: str
    status: str = "new"
    notes: Optional[str] = None
    created_at: Optional[str] = None
    updated_at: Optional[str] = None


class ContactListResponse(BaseModel):
    """Schema for paginated contacts list"""
    contacts: List[ContactResponse]
    total: int
    page: int = 1
    page_size: int = 50
