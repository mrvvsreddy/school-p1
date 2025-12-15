# Server Changelog

## Latest Changes (2025-12-15)

### Database Table Management
- **Changed**: Server now only **verifies** table existence instead of creating tables on every startup
- **Benefit**: Prevents unnecessary database operations and potential conflicts
- **Action Required**: 
  - Run `python scripts/setup_db.py` to create the main content table
  - Run `python scripts/setup_admin_tables.py` to create admin tables
  - Tables only need to be created once

### CORS Configuration Enhancement
- **Changed**: ALLOWED_ORIGINS environment variable now supports flexible domain specification
- **New Features**:
  - Specify domains **without** http:// or https:// protocol
  - Server automatically adds both http and https variants
  - Comma-separated list for multiple domains
  
#### CORS Examples:
```bash
# Simple domain (adds both http and https)
ALLOWED_ORIGINS=localhost:3000

# Multiple domains (adds both protocols for each)
ALLOWED_ORIGINS=localhost:3000,example.com,app.example.com

# Mixed format (respects explicit protocols)
ALLOWED_ORIGINS=localhost:3000,http://dev.example.com,https://prod.example.com

# Production example
ALLOWED_ORIGINS=yourdomain.com,www.yourdomain.com
```

#### What happens:
- `localhost:3000` → Allows both `http://localhost:3000` AND `https://localhost:3000`
- `example.com` → Allows both `http://example.com` AND `https://example.com`
- `http://specific.com` → Only allows `http://specific.com` (explicit protocol respected)

### Migration Guide

#### Before:
```bash
# Old format - required explicit protocols
ALLOWED_ORIGINS=http://localhost:3000,https://localhost:3000,https://example.com
```

#### After:
```bash
# New format - simpler and more flexible
ALLOWED_ORIGINS=localhost:3000,example.com
```

### Breaking Changes
None - the server still accepts the old format with explicit protocols.

### Server Startup Behavior

#### Old Behavior:
- Server attempted to create tables on every startup
- Could cause issues with existing tables
- Executed CREATE TABLE statements repeatedly

#### New Behavior:
- Server only **checks** if tables exist
- Provides clear warnings if tables are missing
- Directs users to setup scripts for table creation
- More efficient and safer

### Verification
When the server starts, you'll see:
```
INFO:     Checking connection to Supabase table 'site_pages_content'...
INFO:     Successfully connected to Supabase.
INFO:     Admin tables verified successfully.
INFO:     CORS allowed origins: ['http://localhost:3000', 'https://localhost:3000']
```

Or if tables don't exist:
```
WARNING:  Admin tables not found. Run 'python scripts/setup_admin_tables.py' to create them.
```
