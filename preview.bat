@echo off
title Donations Platform - Next.js Local Server
color 0A
cls
echo ========================================================
echo   Starting Donations Platform Frontend on Localhost...
echo ========================================================
echo.

cd /d "%~dp0frontend"

echo Checking Node.js installation...
where node >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] Node.js is not found in your system PATH!
    echo Please make sure Node.js is installed or added to PATH.
    echo.
    pause
    exit /b
)

echo [OK] Node.js is detected:
node -v
echo.
echo Starting Next.js Dev Server...
echo App will be available at: http://localhost:3000
echo.
echo Opening Google Chrome / Default Browser automatically in 5 seconds...
start "" cmd /c "timeout /t 5 /nobreak >nul & start http://localhost:3000"

npm run dev

echo.
echo Server stopped.
pause
