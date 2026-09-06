@echo off
chcp 65001 > nul
setlocal

cd /d "%~dp0.."

echo =======================================================
echo   EXPORTANDO BASE DE DATOS - DISCIPLINA WEB
echo =======================================================
echo.

docker exec disciplina-postgres pg_dump -U admin_disciplina -d disciplina_db --clean --if-exists -f /tmp/backup.sql
docker cp disciplina-postgres:/tmp/backup.sql "%~dp0backup_disciplina.sql"

echo.
echo =======================================================
echo   BACKUP ACTUALIZADO EN scripts\backup_disciplina.sql!
echo =======================================================
pause
