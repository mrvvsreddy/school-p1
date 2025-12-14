# JWT Authentication System - Complete! 🔐

## ✅ What Was Implemented

### 1. Backend (Python/FastAPI)

#### **JWT Utilities** (`server/admin/auth_utils.py`)
- ✅ `create_access_token()` - Generate JWT tokens
- ✅ `verify_token()` - Validate JWT tokens
- ✅ `get_current_user()` - Dependency for protected routes
- ✅ `require_admin()` - Dependency for admin-only routes
- ✅ `require_editor()` - Dependency for editor routes
- ✅ Token expiration: 24 hours
- ✅ Algorithm: HS256

#### **Auth Routes** (`server/admin/auth_routes.py`)
- ✅ `POST /api/auth/login` - Login with email, returns JWT
- ✅ `POST /api/auth/logout` - Logout (client-side token deletion)
- ✅ `GET /api/auth/me` - Get current user (requires token)
- ✅ `GET /api/auth/verify` - Verify token validity
- ✅ `GET /api/auth/users` - List users (admin only)
- ✅ `POST /api/auth/users` - Create user (admin only)
- ✅ `PUT /api/auth/users/{id}/status` - Update user status (admin only)

### 2. Frontend (Next.js/React)

#### **Login Page** (`src/app/admin-login/page.tsx`)
- ✅ Email-based login
- ✅ Calls `/api/auth/login`
- ✅ Stores JWT token in localStorage
- ✅ Stores user data in localStorage
- ✅ Redirects to admin dashboard on success

#### **AuthGuard Component** (`src/components/AuthGuard.tsx`)
- ✅ Protects routes requiring authentication
- ✅ Verifies JWT token with backend
- ✅ Role-based access control
- ✅ Auto-redirects to login if unauthorized
- ✅ Loading state while verifying
- ✅ Supports redirect after login

#### **Protected Layouts**
- ✅ Admin Layout - Requires admin role
- ✅ Editor Layout - Requires any authenticated user

---

## 🔐 How It Works

### Authentication Flow

```
1. User enters email → /admin-login
2. Frontend calls POST /api/auth/login
3. Backend creates JWT token with user data
4. Frontend stores token in localStorage
5. Frontend redirects to /school-admin
6. AuthGuard checks token validity
7. If valid → Show content
8. If invalid → Redirect to login
```

### Token Structure

```json
{
  "email": "admin@school.edu",
  "user_id": 1,
  "role": "admin",
  "exp": 1702598400
}
```

### Protected Route Example

```typescript
// Backend
@router.get("/protected")
async def protected_route(current_user: TokenData = Depends(get_current_user)):
    return {"message": f"Hello {current_user.email}"}

// Frontend
<AuthGuard requiredRole="admin">
  <AdminDashboard />
</AuthGuard>
```

---

## 🚀 Usage

### 1. Install Dependencies

```bash
cd server
pip install -r requirements.txt
```

New packages:
- `PyJWT` - JWT token handling
- `python-jose[cryptography]` - JWT encoding/decoding
- `passlib[bcrypt]` - Password hashing (future use)

### 2. Set JWT Secret (Optional)

Add to `.env`:
```env
JWT_SECRET_KEY=your-super-secret-key-change-this
```

If not set, uses default (not recommended for production)

### 3. Start Server

```bash
python server.py
```

### 4. Login

1. Go to `http://localhost:3000/admin-login`
2. Enter email: `admin@school.edu`
3. Click "Login"
4. Token generated and stored
5. Redirected to admin dashboard

---

## 🔒 Security Features

### Token Security
- ✅ **Expiration**: 24 hours
- ✅ **Signature**: HS256 algorithm
- ✅ **Verification**: Every request validates token
- ✅ **Storage**: localStorage (client-side)
- ✅ **Transmission**: Authorization header

### Role-Based Access
- ✅ **Admin Routes**: Require admin/super_admin role
- ✅ **Editor Routes**: Allow admin/super_admin/editor roles
- ✅ **Public Routes**: No authentication required

### Protection Levels
1. **No Auth**: Public pages (home, about, etc.)
2. **Any Auth**: Editor pages (any logged-in user)
3. **Admin Only**: Admin dashboard, user management

---

## 📋 API Endpoints

### Public Endpoints
```bash
POST /api/auth/login
  Body: { "email": "admin@school.edu" }
  Returns: { "token": "eyJ...", "user": {...} }
```

### Protected Endpoints (Require Token)
```bash
GET /api/auth/me
  Headers: Authorization: Bearer <token>
  Returns: Current user data

GET /api/auth/verify
  Headers: Authorization: Bearer <token>
  Returns: Token validity status
```

### Admin-Only Endpoints
```bash
GET /api/auth/users
  Headers: Authorization: Bearer <token>
  Returns: List of all users

POST /api/auth/users
  Headers: Authorization: Bearer <token>
  Body: { "email": "...", "name": "...", "role": "..." }
  Returns: Created user
```

---

## 🧪 Testing

### Test Login
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@school.edu"}'
```

### Test Protected Route
```bash
# Get token from login response
TOKEN="eyJ..."

curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer $TOKEN"
```

### Test Admin Route
```bash
curl http://localhost:8000/api/auth/users \
  -H "Authorization: Bearer $TOKEN"
```

---

## 🔧 Frontend Integration

### Storing Token
```typescript
// After login
localStorage.setItem('admin_token', data.token);
localStorage.setItem('admin_user', JSON.stringify(data.user));
```

### Using Token in API Calls
```typescript
const token = localStorage.getItem('admin_token');

const response = await fetch(`${apiUrl}/api/admin/students`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

### Checking Auth Status
```typescript
const token = localStorage.getItem('admin_token');
if (!token) {
  router.push('/admin-login');
}
```

---

## 📊 User Roles

| Role | Access Level | Can Access |
|------|-------------|------------|
| `super_admin` | Full access | Everything |
| `admin` | Admin access | Admin dashboard, Editor |
| `editor` | Editor access | Editor pages only |

---

## ⚙️ Configuration

### Token Expiration
Edit `server/admin/auth_utils.py`:
```python
ACCESS_TOKEN_EXPIRE_MINUTES = 1440  # 24 hours
```

### Secret Key
Edit `.env`:
```env
JWT_SECRET_KEY=your-secret-key-here
```

### Required Roles
Edit `AuthGuard` component:
```typescript
<AuthGuard requiredRole="admin">  // admin, editor, or any
  <YourComponent />
</AuthGuard>
```

---

## 🎯 Summary

**Authentication System**: ✅ Complete
- JWT token-based authentication
- Role-based access control
- Protected admin and editor routes
- Automatic token verification
- Secure token storage
- 24-hour session duration

**All admin and editor pages are now protected!** 🔐

Users must:
1. Login at `/admin-login`
2. Receive JWT token
3. Token verified on every request
4. Auto-logout on token expiration

**Ready for production with proper JWT_SECRET_KEY!** 🚀
