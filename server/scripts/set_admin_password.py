"""
Quick password setter for admin user
Run: python scripts/set_admin_password.py admin@school.edu your_password_here
"""
import os
import sys
import bcrypt
from dotenv import load_dotenv

load_dotenv()

if len(sys.argv) < 3:
    print("Usage: python scripts/set_admin_password.py <email> <password>")
    print("Example: python scripts/set_admin_password.py admin@school.edu mypassword123")
    sys.exit(1)

email = sys.argv[1]
password = sys.argv[2]

if len(password) < 8:
    print("ERROR: Password must be at least 8 characters")
    sys.exit(1)

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    print("ERROR: DATABASE_URL not set in .env")
    sys.exit(1)

# Hash password
password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

# Update database
import psycopg2
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

cur.execute("UPDATE admin_users SET password_hash = %s WHERE email = %s", (password_hash, email))
if cur.rowcount == 0:
    print(f"ERROR: No user found with email: {email}")
    sys.exit(1)

conn.commit()
cur.close()
conn.close()

print(f"✓ Password set successfully for {email}")
print(f"\nNow add this to your .env file:")
print(f"JWT_SECRET_KEY=dbd194935d40d5fa7e44c1a843414a5041a4136127b06c55833cf97ecce761d0f4")
