--
-- Update the data in the new column with existing data.
--

IF EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'AGREEMENT' AND c.name = 'AAH_SEGMENT_GLOBAL_ID')
BEGIN
    UPDATE AGREEMENT SET AAH_SEGMENT_GLOBAL_ID = SEGMENT_ID WHERE LEN(SEGMENT_ID) = 36;
END