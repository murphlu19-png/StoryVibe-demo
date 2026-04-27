@echo off
chcp 65001 >nul
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║   StoryVibe — AI Narrative Workbench                         ║
echo ║   Launch Script for Windows                                  ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed.
    echo.
    echo Please install Node.js first:
    echo   1. Visit: https://nodejs.org
    echo   2. Download "LTS" version (recommended: v20.x)
    echo   3. Run the installer (next-next-next)
    echo   4. Re-open this script
    echo.
    pause
    exit /b 1
)

for /f "tokens=*" %%a in ('node -v') do set NODE_VERSION=%%a
echo [OK] Node.js found: %NODE_VERSION%

:: Check if npm is available
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm not found. Please reinstall Node.js.
    pause
    exit /b 1
)
echo [OK] npm found

:: Install dependencies if node_modules doesn't exist
if not exist "node_modules" (
    echo.
    echo [INFO] First run detected. Installing dependencies...
    echo          This may take 2-5 minutes. Please wait...
    echo.
    call npm install --legacy-peer-deps
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    echo [OK] Dependencies installed.
) else (
    echo [OK] Dependencies already installed.
)

:: Build frontend if dist doesn't exist
if not exist "dist" (
    echo.
    echo [INFO] Building frontend...
    call npm run build
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Build failed.
        pause
        exit /b 1
    )
    echo [OK] Frontend built.
) else (
    echo [OK] Frontend already built.
)

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║  Starting StoryVibe...                                       ║
echo ║                                                              ║
echo ║  Frontend: http://localhost:3000                             ║
echo ║  Backend:  http://localhost:3001                             ║
echo ║                                                              ║
echo ║  Press Ctrl+C to stop                                        ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

:: Start backend and frontend in parallel
start "StoryVibe Backend" cmd /c "node server/index.js"

:: Wait a moment for backend to start
timeout /t 2 /nobreak >nul

:: Start frontend (using npx serve)
npx serve dist -l 3000 --single

:: When frontend stops, kill backend too
taskkill /F /IM node.exe >nul 2>nul
