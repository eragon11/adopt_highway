-- test first if applications table exists.
IF EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS')
BEGIN
    -- add AAH_SEGMENT_ID if it does not yet exist
    IF NOT EXISTS(SELECT *
    FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
    WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'AAH_SEGMENT_ID')
    BEGIN
        ALTER TABLE [APPLICATIONS] ADD AAH_SEGMENT_ID INT NULL;
    END

    -- add AAH_ROUTE_NAME if it does not yet exist
    IF NOT EXISTS(SELECT *
    FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
    WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'AAH_ROUTE_NAME')
    BEGIN
        ALTER TABLE [APPLICATIONS] ADD AAH_ROUTE_NAME VARCHAR (50) NULL;
    END

    -- add global ID  if it does not yet exist
    IF NOT EXISTS(SELECT *
    FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
    WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'GLOBAL_ID')
    BEGIN
        ALTER TABLE [APPLICATIONS] ADD GLOBAL_ID UNIQUEIDENTIFIER NULL ;
    END

END