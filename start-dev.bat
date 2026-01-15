@echo off
echo Starting Portfolio Development Servers...
echo.

REM Start backend
echo Starting Flask backend...
cd backend
if not exist venv python -m venv venv
call venv\Scripts\activate.bat
pip install -r requirements.txt > nul 2>&1
start "Flask Backend" cmd /k "python run.py"
cd ..

timeout /t 2 /nobreak > nul

REM Start frontend
echo Starting React frontend...
cd frontend
call npm install > nul 2>&1
start "React Frontend" cmd /k "npm run dev"
cd ..

echo.
echo Backend running on http://localhost:5000
echo Frontend running on http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
