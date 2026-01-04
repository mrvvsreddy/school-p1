import os
import sys
import bcrypt
from dotenv import load_dotenv
from supabase import create_client

# Determine paths
script_dir = os.path.dirname(os.path.abspath(__file__)) # server/scripts
server_dir = os.path.dirname(script_dir) # server
project_root = os.path.dirname(server_dir) # p1

# Try loading .env from server dir first
env_path = os.path.join(server_dir, ".env")
load_dotenv(env_path)

# Then try .env.local from project root (overrides if needed or fallback)
env_local_path = os.path.join(project_root, ".env.local")
if os.path.exists(env_local_path):
    load_dotenv(env_local_path)

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_KEY")
database_url = os.getenv("DATABASE_URL")

if not supabase_url or not supabase_key:
    print("Error: SUPABASE_URL and SUPABASE_KEY must be set in .env or .env.local")
    sys.exit(1)

print(f"Connecting to Supabase at {supabase_url[:20]}...")
supabase = create_client(supabase_url, supabase_key)

def hash_password(password: str) -> str:
    password_bytes = password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password_bytes, salt)
    return hashed.decode('utf-8')

def add_username_column():
    """Add username column to admin_users table if it doesn't exist"""
    if not database_url:
        print("Warning: DATABASE_URL not set, skipping column migration")
        return
    
    try:
        import psycopg2
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        # Add username column if it doesn't exist
        cur.execute("""
            ALTER TABLE admin_users 
            ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
        """)
        conn.commit()
        
        # Create index
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
        """)
        conn.commit()
        
        cur.close()
        conn.close()
        print("Username column added/verified successfully")
    except Exception as e:
        print(f"Warning: Could not add username column: {e}")

def create_admin_user():
    # First ensure username column exists
    add_username_column()
    
    username = "admin"
    password = "admin123"
    hashed_password = hash_password(password)
    email = "admin@school.edu"
    
    print(f"Creating/Updating user '{username}' with hashed password...")
    
    if not database_url:
        print("Error: DATABASE_URL not set")
        return
    
    try:
        import psycopg2
        conn = psycopg2.connect(database_url)
        cur = conn.cursor()
        
        # First, try to update existing user by email (if exists)
        cur.execute("""
            UPDATE admin_users SET
                username = %s,
                password_hash = %s,
                name = %s,
                role = %s,
                status = %s,
                updated_at = CURRENT_TIMESTAMP
            WHERE email = %s
            RETURNING id, username, email, name, role, status;
        """, (username, hashed_password, "Administrator", "admin", "active", email))
        
        result = cur.fetchone()
        
        if not result:
            # If no existing record, insert new one
            cur.execute("""
                INSERT INTO admin_users (username, email, password_hash, name, role, status)
                VALUES (%s, %s, %s, %s, %s, %s)
                RETURNING id, username, email, name, role, status;
            """, (username, email, hashed_password, "Administrator", "admin", "active"))
            result = cur.fetchone()
        
        conn.commit()
        
        cur.close()
        conn.close()
        
        print("User created/updated successfully!")
        print(f"Credentials: username='{username}', password='{password}'")
        print(f"User data: id={result[0]}, username={result[1]}, email={result[2]}, name={result[3]}, role={result[4]}, status={result[5]}")
        
    except Exception as e:
        print(f"Error creating user: {e}")

if __name__ == "__main__":
    create_admin_user()

