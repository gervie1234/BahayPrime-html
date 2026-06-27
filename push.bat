@echo off
git add .
set /p msg=Commit message: 
git commit -m "%msg%"
git pull origin main --rebase
git push
pause