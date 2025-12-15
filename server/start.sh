#!/bin/bash
# Render.com start script

echo "Starting FastAPI server..."
export PYTHONUNBUFFERED=1
uvicorn server:app --host 0.0.0.0 --port ${PORT:-8000} --log-level info
