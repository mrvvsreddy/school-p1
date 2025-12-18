import os
import json
import logging
import sys
import time
from datetime import datetime
from fastapi import FastAPI, HTTPException, Request, Depends, Response
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.base import BaseHTTPMiddleware
from supabase import create_client, Client
from dotenv import load_dotenv
from typing import Dict, Any, List

# Import security middleware
from security import SecurityHeadersMiddleware

# Configure logging - ensure output is flushed immediately
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S',
    handlers=[
        logging.StreamHandler(sys.stdout)
    ]
)
# Force stdout to be unbuffered
sys.stdout.reconfigure(line_buffering=True) if hasattr(sys.stdout, 'reconfigure') else None

logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Also configure uvicorn access log
logging.getLogger("uvicorn.access").setLevel(logging.INFO)

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Warning: SUPABASE_URL and SUPABASE_KEY must be set in .env file")

from contextlib import asynccontextmanager

# Initialize Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY) if SUPABASE_URL and SUPABASE_KEY else None

# Import admin module
try:
    from admin import admin_router, get_admin_schema, auth_router, get_auth_schema
    ADMIN_MODULE_LOADED = True
except ImportError as e:
    print(f"Warning: Admin module not loaded: {e}")
    ADMIN_MODULE_LOADED = False

# Import editor module
try:
    from editor import editor_router
    EDITOR_MODULE_LOADED = True
except ImportError as e:
    print(f"Warning: Editor module not loaded: {e}")
    EDITOR_MODULE_LOADED = False

# Import students module
try:
    from students import students_router
    STUDENTS_MODULE_LOADED = True
except ImportError as e:
    print(f"Warning: Students module not loaded: {e}")
    STUDENTS_MODULE_LOADED = False

# Import teachers module
try:
    from teachers import teachers_router
    TEACHERS_MODULE_LOADED = True
except ImportError as e:
    print(f"Warning: Teachers module not loaded: {e}")
    TEACHERS_MODULE_LOADED = False

# Import classes module
try:
    from classes import classes_router
    CLASSES_MODULE_LOADED = True
except ImportError as e:
    print(f"Warning: Classes module not loaded: {e}")
    CLASSES_MODULE_LOADED = False

# Import exams module
try:
    from exams import exams_router
    EXAMS_MODULE_LOADED = True
except ImportError as e:
    print(f"Warning: Exams module not loaded: {e}")
    EXAMS_MODULE_LOADED = False

# Import storage module
try:
    from storage import storage_router
    STORAGE_MODULE_LOADED = True
except ImportError as e:
    print(f"Warning: Storage module not loaded: {e}")
    STORAGE_MODULE_LOADED = False

# Import applications module
try:
    from applications import applications_router
    APPLICATIONS_MODULE_LOADED = True
except ImportError as e:
    print(f"Warning: Applications module not loaded: {e}")
    APPLICATIONS_MODULE_LOADED = False

# Import contacts module
try:
    from contacts import contacts_router
    CONTACTS_MODULE_LOADED = True
except ImportError as e:
    print(f"Warning: Contacts module not loaded: {e}")
    CONTACTS_MODULE_LOADED = False


