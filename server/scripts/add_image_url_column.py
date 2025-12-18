"""
Migration script to add image_url column to admin_users table
Run this once to update existing database
"""
import os
import sys
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    print("ERROR: DATABASE_URL not found in .env file")
    sys.exit(1)

try:
    import psycopg2
    
    print("Adding image_url column to admin_users table...")
    
    conn = psycopg2.connect(DATABASE_URL)
    cur = conn.cursor()
    
    # Add column if it doesn't exist
    cur.execute("""
        ALTER TABLE admin_users 
        ADD COLUMN IF NOT EXISTS image_url TEXT;
    """)
    
    conn.commit()
    cur.close()
    conn.close()
    
    print("✓ image_url column added successfully!")
    
except Exception as e:
    print(f"Error: {e}")
    sys.exit(1)
