--
-- add a new AAH_SEGMENT_GLOBAL_ID column to house GlobalId compatible data with a varchar
--
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'AGREEMENT' AND c.name = 'AAH_SEGMENT_GLOBAL_ID')
BEGIN
    ALTER TABLE [AGREEMENT] ADD [AAH_SEGMENT_GLOBAL_ID] UNIQUEIDENTIFIER NULL;
END
