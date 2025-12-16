"""
Setup script for students table in Supabase
Creates the table schema and seeds with initial data
"""
import os
import sys
from datetime import date, datetime

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

TABLE_NAME = "students"

# SQL to create the students table
# Schema Design:
# - Fixed columns: School-essential data (id, name, roll_no, class, admission, photo)
# - personal_info JSONB: Flexible personal data (contact, parents, address, etc.)
SQL_CREATE_TABLE = """
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing table if needed (for schema changes)
-- DROP TABLE IF EXISTS students;

-- Create students table with simplified schema
CREATE TABLE IF NOT EXISTS students (
    -- Primary Key
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- School-essential columns (fixed)
    name TEXT NOT NULL,
    roll_no TEXT UNIQUE NOT NULL,
    class_name TEXT NOT NULL,
    section TEXT,
    
    -- School records
    admission_no TEXT,
    admission_date DATE DEFAULT CURRENT_DATE,
    photo_url TEXT,
    
    -- Flexible personal info (JSONB)
    -- Teachers can store: contact, address, parents, blood_group, custom fields, etc.
    personal_info JSONB DEFAULT '{}',
    
    -- System fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_students_class ON students (class_name);
CREATE INDEX IF NOT EXISTS idx_students_roll_no ON students (roll_no);
CREATE INDEX IF NOT EXISTS idx_students_name ON students (name);
CREATE INDEX IF NOT EXISTS idx_students_active ON students (is_active);
-- GIN index for searching within personal_info JSONB
CREATE INDEX IF NOT EXISTS idx_students_personal_info ON students USING GIN (personal_info);

-- Enable RLS
ALTER TABLE students ENABLE ROW LEVEL SECURITY;

-- Create policies (adjust for your security needs)
CREATE POLICY "Public read access" ON students FOR SELECT USING (true);
CREATE POLICY "Public write access" ON students FOR ALL USING (true);
"""

# Initial seed data with new schema structure
# School data in columns, personal data in personal_info JSONB
SEED_DATA = [
    {
        "name": "Rahul Sharma",
        "roll_no": "001",
        "class_name": "10-A",
        "section": "A",
        "admission_no": "ADM2020001",
        "admission_date": "2020-04-01",
        "personal_info": {
            "dob": "2008-05-12",
            "gender": "Male",
            "phone": "+91 98765 43210",
            "address": "123, Gandhi Nagar, Delhi",
            "father_name": "Rajesh Sharma",
            "mother_name": "Meena Sharma",
            "guardian_phone": "+91 98765 43210",
        }
    },
    {
        "name": "Priya Patel",
        "roll_no": "002",
        "class_name": "10-B",
        "section": "B",
        "admission_no": "ADM2020002",
        "admission_date": "2020-04-01",
        "personal_info": {
            "dob": "2008-08-23",
            "gender": "Female",
            "phone": "+91 87654 32109",
            "address": "456, Patel Nagar, Mumbai",
            "father_name": "Suresh Patel",
            "mother_name": "Geeta Patel",
            "guardian_phone": "+91 87654 32109",
        }
    },
    {
        "name": "Amit Kumar",
        "roll_no": "003",
        "class_name": "9-A",
        "section": "A",
        "admission_no": "ADM2021001",
        "admission_date": "2021-04-01",
        "personal_info": {
            "dob": "2009-02-15",
            "gender": "Male",
            "phone": "+91 76543 21098",
            "address": "789, Kumar Colony, Bangalore",
            "father_name": "Mahesh Kumar",
            "mother_name": "Sunita Kumar",
            "guardian_phone": "+91 76543 21098",
        }
    },
    {
        "name": "Sneha Gupta",
        "roll_no": "004",
        "class_name": "9-B",
        "section": "B",
        "admission_no": "ADM2021002",
        "admission_date": "2021-04-01",
        "personal_info": {
            "dob": "2009-11-30",
            "gender": "Female",
            "phone": "+91 65432 10987",
            "address": "321, Gupta Enclave, Chennai",
            "father_name": "Deepak Gupta",
            "mother_name": "Anju Gupta",
            "guardian_phone": "+91 65432 10987",
        }
    },
    {
        "name": "Vikram Singh",
        "roll_no": "005",
        "class_name": "8-A",
        "section": "A",
        "admission_no": "ADM2022001",
        "admission_date": "2022-04-01",
        "personal_info": {
            "dob": "2010-06-18",
            "gender": "Male",
            "phone": "+91 54321 09876",
            "address": "654, Singh Heights, Jaipur",
            "father_name": "Ranjit Singh",
            "mother_name": "Kiran Singh",
            "guardian_phone": "+91 54321 09876",
        }
    },
    {
        "name": "Anjali Verma",
        "roll_no": "006",
        "class_name": "10-A",
        "section": "A",
        "admission_no": "ADM2020003",
        "admission_date": "2020-04-01",
        "personal_info": {
            "dob": "2008-03-25",
            "gender": "Female",
            "phone": "+91 43210 98765",
            "address": "987, Verma Villa, Lucknow",
            "father_name": "Sanjay Verma",
            "mother_name": "Pooja Verma",
            "guardian_phone": "+91 43210 98765",
        }
    },
    {
        "name": "Rohan Das",
        "roll_no": "007",
        "class_name": "8-B",
        "section": "B",
        "admission_no": "ADM2022002",
        "admission_date": "2022-04-01",
        "personal_info": {
            "dob": "2010-09-10",
            "gender": "Male",
            "phone": "+91 32109 87654",
            "address": "159, Das Residency, Kolkata",
            "father_name": "Alok Das",
            "mother_name": "Rima Das",
            "guardian_phone": "+91 32109 87654",
        }
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
    """Seed initial student data"""
    print(f"\nSeeding data into '{TABLE_NAME}'...")
    
    try:
        import uuid
        import json
        
        # Check if data already exists
        existing = supabase.table(TABLE_NAME).select("id", count="exact").execute()
        if existing.count and existing.count > 0:
            print(f"Table already has {existing.count} records. Skipping seed.")
            return True
        
        # Prepare seed data with UUIDs
        seed_records = []
        for student in SEED_DATA:
            record = {
                "id": str(uuid.uuid4()),
                "name": student["name"],
                "roll_no": student["roll_no"],
                "class_name": student["class_name"],
                "section": student.get("section"),
                "admission_no": student.get("admission_no"),
                "admission_date": student.get("admission_date"),
                "personal_info": student.get("personal_info", {}),
                "is_active": True
            }
            seed_records.append(record)
        
        # Insert seed data
        result = supabase.table(TABLE_NAME).insert(seed_records).execute()
        print(f"Successfully seeded {len(result.data)} students.")
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
    print(f"=== Students Table Setup ===\n")
    
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
