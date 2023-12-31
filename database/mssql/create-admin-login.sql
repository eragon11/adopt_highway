USE [master]
GO

DECLARE @DBNAME VARCHAR(255);
DECLARE @SALOGIN VARCHAR(255);
DECLARE @SAPASSWORD VARCHAR(255);

SET @DBNAME = '$(APP_DB_NAME)';
SET @SALOGIN = '$(APP_SA_LOGIN)';
SET @SAPASSWORD = '$(APP_SA_PASSWORD)';

DECLARE @SQL_SCRIPT2 VARCHAR(MAX)
DECLARE @USER_TEMPLATE VARCHAR(MAX)

SET @USER_TEMPLATE = '
PRINT ''Creating the {{SALOGIN}}''
IF NOT EXISTS(SELECT * FROM sys.syslogins WHERE name = ''{{SALOGIN}}'') 
BEGIN; 
   CREATE LOGIN [{{SALOGIN}}] WITH PASSWORD=N''{{SAPASSWORD}}'', DEFAULT_DATABASE=[{{DBNAME}}], CHECK_EXPIRATION=OFF, CHECK_POLICY=OFF;
END;
'
SET @SQL_SCRIPT2 = REPLACE(@USER_TEMPLATE, '{{SALOGIN}}', @SALOGIN)
SET @SQL_SCRIPT2 = REPLACE(@SQL_SCRIPT2, '{{DBNAME}}', @DBNAME)
SET @SQL_SCRIPT2 = REPLACE(@SQL_SCRIPT2, '{{SAPASSWORD}}', @SAPASSWORD)
EXECUTE (@SQL_SCRIPT2)