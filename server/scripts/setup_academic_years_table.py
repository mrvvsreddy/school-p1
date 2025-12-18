"""
Setup script for academic_years table in Supabase
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

TABLE_NAME = "academic_years"

# SQL to create the academic_years table
SQL_CREATE_TABLE = """
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create academic_years table
CREATE TABLE IF NOT EXISTS academic_years (
    -- Primary Key
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    
    -- Year info
    year_name TEXT NOT NULL UNIQUE,  -- e.g., "2024-2025"
    start_date DATE,
    end_date DATE,
    
    -- Status
    is_current BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- System fields
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_academic_years_name ON academic_years (year_name);
CREATE INDEX IF NOT EXISTS idx_academic_years_current ON academic_years (is_current);

-- Enable RLS
ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public read access" ON academic_years FOR SELECT USING (true);
CREATE POLICY "Public write access" ON academic_years FOR ALL USING (true);
"""

# Initial seed data
SEED_DATA = [
    {
        "year_name": "2024-2025",
        "start_date": "2024-04-01",
        "end_date": "2025-03-31",
        "is_current": True,
        "is_active": True
    },
    {
        "year_name": "2023-2024",
        "start_date": "2023-04-01",
        "end_date": "2024-03-31",
        "is_current": False,
        "is_active": True
    },
    {
        "year_name": "2022-2023",
        "start_date": "2022-04-01",
        "end_date": "2023-03-31",
        "is_current": False,
        "is_active": True
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
    """Seed initial academic year data"""
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
        for year in SEED_DATA:
            record = {
                "id": str(uuid.uuid4()),
                "year_name": year["year_name"],
                "start_date": year["start_date"],
                "end_date": year["end_date"],
                "is_current": year.get("is_current", False),
                "is_active": year.get("is_active", True),
            }
            seed_records.append(record)
        
        # Insert seed data
        result = supabase.table(TABLE_NAME).insert(seed_records).execute()
        print(f"Successfully seeded {len(result.data)} academic years.")
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
    print(f"=== Academic Years Table Setup ===\n")
    
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
