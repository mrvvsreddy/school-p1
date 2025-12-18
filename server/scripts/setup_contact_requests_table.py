"""
Setup script for contact_requests table in Supabase
Run this script to create the contact_requests table
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

def setup_contact_requests_table():
    """Create the contact_requests table using psycopg2"""
    import psycopg2
    
    if not DATABASE_URL:
        print("ERROR: DATABASE_URL not set in .env file")
        sys.exit(1)
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        # Create contact_requests table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS contact_requests (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                dial_code VARCHAR(10) DEFAULT '+91',
                phone VARCHAR(20) NOT NULL,
                subject VARCHAR(50),
                message TEXT NOT NULL,
                status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
                notes TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """)
        
        # Create index on status for filtering
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
        """)
        
        # Create index on created_at for sorting
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_contact_requests_created_at ON contact_requests(created_at DESC);
        """)
        
        conn.commit()
        print("SUCCESS: contact_requests table created successfully!")
        
        # Insert sample data
        cur.execute("""
            INSERT INTO contact_requests (name, email, dial_code, phone, subject, message, status)
            VALUES 
                ('Rahul Kumar', 'rahul@example.com', '+91', '9876543210', 'admission', 'I would like to know about admission process for my daughter.', 'new'),
                ('Priya Sharma', 'priya@email.com', '+91', '8765432109', 'fees', 'Please share the fee structure for class 5.', 'new')
            ON CONFLICT DO NOTHING;
        """)
        conn.commit()
        print("SUCCESS: Sample contact requests added!")
        
        cur.close()
        conn.close()
        
    except Exception as e:
        print(f"ERROR: Failed to create contact_requests table: {e}")
        sys.exit(1)

if __name__ == "__main__":
    setup_contact_requests_table()
