# Server Folder Structure

```
server/
├── admin/                      # Admin module (routes, schemas, auth)
│   ├── __init__.py            # Module initialization
│   ├── routes.py              # Admin CRUD APIs (students, teachers, etc.)
│   ├── schema.py              # Admin database schema
│   ├── auth_routes.py         # Authentication APIs (login, OTP)
│   ├── auth_schema.py         # Auth database schema
│   ├── STATUS.md              # Admin features status
│   └── AUTH_STATUS.md         # Auth system documentation
│
├── scripts/                    # Setup and utility scripts
│   ├── setup_db.py            # Setup main content tables
│   ├── setup_admin_tables.py  # Setup admin tables (NEW!)
│   ├── seed_migration.py      # Migrate data to database
│   └── verify_split.py        # Verify database structure
│
├── server.py                   # Main FastAPI application
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables (gitignored)
└── env_example.txt             # Example environment file
```

---

## 📁 Folder Descriptions

### `/admin` - Admin Module
Contains all admin-related functionality:
- **Student, Teacher, Class Management APIs**
- **Exam, Notice, Transport APIs**
- **Authentication & OTP System**
- **Database Schemas**

### `/scripts` - Setup Scripts
Utility scripts for database setup and maintenance:
- Run these ONCE during initial setup
- Can be re-run safely (idempotent)

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
# Copy example and edit
cp env_example.txt .env

# Add your Supabase credentials:
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]/postgres
```

### 3. Setup Database Tables

**Option A: Setup Content Tables**
```bash
python scripts/setup_db.py
```

**Option B: Setup Admin Tables**
```bash
python scripts/setup_admin_tables.py
```

**Option C: Setup Everything**
```bash
python scripts/setup_db.py
python scripts/setup_admin_tables.py
```

### 4. Start Server
```bash
python server.py
```

Server runs at: `http://localhost:8000`

---

## 📋 Available APIs

### Content APIs
- `GET /api/pages/{page_slug}` - Get page content
- `PUT /api/pages/{page_slug}/{section_key}` - Update section
- `POST /api/pages/{page_slug}/batch` - Batch update
- `POST /api/upload` - Upload images

### Admin APIs (`/api/admin/*`)
- `/students` - Student management
- `/teachers` - Teacher management
- `/classes` - Class management
- `/exams` - Exam management
- `/notices` - Notice management
- `/buses` - Transport management
- `/settings` - School settings

### Auth APIs (`/api/auth/*`)
- `POST /login` - Request OTP
- `POST /verify-otp` - Verify OTP & login
- `POST /logout` - Logout
- `GET /users` - List admin users
- `POST /users` - Create admin user

---

## 🗄️ Database Tables

### Content Tables
- `site_pages_content` - Website content (JSONB)

### Admin Tables
- `students` - Student records
- `teachers` - Teacher profiles
- `classes` - Class information
- `exams` - Exam schedules
- `exam_results` - Exam scores
- `notices` - School notices
- `buses` - Transport routes
- `attendance` - Attendance records
- `school_settings` - Configuration

### Auth Tables
- `admin_users` - Admin accounts
- `otp_verifications` - OTP codes

---

## 🔧 Maintenance Scripts

### Setup Scripts (in `/scripts`)

**setup_db.py**
- Creates `site_pages_content` table
- Seeds initial content from JSON
- Run once during initial setup

**setup_admin_tables.py** ⭐ NEW
- Creates all admin tables
- Creates auth tables
- Adds default admin user
- Verifies table creation
- **Run this to setup admin system**

**seed_migration.py**
- Migrates static data to database
- Updates existing content
- Can be run multiple times

**verify_split.py**
- Verifies database structure
- Checks table existence
- Useful for debugging

---

## 🐛 Troubleshooting

### "Admin module not loaded"
```bash
# Install missing dependency
pip install email-validator
```

### "Could not create tables"
```bash
# Check DATABASE_URL in .env
# Format: postgresql://postgres:[PASSWORD]@[HOST]/postgres
# Remove any extra characters like brackets
```

### "Table does not exist"
```bash
# Run setup scripts
python scripts/setup_db.py
python scripts/setup_admin_tables.py
```

### "Connection refused"
```bash
# Check if Supabase project is accessible
# Verify SUPABASE_URL and SUPABASE_KEY
```

---

## 📝 Development Workflow

1. **Make changes** to `server.py` or `/admin` files
2. **Restart server** to apply changes
3. **Test APIs** using curl or Postman
4. **Check logs** in terminal for errors

### Example: Test Admin API
```bash
# Get all students
curl http://localhost:8000/api/admin/students

# Create a student
curl -X POST http://localhost:8000/api/admin/students \
  -H "Content-Type: application/json" \
  -d '{"student_id":"S001","name":"John Doe","class_name":"10th"}'
```

---

## 🔐 Security Notes

- `.env` file is gitignored (contains secrets)
- OTP codes expire in 10 minutes
- Session cookies are httpOnly
- Admin users can be activated/deactivated
- Default admin: `admin@school.edu`

---

## 📚 Documentation

- **Admin Features**: See `admin/STATUS.md`
- **Auth System**: See `admin/AUTH_STATUS.md`
- **API Docs**: Visit `http://localhost:8000/docs` when server is running

---

## ✅ Checklist

Before deploying:
- [ ] All dependencies installed
- [ ] .env file configured
- [ ] Database tables created
- [ ] Default admin user exists
- [ ] Server starts without errors
- [ ] APIs respond correctly
- [ ] Frontend can connect to backend

---

## 🆘 Getting Help

1. Check error messages in terminal
2. Review documentation in `/admin` folder
3. Verify environment variables
4. Check Supabase dashboard for table existence
5. Test APIs with curl to isolate issues
