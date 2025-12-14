#!/bin/bash
# Render.com start script

echo "Starting FastAPI server..."
uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000}
