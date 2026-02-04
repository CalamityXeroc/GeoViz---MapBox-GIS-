@echo off
chcp 65001 >nul
echo ========================================
echo   MapBox GIS - 后端代理服务器启动
echo ========================================
echo.
npm run backend
echo.
pause
