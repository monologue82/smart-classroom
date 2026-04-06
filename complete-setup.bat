@echo off
chcp 65001 >nul
echo ===========================================
echo 智能教室管理系统 - 完整 GitHub 发布脚本
echo ===========================================
echo.

REM ===========================================
REM 第一步：检查仓库是否已创建
REM ===========================================
echo [1/5] 检查 GitHub 仓库...
echo.
echo 请先在浏览器中创建仓库：
echo.
echo 1. 访问：https://github.com/new
echo 2. 仓库名称：Smart-Classroom
echo 3. 描述（可选）：A modern and feature-rich classroom management system ^| 一个现代化、功能丰富的班级管理系统
echo 4. 选择：Public（公开）
echo 5. 不要勾选："Initialize this repository with a README"
echo 6. 点击：Create repository
echo.
pause

REM ===========================================
REM 第二步：添加远程仓库
REM ===========================================
echo.
echo [2/5] 添加远程仓库...
git remote remove origin >nul 2>&1
git remote add origin https://github.com/monologue82/Smart-Classroom.git
if %errorlevel% equ 0 (
    echo 远程仓库添加成功！
) else (
    echo 远程仓库添加失败，请检查仓库是否已创建。
    pause
    exit /b 1
)

REM ===========================================
REM 第三步：推送代码
REM ===========================================
echo.
echo [3/5] 推送代码到 GitHub...
git branch -M main
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo 推送失败！请检查：
    echo 1. 仓库是否已正确创建
    echo 2. 您是否有推送权限
    echo.
    pause
    exit /b 1
)

echo.
echo 代码推送成功！
echo.

REM ===========================================
REM 第四步：创建 Release
REM ===========================================
echo [4/5] 创建 Release...
echo.
echo 请在浏览器中完成以下步骤：
echo.
echo 1. 访问：https://github.com/monologue82/Smart-Classroom/releases/new
echo.
echo 2. 填写：
echo    - Tag version: v0.1-Bv-bv1
echo    - Release title: v0.1-Bv-bv1 - Beta Release
echo.
echo 3. 在描述框中，复制 RELEASE.md 文件的全部内容
echo.
echo 4. 点击：Publish release
echo.
pause

REM ===========================================
REM 完成
REM ===========================================
echo.
echo ===========================================
echo 恭喜！所有步骤已完成！
echo ===========================================
echo.
echo 您的项目已成功发布到 GitHub：
echo https://github.com/monologue82/Smart-Classroom
echo.
echo Release 页面：
echo https://github.com/monologue82/Smart-Classroom/releases
echo.
pause
