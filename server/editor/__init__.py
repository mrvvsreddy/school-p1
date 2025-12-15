"""
Editor module for handling site content editor functionality.
Provides endpoints for:
- Image upload to Supabase Storage
- Content management utilities
"""

from fastapi import APIRouter
from .upload import router as upload_router

# Create main editor router
editor_router = APIRouter(prefix="/api/editor", tags=["editor"])

# Include sub-routers
editor_router.include_router(upload_router)

__all__ = ["editor_router"]
