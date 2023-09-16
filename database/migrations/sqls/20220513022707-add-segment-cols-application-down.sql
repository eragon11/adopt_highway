IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'CURRENT_HASHED_REFRESH_TOKEN')
BEGIN
    ALTER TABLE [APPLICATIONS] DROP COLUMN AAH_SEGMENT_ID, AAH_ROUTE_NAME, GLOBAL_ID
END