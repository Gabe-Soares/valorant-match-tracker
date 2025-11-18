@echo off
cd /d "%~dp0"

schtasks /create ^
/tn "ValorantTracker" ^
/tr "\"%~dp0start_hidden.bat\"" ^
/sc minute /mo 10 /f

pause