@echo off
chcp 65001 >nul
echo ==========================================
echo   StoryVibe - Start Script (Windows)
echo ==========================================
echo.

:: Check Node.js
node -v >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js not found. Please install Node.js 18+ first.
    echo Download: https://nodejs.org/
    pause
    exit /b 1
)

echo [OK] Node.js found
echo.

:: Check node_modules
if not exist "node_modules" (
    echo [INFO] Installing dependencies for the first time...
    echo This may take 2-5 minutes, please wait...
    call npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed
        pause
        exit /b 1
    )
)

echo [OK] Dependencies ready
echo.

:: Install concurrently if not present
if not exist "node_modules\.bin\concurrently.cmd" (
    echo [INFO] Installing concurrently...
    call npm install concurrently --save-dev
)

echo ==========================================
echo   Starting StoryVibe...
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:3001
echo ==========================================
echo.
echo Press Ctrl+C twice to stop both servers
echo.

:: Start both frontend and backend
npm run dev

pause
