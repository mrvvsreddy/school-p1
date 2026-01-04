"""
Authentication Schema for Admin Login
Creates admin_users table and OTP verification table
"""

AUTH_SCHEMA_SQL = """
-- Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    email VARCHAR(255) UNIQUE,
    name VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'admin',
    status VARCHAR(20) DEFAULT 'active',
    image_url TEXT,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OTP Verification Table
CREATE TABLE IF NOT EXISTS otp_verifications (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    purpose VARCHAR(50) DEFAULT 'login',
    expires_at TIMESTAMP NOT NULL,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(email, otp_code, verified)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_status ON admin_users(status);
CREATE INDEX IF NOT EXISTS idx_otp_email ON otp_verifications(email);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otp_verifications(expires_at);
"""

# SQL to add username column to existing table
ADD_USERNAME_COLUMN_SQL = """
-- Add username column if it doesn't exist
ALTER TABLE admin_users ADD COLUMN IF NOT EXISTS username VARCHAR(100) UNIQUE;
CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);
"""

def get_auth_schema():
    """Returns the authentication schema SQL"""
    return AUTH_SCHEMA_SQL

def get_username_migration():
    """Returns SQL to add username column to existing table"""
    return ADD_USERNAME_COLUMN_SQL

