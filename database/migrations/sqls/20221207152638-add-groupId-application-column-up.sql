-- GROUP_ID INT

--
-- Add a new agreement groupId column
--
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'GROUP_ID')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD GROUP_ID INT NULL;
END