# NEW TABLE NAME
TABLE_NAME = "site_pages_content"

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    print(f"INFO:     Checking connection to Supabase table '{TABLE_NAME}'...")
    if not supabase:
        print("ERROR:    Supabase client not initialized. Check .env file.")
        yield
        return

    try:
        # Try to verify table existence
        # We limit 1 to minimize data transfer
        response = supabase.table(TABLE_NAME).select("id").limit(1).execute()
        print("INFO:     Successfully connected to Supabase.")
        
        # Check if admin tables exist (only verify, don't create)
        if ADMIN_MODULE_LOADED:
            DATABASE_URL = os.getenv("DATABASE_URL")
            if DATABASE_URL:
                try:
                    import psycopg2
                    conn = psycopg2.connect(DATABASE_URL)
                    cur = conn.cursor()
                    
                    # Check if admin tables exist
                    cur.execute("""
                        SELECT EXISTS (
                            SELECT FROM information_schema.tables 
                            WHERE table_name = 'students'
                        );
                    """)
                    tables_exist = cur.fetchone()[0]
                    
                    if tables_exist:
                        print("INFO:     Admin tables verified successfully.")
                    else:
                        print("WARNING:  Admin tables not found. Run 'python scripts/setup_admin_tables.py' to create them.")
                    
                    cur.close()
                    conn.close()
                except Exception as admin_err:
                    print(f"WARNING:  Could not verify admin tables: {admin_err}")
            else:
                print("WARNING:  DATABASE_URL not set, skipping admin table verification")
        
        # Check if table is empty and seed if needed
        # Note: Seeding is now optional and should be done via API or separate script
        if len(response.data) == 0:
            print(f"INFO:     Table '{TABLE_NAME}' is empty.")
            print(f"INFO:     To seed data, use the /api/pages/{{page_slug}}/batch endpoint")
            print(f"INFO:     or run the seed_migration.py script manually.")
                
    except Exception as e:
        error_str = str(e)
        if "PGRST205" in error_str or "Could not find the table" in error_str or "does not exist" in error_str:
             print(f"\n{'='*60}")
             print(f"ERROR:    Table '{TABLE_NAME}' does not exist in your Supabase project.")
             print(f"ACTION:   Please run 'python scripts/setup_db.py' to create the table.")
             print(f"{'='*60}\n")
        else:
            print(f"ERROR:    Failed to connect to Supabase: {e}")

            
    yield
    # Shutdown logic

app = FastAPI(lifespan=lifespan)

# Include admin router if loaded
if ADMIN_MODULE_LOADED:
    app.include_router(admin_router)
    app.include_router(auth_router)
    print("INFO:     Admin and auth routes registered")

# Include editor router if loaded
if EDITOR_MODULE_LOADED:
    app.include_router(editor_router)
    print("INFO:     Editor routes registered")

# Include students router if loaded
if STUDENTS_MODULE_LOADED:
    app.include_router(students_router)
    print("INFO:     Students routes registered")

# Include teachers router if loaded
if TEACHERS_MODULE_LOADED:
    app.include_router(teachers_router)
    print("INFO:     Teachers routes registered")

# Include classes router if loaded
if CLASSES_MODULE_LOADED:
    app.include_router(classes_router)
    print("INFO:     Classes routes registered")

# Include exams router if loaded
if EXAMS_MODULE_LOADED:
    app.include_router(exams_router)
    print("INFO:     Exams routes registered")

# Include storage router if loaded
if STORAGE_MODULE_LOADED:
    app.include_router(storage_router)
    print("INFO:     Storage routes registered")

# Include applications router if loaded
if APPLICATIONS_MODULE_LOADED:
    app.include_router(applications_router)
    print("INFO:     Applications routes registered")

# Include contacts router if loaded
if CONTACTS_MODULE_LOADED:
    app.include_router(contacts_router)
    print("INFO:     Contacts routes registered")


# Configure CORS - only allow origins from environment variable
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "localhost:3000")

# Parse domains and add both http and https variants
allowed_origins_list = []
for origin in ALLOWED_ORIGINS.split(","):
    origin = origin.strip()
    if not origin:
        continue
    
    # If origin already has http:// or https://, use it as-is
    if origin.startswith("http://") or origin.startswith("https://"):
        allowed_origins_list.append(origin)
    else:
        # Add both http and https variants for domains without protocol
        allowed_origins_list.append(f"http://{origin}")
        allowed_origins_list.append(f"https://{origin}")

print(f"INFO:     CORS allowed origins: {allowed_origins_list}")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins_list,
    allow_credentials=True,
    # Explicit methods instead of wildcard
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS", "HEAD"],
    # Explicit headers instead of wildcard
    allow_headers=[
        "Authorization",
        "Content-Type",
        "Accept",
        "Origin",
        "X-Requested-With",
        "Cookie",
    ],
)

# Add security headers middleware (X-Frame-Options, CSP, etc.)
app.add_middleware(SecurityHeadersMiddleware)

