# Pre-Production Checklist 🚀

## 🔍 Security Issues

### 1. ⚠️ Cookie Security (CRITICAL)
**File:** `server/admin/auth_routes.py`

**Issue:**
```python
secure=False,  # Set to True in production with HTTPS
```

**Fix Required:**
```python
# Add environment-based configuration
import os
IS_PRODUCTION = os.getenv("ENVIRONMENT", "development") == "production"

response.set_cookie(
    key="auth_token",
    value=access_token,
    httponly=True,
    secure=IS_PRODUCTION,  # ✅ True in production
    samesite="lax",
    max_age=25200,
    path="/"
)
```

---

### 2. ⚠️ JWT Secret Key (CRITICAL)
**File:** `server/admin/auth_utils.py`

**Issue:**
```python
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-this-in-production")
```

**Action Required:**
- ✅ Set strong `JWT_SECRET_KEY` in Render environment
- ❌ Never use default value in production
- ✅ Use at least 32 random characters

**Generate Strong Key:**
```python
import secrets
print(secrets.token_urlsafe(32))
```

---

### 3. ⚠️ Auto-Create Users (SECURITY RISK)
**File:** `server/admin/auth_routes.py` (Line 51-60)

**Issue:**
```python
if not user_result.data:
    # For development: create user on-the-fly
    user_data = {
        "email": request.email,
        "name": request.email.split('@')[0].title(),
        "role": "admin",
        "status": "active"
    }
    user_result = db.table("admin_users").insert(user_data).execute()
```

**Risk:** Anyone can create admin accounts!

**Fix Required:**
```python
if not user_result.data:
    raise HTTPException(status_code=404, detail="User not found")
```

---

### 4. ⚠️ CORS Origins
**File:** `server/server.py`

**Current:**
```python
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
```

**Action Required:**
- ✅ Set production frontend URL in Render
- ❌ Don't include localhost in production
- ✅ Use HTTPS URLs only

**Example:**
```env
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

---

## 🐛 Potential Bugs

### 5. ⚠️ Database URL Format
**File:** `server/.env`

**Issue:**
```
DATABASE_URL=postgresql://postgres.vxlouapxryjosqizskxq:@Reddy14321@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

**Problem:** Extra `@` symbol in password

**Fix:**
```
DATABASE_URL=postgresql://postgres.vxlouapxryjosqizskxq:Reddy14321@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
```

Or URL-encode the password:
```python
import urllib.parse
password = urllib.parse.quote("@Reddy14321", safe="")
```

---

### 6. ⚠️ Missing Error Handling
**File:** `server/server.py`

**Issue:** No global exception handler

**Add:**
```python
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"}
    )
```

---

### 7. ⚠️ No Rate Limiting
**Issue:** APIs are open to abuse

**Add Rate Limiting:**
```bash
pip install slowapi
```

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.post("/api/auth/login")
@limiter.limit("5/minute")  # 5 attempts per minute
async def login(...):
    ...
```

---

## 📝 Configuration Issues

### 8. ⚠️ Missing Health Check
**File:** `server/server.py`

**Add:**
```python
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "database": "connected" if supabase else "disconnected"
    }
```

---

### 9. ⚠️ No Logging Configuration
**Issue:** No structured logging

**Add:**
```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
```

---

### 10. ⚠️ Missing Environment Validation
**Add at startup:**
```python
def validate_environment():
    required_vars = [
        "SUPABASE_URL",
        "SUPABASE_KEY",
        "DATABASE_URL",
        "JWT_SECRET_KEY",
        "ALLOWED_ORIGINS"
    ]
    
    missing = [var for var in required_vars if not os.getenv(var)]
    
    if missing:
        raise RuntimeError(f"Missing environment variables: {', '.join(missing)}")
    
    if os.getenv("JWT_SECRET_KEY") == "your-secret-key-change-this-in-production":
        raise RuntimeError("JWT_SECRET_KEY must be changed in production!")

