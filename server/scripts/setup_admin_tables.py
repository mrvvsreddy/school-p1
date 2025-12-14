"""
Admin Tables Setup Script
Run this to create all admin-related tables in Supabase
"""

import os
import sys
from pathlib import Path
from dotenv import load_dotenv

# Add parent directory to path so we can import admin modules
server_dir = Path(__file__).parent.parent
sys.path.insert(0, str(server_dir))

# Load environment variables
load_dotenv()

def setup_admin_tables():
    """Create all admin tables in Supabase"""
    
    DATABASE_URL = os.getenv("DATABASE_URL")
    
    if not DATABASE_URL:
        print("ERROR: DATABASE_URL not found in .env file")
        print("\nPlease add your Supabase connection string to .env:")
        print("DATABASE_URL=postgresql://postgres:[PASSWORD]@[HOST]/postgres")
        return False
    
    print("="*70)
    print("ADMIN TABLES SETUP")
    print("="*70)
    print(f"\nConnecting to database...")
    
    try:
        import psycopg2
        
        # Connect to database
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        print("✓ Connected successfully\n")
        
        # Import schemas
        from admin.schema import get_admin_schema
        from admin.auth_schema import get_auth_schema
        
        # Execute admin schema
        print("Creating admin tables (students, teachers, classes, etc.)...")
        admin_sql = get_admin_schema()
        cur.execute(admin_sql)
        print("✓ Admin tables created\n")
        
        # Execute auth schema
        print("Creating auth tables (admin_users, otp_verifications)...")
        auth_sql = get_auth_schema()
        cur.execute(auth_sql)
        print("✓ Auth tables created\n")
        
        # Commit changes
        conn.commit()
        
        # Verify tables
        print("Verifying tables...")
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name IN (
                'students', 'teachers', 'classes', 'exams', 'exam_results',
                'notices', 'buses', 'attendance', 'school_settings',
                'admin_users', 'otp_verifications'
            )
            ORDER BY table_name
        """)
        
        tables = cur.fetchall()
        print(f"\n✓ Found {len(tables)} tables:")
        for table in tables:
            print(f"  - {table[0]}")
        
        # Check default admin user
        print("\nChecking default admin user...")
        cur.execute("SELECT email, name, role FROM admin_users WHERE email = 'admin@school.edu'")
        admin = cur.fetchone()
        
        if admin:
            print(f"✓ Default admin user exists:")
            print(f"  Email: {admin[0]}")
            print(f"  Name: {admin[1]}")
            print(f"  Role: {admin[2]}")
        else:
            print("⚠ Default admin user not found")
        
        # Close connection
        cur.close()
        conn.close()
        
        print("\n" + "="*70)
        print("✅ ADMIN TABLES SETUP COMPLETE!")
        print("="*70)
        print("\nYou can now:")
        print("1. Start the server: python server.py")
        print("2. Login at: http://localhost:3000/admin-login")
        print("3. Use email: admin@school.edu")
        print("\n")
        
        return True
        
    except ImportError as e:
        print(f"\n❌ ERROR: Missing Python package")
        print(f"   {e}")
        print("\nPlease install required packages:")
        print("   pip install psycopg2-binary")
        return False
        
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        print("\nTroubleshooting:")
        print("1. Check your DATABASE_URL in .env file")
        print("2. Ensure your Supabase project is accessible")
        print("3. Verify your database password is correct")
        return False

if __name__ == "__main__":
    print("\n")
    success = setup_admin_tables()
    sys.exit(0 if success else 1)
