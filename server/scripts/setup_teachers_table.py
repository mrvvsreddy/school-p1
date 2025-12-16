"""
Setup script for teachers table in Supabase
Creates the table schema and seeds with initial data
"""
import os
import sys
import uuid
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

TABLE_NAME = "teachers"

# SQL to create the teachers table
SQL_CREATE_TABLE = """
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create teachers table
CREATE TABLE IF NOT EXISTS teachers (
    -- Primary Key
    id UUID PRIMARY KEY,
    
    -- School-essential columns (fixed)
    name TEXT NOT NULL,
    employee_id TEXT UNIQUE NOT NULL,
    department TEXT NOT NULL,
    subject TEXT NOT NULL,
    designation TEXT,
    join_date DATE,
    photo_url TEXT,
    status TEXT DEFAULT 'Active',
    
    -- Flexible personal info (JSONB)
    personal_info JSONB DEFAULT '{}',
    
    -- System fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_teachers_department ON teachers (department);
CREATE INDEX IF NOT EXISTS idx_teachers_employee_id ON teachers (employee_id);
CREATE INDEX IF NOT EXISTS idx_teachers_name ON teachers (name);
CREATE INDEX IF NOT EXISTS idx_teachers_active ON teachers (is_active);
CREATE INDEX IF NOT EXISTS idx_teachers_personal_info ON teachers USING GIN (personal_info);

-- Enable RLS
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON teachers FOR SELECT USING (true);
CREATE POLICY "Public write access" ON teachers FOR ALL USING (true);
"""

# Seed data
SEED_DATA = [
    {
        "name": "Dr. Rajesh Kumar",
        "employee_id": "TCH001",
        "department": "Science",
        "subject": "Physics",
        "designation": "Senior Teacher",
        "join_date": "2015-06-15",
        "status": "Active",
        "personal_info": {
            "dob": "1978-03-22",
            "gender": "Male",
            "phone": "+91 98765 11111",
            "email": "rajesh.kumar@school.com",
            "address": "45, Teachers Colony, Delhi",
            "bank_account": "XXXX1234",
            "salary": "65000"
        }
    },
    {
        "name": "Mrs. Priya Sharma",
        "employee_id": "TCH002",
        "department": "Arts",
        "subject": "English",
        "designation": "HOD",
        "join_date": "2012-04-01",
        "status": "Active",
        "personal_info": {
            "dob": "1980-08-15",
            "gender": "Female",
            "phone": "+91 98765 22222",
            "email": "priya.sharma@school.com",
            "address": "78, Green Park, Mumbai",
            "bank_account": "XXXX5678",
            "salary": "75000"
        }
    },
    {
        "name": "Mr. Amit Verma",
        "employee_id": "TCH003",
        "department": "Science",
        "subject": "Chemistry",
        "designation": "Teacher",
        "join_date": "2018-07-20",
        "status": "Active",
        "personal_info": {
            "dob": "1985-11-10",
            "gender": "Male",
            "phone": "+91 98765 33333",
            "email": "amit.verma@school.com",
            "address": "23, Sector 15, Bangalore",
            "bank_account": "XXXX9012",
            "salary": "55000"
        }
    },
    {
        "name": "Ms. Sneha Patel",
        "employee_id": "TCH004",
        "department": "Commerce",
        "subject": "Accountancy",
        "designation": "Teacher",
        "join_date": "2020-01-10",
        "status": "Active",
        "personal_info": {
            "dob": "1990-05-25",
            "gender": "Female",
            "phone": "+91 98765 44444",
            "email": "sneha.patel@school.com",
            "address": "12, Commerce Road, Chennai",
            "bank_account": "XXXX3456",
            "salary": "50000"
        }
    },
    {
        "name": "Mr. Vikram Singh",
        "employee_id": "TCH005",
        "department": "Sports",
        "subject": "Physical Education",
        "designation": "Sports Coach",
        "join_date": "2019-08-01",
        "status": "Active",
        "personal_info": {
            "dob": "1982-12-05",
            "gender": "Male",
            "phone": "+91 98765 55555",
            "email": "vikram.singh@school.com",
            "address": "56, Sports Complex, Jaipur",
            "bank_account": "XXXX7890",
            "salary": "45000"
        }
    },
    {
        "name": "Dr. Meena Gupta",
        "employee_id": "TCH006",
        "department": "Science",
        "subject": "Biology",
        "designation": "HOD",
        "join_date": "2010-03-15",
        "status": "On Leave",
        "personal_info": {
            "dob": "1975-07-18",
            "gender": "Female",
            "phone": "+91 98765 66666",
            "email": "meena.gupta@school.com",
            "address": "89, Knowledge Park, Lucknow",
            "bank_account": "XXXX2345",
            "salary": "80000"
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
    """Seed initial teacher data"""
    print(f"\nSeeding data into '{TABLE_NAME}'...")
    
    try:
        # Check if data already exists
        existing = supabase.table(TABLE_NAME).select("id", count="exact").execute()
        if existing.count and existing.count > 0:
            print(f"Table already has {existing.count} records. Skipping seed.")
            return True
        
        # Prepare seed data with UUIDs
        seed_records = []
        for teacher in SEED_DATA:
            record = {
                "id": str(uuid.uuid4()),
                "name": teacher["name"],
                "employee_id": teacher["employee_id"],
                "department": teacher["department"],
                "subject": teacher["subject"],
                "designation": teacher.get("designation"),
                "join_date": teacher.get("join_date"),
                "status": teacher.get("status", "Active"),
                "personal_info": teacher.get("personal_info", {}),
                "is_active": True
            }
            seed_records.append(record)
        
        # Insert seed data
        result = supabase.table(TABLE_NAME).insert(seed_records).execute()
        print(f"Successfully seeded {len(result.data)} teachers.")
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
    print(f"=== Teachers Table Setup ===\n")
    
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
