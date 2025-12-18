"""
Password Migration Script
Adds password_hash column to admin_users table and sets initial admin password.

SECURITY NOTE: Run this script once to set up password authentication.
After running, delete or move this file from production.

Usage:
    python scripts/add_password_column.py
"""

import os
import sys
import getpass
from dotenv import load_dotenv

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from admin.auth_utils import hash_password

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set in .env file")
    sys.exit(1)


def run_migration():
    """Add password_hash column and set initial passwords"""
    import psycopg2
    
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cur = conn.cursor()
        
        print("Connected to database...")
        
        # Check if column exists
        cur.execute("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'admin_users' AND column_name = 'password_hash';
        """)
        
        if cur.fetchone() is None:
            print("Adding password_hash column to admin_users table...")
            cur.execute("""
                ALTER TABLE admin_users 
                ADD COLUMN password_hash VARCHAR(255);
            """)
            conn.commit()
            print("✓ Column added successfully")
        else:
            print("✓ password_hash column already exists")
        
        # Check for users without passwords
        cur.execute("""
            SELECT id, email FROM admin_users 
            WHERE password_hash IS NULL OR password_hash = '';
        """)
        users_without_password = cur.fetchall()
        
        if users_without_password:
            print(f"\nFound {len(users_without_password)} user(s) without passwords:")
            for user_id, email in users_without_password:
                print(f"  - {email}")
            
            print("\n" + "="*50)
            print("SET INITIAL PASSWORDS")
            print("="*50)
            
            for user_id, email in users_without_password:
                print(f"\nSetting password for: {email}")
                
                while True:
                    password = getpass.getpass("Enter new password (min 8 chars): ")
                    if len(password) < 8:
                        print("Password must be at least 8 characters!")
                        continue
                    
                    confirm = getpass.getpass("Confirm password: ")
                    if password != confirm:
                        print("Passwords don't match!")
                        continue
                    
                    break
                
                password_hash = hash_password(password)
                cur.execute(
                    "UPDATE admin_users SET password_hash = %s WHERE id = %s",
                    (password_hash, user_id)
                )
                conn.commit()
                print(f"✓ Password set for {email}")
        else:
            print("\n✓ All users have passwords set")
        
        cur.close()
        conn.close()
        
        print("\n" + "="*50)
        print("MIGRATION COMPLETE")
        print("="*50)
        print("\nNext steps:")
        print("1. Ensure JWT_SECRET_KEY is set in your .env file")
        print("2. Restart the server")
        print("3. Test login with email and password")
        
    except Exception as e:
        print(f"ERROR: Migration failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    print("="*50)
    print("PASSWORD MIGRATION SCRIPT")
    print("="*50)
    print("\nThis script will:")
    print("1. Add password_hash column to admin_users table")
    print("2. Set passwords for any users without them")
    print("")
    
    confirm = input("Continue? (y/n): ")
    if confirm.lower() != 'y':
        print("Aborted.")
        sys.exit(0)
    
    run_migration()
