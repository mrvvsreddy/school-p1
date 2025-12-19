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

def create_admin_user():
    email = "admin@school.edu"
    password = "admin123"
    hashed_password = hash_password(password)
    
    user_data = {
        "email": email,
        "password_hash": hashed_password,
        "name": "Test Admin",
        "role": "admin",
        "status": "active"
    }
    
    print(f"Creating/Updating user {email} with hashed password...")
    
    try:
        # Check if user exists first to get ID if needed, or just upsert
        # Upsert requires primary key or unique constraint. Email should be unique.
        response = supabase.table("admin_users").upsert(user_data, on_conflict="email").execute()
        print("User created/updated successfully!")
        print(response.data)
    except Exception as e:
        print(f"Error creating user: {e}")

if __name__ == "__main__":
    create_admin_user()
