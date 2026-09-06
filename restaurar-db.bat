@echo off
chcp 65001 > nul
echo =======================================================
echo   RESTAURANDO BASE DE DATOS - DISCIPLINA WEB
echo =======================================================
echo.

echo 1. Iniciando servicio de PostgreSQL en Docker...
docker compose up -d postgres

echo.
echo 2. Esperando a que el motor este disponible...
timeout /t 5 /nobreak > nul

echo.
echo 3. Restaurando esquema y todos los datos desde backup_disciplina.sql...
docker exec -i disciplina-postgres psql -U admin_disciplina -d disciplina_db < backup_disciplina.sql

echo.
echo =======================================================
echo   BASE DE DATOS CLONADA Y LISTA PARA USAR
echo =======================================================
pause
