@echo off
REM 🔧 MapBox Visualization 系统检查脚本
REM 检查前后端是否正确运行

setlocal enabledelayedexpansion

echo.
echo ====================================================
echo    MapBox Visualization 系统检查工具
echo ====================================================
echo.

REM 颜色定义
set GREEN=[92m
set RED=[91m
set YELLOW=[93m
set RESET=[0m

echo [*] 检查 Node.js 安装...
node --version >nul 2>&1
if !ERRORLEVEL! equ 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
    echo ✅ Node.js 已安装: !NODE_VERSION!
) else (
    echo ❌ Node.js 未安装！请从 https://nodejs.org 安装
    exit /b 1
)

echo.
echo [*] 检查 npm...
npm --version >nul 2>&1
if !ERRORLEVEL! equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VERSION=%%i
    echo ✅ npm 已安装: !NPM_VERSION!
) else (
    echo ❌ npm 未安装！
    exit /b 1
)

echo.
echo [*] 检查前端端口 (3000)...
netstat -ano 2>nul | findstr ":3000 " >nul
if !ERRORLEVEL! equ 0 (
    echo ✅ 前端服务运行中 (http://localhost:3000)
) else (
    echo ⚠️  前端服务未运行，请执行: npm run dev
)

echo.
echo [*] 检查后端端口 (3001)...
netstat -ano 2>nul | findstr ":3001 " >nul
if !ERRORLEVEL! equ 0 (
    echo ✅ 后端服务运行中 (http://localhost:3001)
    
    REM 尝试访问 API
    echo.
    echo [*] 测试 API 连接...
    powershell -Command "try { $response = Invoke-RestMethod -Uri 'http://127.0.0.1:3001/' -ErrorAction Stop; echo '✅ API 响应正常' } catch { echo '⚠️  API 无响应或返回错误' }"
) else (
    echo ❌ 后端服务未运行，请执行: npm run backend
)

echo.
echo [*] 检查项目文件...
if exist "package.json" (
    echo ✅ package.json 存在
) else (
    echo ❌ package.json 不存在
)

if exist "vite.config.js" (
    echo ✅ vite.config.js 存在
) else (
    echo ❌ vite.config.js 不存在
)

if exist "backend\.env" (
    echo ✅ backend\.env 存在
    
    REM 检查 TDT_KEY
    powershell -Command "Select-String -Path 'backend\.env' -Pattern 'TDT_KEY' | ForEach-Object { if ($_ -match 'TDT_KEY=.*') { echo '  ✅ TDT_KEY 已配置' } }"
) else (
    echo ❌ backend\.env 不存在
)

if exist "src\views\Maps.vue" (
    echo ✅ Maps.vue 存在
) else (
    echo ❌ Maps.vue 不存在
)

echo.
echo ====================================================
echo.
echo 📝 启动方法:
echo.
echo   方式 1 (推荐 - Windows):
echo   --------------------------------
echo   start start-all.bat
echo.
echo   方式 2 (手动 - 两个终端):
echo   --------------------------------
echo   终端 1: npm run backend
echo   终端 2: npm run dev
echo.
echo   方式 3 (全功能):
echo   --------------------------------
echo   终端 1: cd backend ^&^& npm start
echo   终端 2: npm run dev
echo.
echo ====================================================
echo.
echo 🌐 访问地址:
echo   前端: http://localhost:3000
echo   后端: http://localhost:3001
echo.
echo 📖 查看文档:
echo   - README.md           (项目说明)
echo   - STARTUP_GUIDE.md    (启动指南)
echo   - TROUBLESHOOTING.md  (故障排除)
echo.
echo ====================================================
echo.

pause
