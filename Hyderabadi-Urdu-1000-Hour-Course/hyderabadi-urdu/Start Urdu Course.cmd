@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Install Node.js 22.12 or later, then open this launcher again.
  pause
  exit /b 1
)
echo Open the localhost link printed below in your browser.
node companion/server.mjs
pause
