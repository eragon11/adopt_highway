--
-- Remove the rejection comments column
--
IF EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'SIGN_REJECTION_COMMENTS')
BEGIN
    ALTER TABLE [APPLICATIONS] DROP COLUMN SIGN_REJECTION_COMMENTS;
END
