-- only add MODIFIED_ON column if the APPLICATIONS table exists AND MODIFIED_ON field does not exist
IF EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS')
BEGIN
    -- add MODIFIED_ON only if it does not yet exist
    IF NOT EXISTS(SELECT *
    FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
    WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'MODIFIED_ON')
    BEGIN
        ALTER TABLE [APPLICATIONS] ADD MODIFIED_ON datetime2 NULL;
    END
END