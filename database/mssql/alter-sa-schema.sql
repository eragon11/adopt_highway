use [$(APP_DB_NAME)];

DECLARE @SAUSER VARCHAR(255);
DECLARE @DBSCHEMA VARCHAR(255);

SET @SAUSER = '$(APP_SA_USER)';
SET @DBSCHEMA = '$(DB_SCHEMA)';

DECLARE @SQL_SCRIPT2 VARCHAR(MAX)
DECLARE @USER_TEMPLATE VARCHAR(MAX)

SET @USER_TEMPLATE = '
PRINT ''Set user {{SAUSER}} default schema to {{DBSCHEMA}}'';
ALTER USER [{{SAUSER}}] WITH DEFAULT_SCHEMA = [{{DBSCHEMA}}]
'
SET @SQL_SCRIPT2 = REPLACE(@USER_TEMPLATE, '{{SAUSER}}', @SAUSER)
SET @SQL_SCRIPT2 = REPLACE(@SQL_SCRIPT2, '{{DBSCHEMA}}', @DBSCHEMA)
EXECUTE (@SQL_SCRIPT2)