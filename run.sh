#!/bin/bash

echo "Starting N-FLOW AI Intent-Based Network Management Platform..."

# Start the FastAPI backend
echo "Starting backend server on http://localhost:8000..."
cd /home/shubham/proj/Semantic-Intent-Analysis/backend
source /home/shubham/MinorProject/backend/venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

# Wait for backend to start
sleep 2

# Start the Vite React frontend
echo "Starting frontend dev server..."
cd /home/shubham/proj/Semantic-Intent-Analysis/frontend
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 22
npm run dev &
FRONTEND_PID=$!

echo "Both servers are running."
echo "Frontend is accessible at http://localhost:5173"
echo "Press Ctrl+C to stop both servers."

# Wait for user interrupt
trap "echo 'Stopping servers...'; kill $BACKEND_PID; kill $FRONTEND_PID; exit" SIGINT SIGTERM
wait
