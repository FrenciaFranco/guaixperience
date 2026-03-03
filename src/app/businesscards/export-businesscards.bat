@echo off
setlocal

set "SCRIPT_DIR=%~dp0"
set "ROOT_DIR=%SCRIPT_DIR%..\..\..\"

pushd "%ROOT_DIR%" >nul

if not "%~1"=="" (
  set "BUSINESSCARDS_URL=%~1"
)

echo Exporting transparent business cards...
if defined BUSINESSCARDS_URL (
  echo Using BUSINESSCARDS_URL=%BUSINESSCARDS_URL%
)

call npm run export:businesscards
set "EXIT_CODE=%ERRORLEVEL%"

if not "%EXIT_CODE%"=="0" (
  echo.
  echo Export failed. Make sure Next dev server is running.
  echo Example: npm run dev
)

echo.
echo Done. Press any key to close.
pause >nul

popd >nul
exit /b %EXIT_CODE%
