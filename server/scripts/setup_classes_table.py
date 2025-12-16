"""
Setup Classes Table in Supabase

Creates the classes table with FK to teachers and relationships to students.
"""
import os
import uuid
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

# SQL to create the classes table
CREATE_TABLE_SQL = """
-- Classes table
CREATE TABLE IF NOT EXISTS classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class VARCHAR(20) NOT NULL,
    section VARCHAR(10) NOT NULL,
    class_teacher_id UUID REFERENCES teachers(id) ON DELETE SET NULL,
    capacity INTEGER DEFAULT 40,
    room VARCHAR(20),
    academic_year VARCHAR(20) DEFAULT '2024-25',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(class, section, academic_year)
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_classes_class ON classes(class);
CREATE INDEX IF NOT EXISTS idx_classes_section ON classes(section);
CREATE INDEX IF NOT EXISTS idx_classes_active ON classes(is_active);
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON classes(class_teacher_id);

-- RLS Policies
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access" ON classes FOR SELECT USING (true);
CREATE POLICY "Public write access" ON classes FOR ALL USING (true);
"""

# SQL to add class_id to students table
ADD_STUDENT_FK_SQL = """
-- Add class_id FK to students (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'students' AND column_name = 'class_id'
    ) THEN
        ALTER TABLE students ADD COLUMN class_id UUID REFERENCES classes(id) ON DELETE SET NULL;
        CREATE INDEX idx_students_class_id ON students(class_id);
    END IF;
END $$;
"""

# Seed data for classes
SEED_DATA = [
    {"class": "LKG", "section": "A", "capacity": 30, "room": "G-01"},
    {"class": "LKG", "section": "B", "capacity": 30, "room": "G-02"},
    {"class": "UKG", "section": "A", "capacity": 30, "room": "G-03"},
    {"class": "UKG", "section": "B", "capacity": 30, "room": "G-04"},
    {"class": "1", "section": "A", "capacity": 35, "room": "1-01"},
    {"class": "1", "section": "B", "capacity": 35, "room": "1-02"},
    {"class": "2", "section": "A", "capacity": 35, "room": "1-03"},
    {"class": "3", "section": "A", "capacity": 35, "room": "1-04"},
    {"class": "4", "section": "A", "capacity": 40, "room": "2-01"},
    {"class": "5", "section": "A", "capacity": 40, "room": "2-02"},
    {"class": "6", "section": "A", "capacity": 40, "room": "2-03"},
    {"class": "7", "section": "A", "capacity": 40, "room": "2-04"},
    {"class": "8", "section": "A", "capacity": 40, "room": "3-01"},
    {"class": "9", "section": "A", "capacity": 45, "room": "3-02"},
    {"class": "10", "section": "A", "capacity": 45, "room": "3-03"},
    {"class": "10", "section": "B", "capacity": 45, "room": "3-04"},
]


def create_table():
    """Create the classes table using Supabase"""
    from supabase import create_client
    
    url = os.getenv("SUPABASE_URL")
    key = os.getenv("SUPABASE_KEY")
    
    if not url or not key:
        print("ERROR: SUPABASE_URL and SUPABASE_KEY required")
        return False
    
    print("=== Classes Table Setup ===\n")
    print("Connecting to database...")
    
    supabase = create_client(url, key)
    
    # Try to create table via RPC or direct SQL
    print("Creating table 'classes'...")
    try:
        # Use rpc to execute SQL if available
        supabase.rpc("exec_sql", {"query": CREATE_TABLE_SQL}).execute()
        print("✓ Table 'classes' created successfully.")
    except Exception as e:
        print(f"Could not auto-create table: {e}")
        print("\nPlease run this SQL in Supabase SQL Editor:")
        print("-" * 50)
        print(CREATE_TABLE_SQL)
        print("-" * 50)
    
    # Add FK to students
    print("\nAdding class_id to students table...")
    try:
        supabase.rpc("exec_sql", {"query": ADD_STUDENT_FK_SQL}).execute()
        print("✓ Added class_id FK to students.")
    except Exception as e:
        print(f"Could not add FK: {e}")
        print("\nPlease run this SQL in Supabase SQL Editor:")
        print("-" * 50)
        print(ADD_STUDENT_FK_SQL)
        print("-" * 50)
    
    return supabase


def seed_data(supabase):
    """Seed sample class data"""
    print("\nSeeding data into 'classes'...")
    
    # Check if data exists
    existing = supabase.table("classes").select("id", count="exact").execute()
    if existing.count and existing.count > 0:
        print(f"Table already has {existing.count} records. Skipping seed.")
        return
    
    # Insert seed data
    now = datetime.utcnow().isoformat()
    records = []
    for item in SEED_DATA:
        records.append({
            "id": str(uuid.uuid4()),
            "class": item["class"],
            "section": item["section"],
            "capacity": item["capacity"],
            "room": item["room"],
            "academic_year": "2024-25",
            "is_active": True,
            "created_at": now,
            "updated_at": now,
        })
    
    try:
        supabase.table("classes").insert(records).execute()
        print(f"✓ Seeded {len(records)} classes.")
    except Exception as e:
        print(f"Seed failed: {e}")


def main():
    supabase = create_table()
    if supabase:
        seed_data(supabase)
    print("\n=== Setup Complete ===")


if __name__ == "__main__":
    main()