# Request logging middleware
class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        # Get request details
        method = request.method
        path = request.url.path
        query = str(request.query_params) if request.query_params else ""
        client_ip = request.client.host if request.client else "unknown"
        
        # Check for auth token (redacted for security)
        has_auth_cookie = "auth_token" in request.cookies
        auth_header = request.headers.get("authorization", "")
        has_auth_header = bool(auth_header)
        
        # Log incoming request
        auth_info = []
        if has_auth_cookie:
            auth_info.append("cookie")
        if has_auth_header:
            auth_info.append("header")
        auth_str = f" [Auth: {', '.join(auth_info)}]" if auth_info else " [No Auth]"
        
        logger.info(f"→ {method} {path}{' ?' + query if query else ''} from {client_ip}{auth_str}")
        
        try:
            response = await call_next(request)
            
            # Calculate duration
            duration = time.time() - start_time
            duration_ms = round(duration * 1000, 2)
            
            # Color-code status
            status = response.status_code
            status_str = f"{status}"
            if status >= 400:
                logger.warning(f"← {method} {path} → {status_str} ({duration_ms}ms)")
            else:
                logger.info(f"← {method} {path} → {status_str} ({duration_ms}ms)")
            
            return response
            
        except Exception as e:
            duration = time.time() - start_time
            duration_ms = round(duration * 1000, 2)
            logger.error(f"✗ {method} {path} → ERROR: {str(e)} ({duration_ms}ms)")
            raise

app.add_middleware(RequestLoggingMiddleware)

# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Handle all unhandled exceptions"""
    import traceback
    logger.error(f"Unhandled exception on {request.method} {request.url.path}: {exc}")
    logger.error(traceback.format_exc())
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )

# Root endpoint
@app.get("/")
def root():
    """Root endpoint"""
    return {"status": "ok"}

@app.head("/")
def head_root():
    """Root HEAD endpoint"""
    return Response(status_code=200)

# Health check endpoint
@app.get("/health")
def health():
    """Health check endpoint"""
    return "ok"

# --- NEW ENDPOINTS ---

@app.get("/api/pages/{page_slug}")
async def get_page_content(page_slug: str):
    """
    Get all sections for a specific page (e.g., 'home'),
    returned as a dictionary { section_key: content }.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        # Fetch active sections for the page, ordered
        response = supabase.table(TABLE_NAME)\
            .select("section_key, content")\
            .eq("page_slug", page_slug)\
            .eq("is_active", True)\
            .order("order_index")\
            .execute()
            
        # Reconstruct into simple dict for frontend
        data = {}
        for row in response.data:
            data[row['section_key']] = row['content']
            
        return data  # Returns { "hero": {...}, "facilities": [...] }
    except Exception as e:
        print(f"Error fetching page {page_slug}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/content/full")
async def get_full_content_legacy():
    """
    Legacy support: Get EVERYTHING as one giant JSON.
    Reconstructs the original site-content.json structure.
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        response = supabase.table(TABLE_NAME).select("section_key, content").execute()
        data = {}
        for row in response.data:
            data[row['section_key']] = row['content']
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.put("/api/pages/{page_slug}/{section_key}")
async def update_section_content(page_slug: str, section_key: str, request: Request):
    """
    Update a specific section content (PUT - replaces entire content).
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        body = await request.json()
        
        # Upsert based on unique constraint (page_slug, section_key)
        data_packet = {
            "page_slug": page_slug,
            "section_key": section_key,
            "content": body,
        }
        
        response = supabase.table(TABLE_NAME).upsert(data_packet, on_conflict="page_slug, section_key").execute()
        
        return {"success": True, "data": response.data}
    except Exception as e:
        print(f"Error updating {page_slug}/{section_key}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/pages/{page_slug}/batch")
async def batch_update_sections(page_slug: str, request: Request):
    """
    Batch update multiple sections for a page.
    Expects: { "sections": { "section_key": content_object, ... } }
    """
    if not supabase:
        raise HTTPException(status_code=500, detail="Supabase not configured")
    
    try:
        body = await request.json()
        sections = body.get("sections", {})
        
        if not sections:
            raise HTTPException(status_code=400, detail="No sections provided")
        
        # Prepare batch upsert
        records = []
        for section_key, content in sections.items():
            records.append({
                "page_slug": page_slug,
                "section_key": section_key,
                "content": content
            })
        
        # Batch upsert
        response = supabase.table(TABLE_NAME).upsert(records, on_conflict="page_slug, section_key").execute()
        
        return {"success": True, "updated": len(records), "data": response.data}
    except Exception as e:
        print(f"Error batch updating {page_slug}: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

