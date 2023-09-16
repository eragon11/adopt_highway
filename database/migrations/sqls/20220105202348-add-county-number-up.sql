-- add column as needed
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'COUNTY' AND c.name = 'NUMBER')
BEGIN
    ALTER TABLE [COUNTY] ADD [NUMBER] [int] NULL;
END
