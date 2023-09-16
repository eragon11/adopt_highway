/*
Assign a sample comment to every agreement
*/
UPDATE AGREEMENT 
SET COMMENT = NULL
WHERE COMMENT = 'This is a sample comment'