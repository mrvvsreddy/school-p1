"""
Admin module initialization
"""

from .routes import router as admin_router
from .schema import get_admin_schema
from .auth_routes import router as auth_router
from .auth_schema import get_auth_schema

__all__ = ["admin_router", "get_admin_schema", "auth_router", "get_auth_schema"]
