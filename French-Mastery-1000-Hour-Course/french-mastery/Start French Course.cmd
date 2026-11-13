@echo off
cd /d "%~dp0"
node companion/server.mjs --open
if errorlevel 1 pause