# Call at startup
validate_environment()
```

---

## 🔒 Database Security

### 11. ⚠️ SQL Injection Risk
**Status:** ✅ Using Supabase client (safe)
**Note:** Supabase client uses parameterized queries

---

### 12. ⚠️ Row Level Security (RLS)
**Action Required in Supabase:**

```sql
-- Enable RLS on all tables
ALTER TABLE site_pages_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
-- ... etc for all tables

-- Create policies
CREATE POLICY "Public read access" ON site_pages_content
    FOR SELECT USING (true);

CREATE POLICY "Authenticated write access" ON site_pages_content
    FOR ALL USING (auth.role() = 'authenticated');
```

---

## 📦 Dependencies

### 13. ⚠️ Outdated Packages
**Check:**
```bash
pip list --outdated
```

**Update:**
```bash
pip install --upgrade fastapi uvicorn supabase
```

---

### 14. ⚠️ Missing Dependencies
**Add to requirements.txt:**
```
slowapi  # Rate limiting
python-multipart  # File uploads
```

---

## 🌐 Frontend Issues

### 15. ⚠️ API URL Configuration
**File:** Frontend `.env.local`

**Required:**
```env
NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
```

---

### 16. ⚠️ Cookie Domain
**Issue:** Cookies won't work cross-domain

**Fix in auth_routes.py:**
```python
response.set_cookie(
    key="auth_token",
    value=access_token,
    httponly=True,
    secure=True,
    samesite="none",  # ✅ For cross-domain
    domain=".yourdomain.com",  # ✅ Set domain
    max_age=25200,
    path="/"
)
```

---

## 🚀 Performance

### 17. ⚠️ No Caching
**Add Redis caching:**
```python
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from redis import asyncio as aioredis

@app.on_event("startup")
async def startup():
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
```

---

### 18. ⚠️ No Database Connection Pooling
**Current:** Using Supabase client (handles pooling)
**Status:** ✅ OK

---

## 📊 Monitoring

### 19. ⚠️ No Error Tracking
**Add Sentry:**
```bash
pip install sentry-sdk
```

```python
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    environment=os.getenv("ENVIRONMENT", "development")
)
```

---

### 20. ⚠️ No Metrics
**Add Prometheus:**
```bash
pip install prometheus-fastapi-instrumentator
```

```python
from prometheus_fastapi_instrumentator import Instrumentator

Instrumentator().instrument(app).expose(app)
```

---

## 🧪 Testing

### 21. ⚠️ No Tests
**Add pytest:**
```bash
pip install pytest pytest-asyncio httpx
```

**Create:** `tests/test_auth.py`
```python
import pytest
from httpx import AsyncClient
from server import app

@pytest.mark.asyncio
async def test_login():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post("/api/auth/login", 
            json={"email": "test@example.com"})
        assert response.status_code == 200
```

---

## 📋 Critical Issues Summary

### 🔴 MUST FIX Before Production:
1. ✅ Set `secure=True` for cookies in production
2. ✅ Set strong `JWT_SECRET_KEY`
3. ✅ Remove auto-create user functionality
4. ✅ Fix DATABASE_URL format
5. ✅ Set production CORS origins
6. ✅ Add environment validation
7. ✅ Enable Supabase RLS

### 🟡 Should Fix:
8. ✅ Add rate limiting
9. ✅ Add global error handler
10. ✅ Add health check endpoint
11. ✅ Configure logging
12. ✅ Add error tracking (Sentry)

### 🟢 Nice to Have:
13. ✅ Add caching
14. ✅ Add metrics
15. ✅ Write tests
16. ✅ Update dependencies

---

## ✅ Quick Fix Script

Run this before deploying:

```bash
# 1. Generate strong JWT secret
python -c "import secrets; print('JWT_SECRET_KEY=' + secrets.token_urlsafe(32))"

# 2. Update dependencies
pip install --upgrade -r requirements.txt

# 3. Run security check
pip install safety
safety check

# 4. Check for outdated packages
pip list --outdated
```

---

## 🎯 Production Readiness Score

**Current:** 60/100

**After Fixes:** 95/100

**Remaining:** Add tests, monitoring, caching for 100/100
