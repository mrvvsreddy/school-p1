#!/bin/bash
# Render.com build script

echo "Installing Python dependencies..."
pip install -r requirements.txt

echo "Setting up admin tables..."
python scripts/setup_admin_tables.py || echo "Admin tables setup skipped (may already exist)"

echo "Build complete!"
