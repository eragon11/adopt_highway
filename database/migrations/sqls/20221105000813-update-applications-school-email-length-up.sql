
--
-- create a migration to update the column length from 50 to 255 characters.
--
IF EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'SCHOOL_EMAIL')
BEGIN
    ALTER TABLE [APPLICATIONS] ALTER COLUMN SCHOOL_EMAIL VARCHAR(255) NULL;
END
