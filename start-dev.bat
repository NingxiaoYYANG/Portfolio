@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  Portfolio Development Server Launcher
echo ========================================
echo.

REM Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.8+ and try again
    pause
    exit /b 1
)

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH
    echo Please install Node.js and try again
    pause
    exit /b 1
)

echo [1/4] Setting up backend environment...
cd backend
if not exist venv (
    echo Creating Python virtual environment...
    python -m venv venv
)
call venv\Scripts\activate.bat
echo Installing/updating backend dependencies...
pip install -q -r requirements.txt
if errorlevel 1 (
    echo [ERROR] Failed to install backend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo [2/4] Setting up frontend environment...
cd frontend
if not exist node_modules (
    echo Installing frontend dependencies (this may take a while)...
    call npm install
) else (
    echo Frontend dependencies already installed
)
if errorlevel 1 (
    echo [ERROR] Failed to install frontend dependencies
    cd ..
    pause
    exit /b 1
)
cd ..

echo [3/4] Starting Flask backend server...
cd backend
call venv\Scripts\activate.bat
start "Portfolio Backend" cmd /k "title Portfolio Backend && python run.py"
cd ..

REM Wait for backend to start
timeout /t 3 /nobreak > nul

echo [4/4] Starting React frontend server...
cd frontend
start "Portfolio Frontend" cmd /k "title Portfolio Frontend && npm run dev"
cd ..

echo.
echo ========================================
echo  Servers Started Successfully!
echo ========================================
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173
echo.
echo  Both servers are running in separate windows.
echo  Close those windows to stop the servers.
echo.
echo  Press any key to exit this launcher...
pause > nul
