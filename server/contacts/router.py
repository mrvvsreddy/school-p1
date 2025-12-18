"""
Contact Requests API Router
CRUD operations for contact form submissions
POST (create) is public, other operations require authentication
"""
import os
import re
import uuid
import logging
from datetime import datetime
from typing import Optional

from fastapi import APIRouter, HTTPException, Query, Depends, Request
from supabase import create_client, Client

# Import authentication utilities
import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from admin.auth_utils import get_current_user, require_admin, TokenData
from security import check_rate_limit

from .schemas import (
    ContactCreate,
    ContactUpdate,
    ContactResponse,
    ContactListResponse,
)

# Setup logging
logger = logging.getLogger(__name__)

# Initialize Supabase client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

TABLE_NAME = "contact_requests"

contacts_router = APIRouter(prefix="/api/contacts", tags=["Contacts"])


def check_supabase():
    """Check if Supabase is connected"""
    if not supabase:
        raise HTTPException(status_code=503, detail="Database not connected")


def sanitize_search(search: str) -> str:
    """
    Sanitize search parameter to prevent SQL injection via PostgREST
    """
    if not search:
        return ""
    # Remove characters that could be used for injection
    sanitized = re.sub(r'[^\w\s\-@.]', '', search)
    return sanitized.strip()


@contacts_router.get("/stats")
async def get_contact_stats(
    current_user: TokenData = Depends(get_current_user)
):
    """
    Get count of new/unread contact requests (requires authentication)
    """
    check_supabase()
    
    try:
        result = supabase.table(TABLE_NAME).select("id", count="exact").eq("status", "new").execute()
        return {"new_count": result.count or 0}
    except Exception as e:
        logger.error(f"Error getting contact stats: {e}")
        return {"new_count": 0}


@contacts_router.get("", response_model=ContactListResponse)
async def list_contacts(
    page: int = Query(1, ge=1),
    page_size: int = Query(50, ge=1, le=100),
    status: Optional[str] = Query(None),
    search: Optional[str] = None,
    current_user: TokenData = Depends(get_current_user)
):
    """
    List all contact requests (requires authentication)
    """
    check_supabase()
    
    try:
        query = supabase.table(TABLE_NAME).select("*", count="exact")
        
        if status:
            query = query.eq("status", status)
        
        if search:
            # Sanitize search to prevent injection
            safe_search = sanitize_search(search)
            if safe_search:
                query = query.or_(f"name.ilike.%{safe_search}%,email.ilike.%{safe_search}%,subject.ilike.%{safe_search}%")
        
        offset = (page - 1) * page_size
        query = query.range(offset, offset + page_size - 1)
        query = query.order("created_at", desc=True)
        
        result = query.execute()
        
        contacts = []
        for c in result.data:
            contacts.append({
                "id": c["id"],
                "name": c["name"],
                "email": c["email"],
                "dial_code": c.get("dial_code", "+91"),
                "phone": c["phone"],
                "subject": c.get("subject"),
                "message": c["message"],
                "status": c.get("status", "new"),
                "notes": c.get("notes"),
                "created_at": c.get("created_at"),
                "updated_at": c.get("updated_at"),
            })
        
        return ContactListResponse(
            contacts=contacts,
            total=result.count or len(result.data),
            page=page,
            page_size=page_size
        )
    except Exception as e:
        logger.error(f"Error listing contacts: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch contacts")


@contacts_router.get("/{contact_id}", response_model=ContactResponse)
async def get_contact(
    contact_id: str,
    current_user: TokenData = Depends(get_current_user)
):
    """
    Get a single contact request by ID (requires authentication)
    """
    check_supabase()
    
    try:
        result = supabase.table(TABLE_NAME).select("*").eq("id", contact_id).single().execute()
        
        if not result.data:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        c = result.data
        return {
            "id": c["id"],
            "name": c["name"],
            "email": c["email"],
            "dial_code": c.get("dial_code", "+91"),
            "phone": c["phone"],
            "subject": c.get("subject"),
            "message": c["message"],
            "status": c.get("status", "new"),
            "notes": c.get("notes"),
            "created_at": c.get("created_at"),
            "updated_at": c.get("updated_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching contact: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch contact")


@contacts_router.post("", response_model=ContactResponse, status_code=201)
async def create_contact(contact: ContactCreate, request: Request):
    """
    Create a new contact request (PUBLIC endpoint - no auth required)
    Rate limited to 10 per minute to prevent spam.
    """
    # Rate limit public form submissions
    check_rate_limit(request, "public_form")
    
    check_supabase()
    
    try:
        data = {
            "id": str(uuid.uuid4()),
            "name": contact.name,
            "email": contact.email,
            "dial_code": contact.dial_code,
            "phone": contact.phone,
            "subject": contact.subject,
            "message": contact.message,
            "status": "new",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        
        result = supabase.table(TABLE_NAME).insert(data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to create contact request")
        
        created = result.data[0]
        return {
            "id": created["id"],
            "name": created["name"],
            "email": created["email"],
            "dial_code": created.get("dial_code", "+91"),
            "phone": created["phone"],
            "subject": created.get("subject"),
            "message": created["message"],
            "status": created.get("status", "new"),
            "notes": created.get("notes"),
            "created_at": created.get("created_at"),
            "updated_at": created.get("updated_at"),
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error creating contact: {e}")
        raise HTTPException(status_code=500, detail="Failed to create contact request")


@contacts_router.patch("/{contact_id}/status")
async def update_contact_status(
    contact_id: str,
    status: str = Query(...),
    current_user: TokenData = Depends(get_current_user)
):
    """
    Update the status of a contact request (requires authentication)
    Valid statuses: new, read, replied, closed
    """
    check_supabase()
    
    if status not in ["new", "read", "replied", "closed"]:
        raise HTTPException(status_code=400, detail="Invalid status. Must be new, read, replied, or closed")
    
    try:
        existing = supabase.table(TABLE_NAME).select("id").eq("id", contact_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        result = supabase.table(TABLE_NAME).update({
            "status": status,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", contact_id).execute()
        
        return {"message": f"Contact status updated to {status}", "id": contact_id, "status": status}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating contact status: {e}")
        raise HTTPException(status_code=500, detail="Failed to update contact status")


@contacts_router.put("/{contact_id}/notes")
async def update_contact_notes(
    contact_id: str,
    notes: str = Query(...),
    current_user: TokenData = Depends(get_current_user)
):
    """
    Add or update notes on a contact request (requires authentication)
    """
    check_supabase()
    
    try:
        existing = supabase.table(TABLE_NAME).select("id").eq("id", contact_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        result = supabase.table(TABLE_NAME).update({
            "notes": notes,
            "updated_at": datetime.utcnow().isoformat()
        }).eq("id", contact_id).execute()
        
        return {"message": "Notes updated", "id": contact_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error updating contact notes: {e}")
        raise HTTPException(status_code=500, detail="Failed to update notes")


@contacts_router.delete("/{contact_id}")
async def delete_contact(
    contact_id: str,
    current_user: TokenData = Depends(require_admin)
):
    """
    Delete a contact request (requires admin role)
    """
    check_supabase()
    
    try:
        existing = supabase.table(TABLE_NAME).select("id").eq("id", contact_id).single().execute()
        if not existing.data:
            raise HTTPException(status_code=404, detail="Contact not found")
        
        supabase.table(TABLE_NAME).delete().eq("id", contact_id).execute()
        
        logger.info(f"Contact {contact_id} deleted by {current_user.email}")
        return {"message": "Contact deleted successfully", "id": contact_id}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error deleting contact: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete contact")

