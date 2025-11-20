@echo off
echo ========================================
echo   PlayTheMood - Generando Reporte HTML
echo ========================================
echo.

REM Verificar que el backend esté corriendo
echo [1/4] Verificando que el backend este activo...
curl -s http://localhost:3000 >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: El backend no esta corriendo en http://localhost:3000
    echo.
    echo Por favor, ejecuta en otra terminal:
    echo   npm start
    echo.
    pause
    exit /b 1
)
echo ✓ Backend activo

echo.
echo [2/4] Ejecutando tests y generando reporte...
echo (Esto puede tardar unos segundos)
echo.
call npm run test:html

if %errorlevel% neq 0 (
    echo.
    echo ERROR: Fallo al generar el reporte
    pause
    exit /b 1
)

echo.
echo [3/4] Verificando que el reporte se genero...
if not exist "tests\reports\report.html" (
    echo ERROR: El archivo report.html no se genero
    pause
    exit /b 1
)
echo ✓ Reporte generado exitosamente

echo.
echo [4/4] Abriendo reporte en el navegador...
start "" "tests\reports\report.html"

echo.
echo ========================================
echo   ✓ Reporte HTML generado y abierto!
echo ========================================
echo.
echo Ubicacion: tests\reports\report.html
echo.
pause

