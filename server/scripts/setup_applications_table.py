"""
Setup script for applications table in Supabase
Run this script to create the applications table
"""
import os
import sys
from supabase import create_client, Client
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
DATABASE_URL = os.getenv("DATABASE_URL")

def setup_applications_table():
    """Create the applications table using psycopg2"""
    import psycopg2
    
    if not DATABASE_URL:
        print("ERROR: DATABASE_URL not set in .env file")
        sys.exit(1)
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Create applications table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS applications (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                student_name VARCHAR(100) NOT NULL,
                parent_name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20) NOT NULL,
                grade_applying VARCHAR(20) NOT NULL,
                date_of_birth DATE,
                address TEXT,
                previous_school VARCHAR(200),
                notes TEXT,
                status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """)
        
        # Create index on status for filtering
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
        """)
        
        # Create index on created_at for sorting
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);
        """)
        
        conn.commit()
        print("SUCCESS: Applications table created successfully!")
        
        # Insert sample data
        cur.execute("""
            INSERT INTO applications (student_name, parent_name, email, phone, grade_applying, status)
            VALUES 
                ('Rahul Sharma', 'Mr. Vikram Sharma', 'vikram.sharma@email.com', '+91 98765 43210', 'Grade 5', 'pending'),
                ('Priya Singh', 'Mrs. Meera Singh', 'meera.singh@email.com', '+91 98765 43211', 'Grade 3', 'pending'),
                ('Arjun Patel', 'Mr. Rajesh Patel', 'rajesh.patel@email.com', '+91 98765 43212', 'Grade 7', 'approved')
            ON CONFLICT DO NOTHING;
        """)
        conn.commit()
        print("SUCCESS: Sample applications added!")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"ERROR: Failed to create applications table: {e}")
        sys.exit(1)

if __name__ == "__main__":
    setup_applications_table()
