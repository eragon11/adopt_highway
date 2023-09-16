--
-- Add a new rejection comments columns
--
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'SIGN_REJECTION_COMMENTS')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD SIGN_REJECTION_COMMENTS VARCHAR(500) NULL;
END
