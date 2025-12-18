"""
Setup script for exams table in Supabase
Creates the table schema and seeds with initial data
"""
import os
import sys

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from dotenv import load_dotenv
from supabase import create_client, Client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env file")
    sys.exit(1)

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

TABLE_NAME = "exams"

# SQL to create the exams table
SQL_CREATE_TABLE = """
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create exams table
CREATE TABLE IF NOT EXISTS exams (
    -- Primary Key
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Exam essential info
    subject TEXT NOT NULL,
    grade TEXT NOT NULL,
    academic_year TEXT NOT NULL,
    
    -- Schedule
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration TEXT,
    
    -- Location and participation
    location TEXT,
    participants INTEGER DEFAULT 0,
    
    -- Status: Draft, Scheduled, Completed
    status TEXT DEFAULT 'Draft',
    
    -- Display color (hex)
    color TEXT DEFAULT '#3B82F6',
    
    -- System fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_exams_academic_year ON exams (academic_year);
CREATE INDEX IF NOT EXISTS idx_exams_grade ON exams (grade);
CREATE INDEX IF NOT EXISTS idx_exams_status ON exams (status);
CREATE INDEX IF NOT EXISTS idx_exams_date ON exams (exam_date);

-- Enable RLS
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust for your security needs)
CREATE POLICY "Public read access" ON exams FOR SELECT USING (true);
CREATE POLICY "Public write access" ON exams FOR ALL USING (true);
"""

# Initial seed data (updated with realistic dates)
SEED_DATA = [
    {
        "subject": "Mathematics Mid-Term",
        "grade": "Grade 10-A",
        "academic_year": "2024-2025",
        "exam_date": "2025-01-15",  # Future - Scheduled
        "start_time": "09:00:00",
        "end_time": "11:00:00",
        "duration": "2 hrs",
        "location": "Main Hall B",
        "status": "Scheduled",
        "participants": 28,
        "color": "#3B82F6"
    },
    {
        "subject": "Physics Final",
        "grade": "Grade 11-B",
        "academic_year": "2024-2025",
        "exam_date": "2025-01-20",  # Future - Scheduled
        "start_time": "10:30:00",
        "end_time": "12:30:00",
        "duration": "2 hrs",
        "location": "Lab 304",
        "status": "Scheduled",
        "participants": 32,
        "color": "#14B8A6"
    },
    {
        "subject": "English Literature",
        "grade": "Grade 9-C",
        "academic_year": "2024-2025",
        "exam_date": "2025-02-05",  # Future - Draft
        "start_time": "08:30:00",
        "end_time": "10:00:00",
        "duration": "1.5 hrs",
        "location": "Room 101",
        "status": "Draft",
        "participants": 0,
        "color": "#8B5CF6"
    },
    {
        "subject": "History Final",
        "grade": "Grade 10-A",
        "academic_year": "2023-2024",
        "exam_date": "2024-03-15",  # Past - Completed
        "start_time": "13:00:00",
        "end_time": "15:00:00",
        "duration": "2 hrs",
        "location": "Main Hall A",
        "status": "Completed",
        "participants": 30,
        "color": "#EF4444"
    },
    {
        "subject": "Biology Quiz",
        "grade": "Grade 11-A",
        "academic_year": "2024-2025",
        "exam_date": "2024-12-10",  # Past - Completed
        "start_time": "09:00:00",
        "end_time": "10:00:00",
        "duration": "1 hr",
        "location": "Classroom 4B",
        "status": "Completed",
        "participants": 32,
        "color": "#22C55E"
    },
    {
        "subject": "Chemistry Lab Test",
        "grade": "Grade 12-A",
        "academic_year": "2024-2025",
        "exam_date": "2025-01-25",  # Future - Scheduled
        "start_time": "11:00:00",
        "end_time": "13:00:00",
        "duration": "2 hrs",
        "location": "Chemistry Lab",
        "status": "Scheduled",
        "participants": 25,
        "color": "#F97316"
    },
]


def attempt_create_table():
    """Try to create table using direct database connection"""
    if not DATABASE_URL:
        return False, "DATABASE_URL not found"
    
    try:
        import psycopg2
        print("Connecting to database...")
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        print(f"Creating table '{TABLE_NAME}'...")
        cur.execute(SQL_CREATE_TABLE)
        conn.commit()
        cur.close()
        conn.close()
        return True, "Success"
    except ImportError:
        return False, "psycopg2 not installed"
    except Exception as e:
        return False, str(e)


def seed_data():
    """Seed initial exam data"""
    print(f"\nSeeding data into '{TABLE_NAME}'...")
    
    try:
        import uuid
        
        # Check if data already exists
        existing = supabase.table(TABLE_NAME).select("id", count="exact").execute()
        if existing.count and existing.count > 0:
            print(f"Table already has {existing.count} records. Skipping seed.")
            return True
        
        # Prepare seed data with UUIDs
        seed_records = []
        for exam in SEED_DATA:
            record = {
                "id": str(uuid.uuid4()),
                "subject": exam["subject"],
                "grade": exam["grade"],
                "academic_year": exam["academic_year"],
                "exam_date": exam["exam_date"],
                "start_time": exam["start_time"],
                "end_time": exam["end_time"],
                "duration": exam.get("duration"),
                "location": exam.get("location"),
                "status": exam.get("status", "Draft"),
                "participants": exam.get("participants", 0),
                "color": exam.get("color", "#3B82F6"),
            }
            seed_records.append(record)
        
        # Insert seed data
        result = supabase.table(TABLE_NAME).insert(seed_records).execute()
        print(f"Successfully seeded {len(result.data)} exams.")
        return True
    except Exception as e:
        print(f"Failed to seed data: {e}")
        return False


def verify_table():
    """Verify table exists and is accessible"""
    try:
        result = supabase.table(TABLE_NAME).select("id", count="exact").execute()
        print(f"\n✓ Table '{TABLE_NAME}' is accessible with {result.count} records.")
        return True
    except Exception as e:
        print(f"\n✗ Table verification failed: {e}")
        return False


if __name__ == "__main__":
    print(f"=== Exams Table Setup ===\n")
    
    # Try to create table
    created, msg = attempt_create_table()
    
    if created:
        print(f"✓ Table '{TABLE_NAME}' created successfully.")
    else:
        print(f"Could not auto-create table: {msg}")
        print("\nPlease run this SQL in Supabase SQL Editor:\n")
        print(SQL_CREATE_TABLE)
        print("\n" + "=" * 50)
    
    # Verify and seed
    if verify_table():
        seed_data()
    
    print("\n=== Setup Complete ===")
