@echo off
echo ===========================================
echo 智能教室管理系统 - 推送到 GitHub
echo ===========================================
echo.

REM 配置 Git 用户信息（如果还没有配置）
echo [1/4] 检查 Git 配置...
git config user.name >nul 2>&1
if %errorlevel% neq 0 (
    echo 请配置 Git 用户信息：
    echo git config --global user.name "Your Name"
    echo git config --global user.email "your.email@example.com"
    pause
    exit /b 1
)
echo Git 配置已就绪。
echo.

REM 添加远程仓库
echo [2/4] 添加 GitHub 远程仓库...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/monologue82/Smart-Classroom.git
echo 远程仓库已添加：https://github.com/monologue82/Smart-Classroom.git
echo.

REM 推送到 main 分支
echo [3/4] 推送代码到 GitHub...
git branch -M main
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ===========================================
    echo 代码推送成功！
    echo ===========================================
    echo.
    echo 下一步：创建 Release v0.1-Bv-bv1
    echo.
    echo 1. 访问：https://github.com/monologue82/Smart-Classroom/releases/new
    echo 2. Tag version: v0.1-Bv-bv1
    echo 3. Release title: v0.1-Bv-bv1 - Beta Release
    echo 4. 复制 RELEASE.md 的内容作为描述
    echo 5. 点击 "Publish release"
    echo.
) else (
    echo.
    echo ===========================================
    echo 推送失败！
    echo ===========================================
    echo.
    echo 请先在 GitHub 上手动创建仓库：
    echo 1. 访问：https://github.com/new
    echo 2. 仓库名称：Smart-Classroom
    echo 3. 选择 Public
    echo 4. 不要勾选 "Initialize this repository with a README"
    echo 5. 点击 "Create repository"
    echo.
    echo 创建完成后，再次运行此脚本。
    echo.
)

pause
