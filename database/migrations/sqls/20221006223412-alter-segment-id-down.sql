IF EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'AGREEMENT' AND c.name = 'AAH_SEGMENT_GLOBAL_ID')
BEGIN
    ALTER TABLE [AGREEMENT] DROP COLUMN [AAH_SEGMENT_GLOBAL_ID];
END

