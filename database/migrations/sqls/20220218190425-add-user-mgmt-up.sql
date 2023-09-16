/*
Adds the STATUS values (Active, Inactive) as records in VALUE for the USER_PERSON table and the STATUS column
Adds the STATUS column to USER_PERSON
*/

DECLARE @tblName AS VARCHAR(50) = 'USER_PERSON', @colName VARCHAR(50) = 'STATUS';
DECLARE @colid INT, @desc VARCHAR(50) = 'Is user active or inactive';

IF NOT EXISTS(
        SELECT * 
        FROM 
            sys.columns c 
            INNER JOIN sys.objects o 
                ON o.OBJECT_ID = c.OBJECT_ID 
        WHERE 
            o.type = 'U' AND 
            o.name = @tblName
            AND c.name = @colName)
BEGIN
    ALTER TABLE USER_PERSON ADD STATUS VARCHAR(50) NOT NULL DEFAULT('Active');
END

-- add a new table name if it does not exist
INSERT INTO TABLE_NAME(NAME)
SELECT @tblName
WHERE NOT EXISTS(SELECT t2.TABLE_ID FROM TABLE_NAME t2 WHERE t2.NAME  = @tblName)

-- add a new column name if it does not exist
INSERT INTO COLUMN_NAME(NAME)
SELECT @colName
WHERE NOT EXISTS(SELECT t2.COLUMN_ID FROM COLUMN_NAME t2 INNER JOIN TABLE_NAME t3 ON t3.TABLE_ID = t2.TABLE_ID WHERE t2.NAME  = @colName)

-- get the column id
SELECT TOP 1 @colid = t2.COLUMN_ID FROM COLUMN_NAME t2 INNER JOIN TABLE_NAME t3 ON t3.TABLE_ID = t2.TABLE_ID WHERE t2.NAME  = @colName

-- create our values
DECLARE @Values TABLE (
	[VALUE] VARCHAR(50),
	[DESCRIPTION] VARCHAR(50)
);

INSERT INTO @Values([VALUE], [DESCRIPTION])
VALUES('Active', @desc),
('Inactive', @desc);

-- insert new values
INSERT INTO VALUE([ACTIVE], [COLUMN_ID], [DESCRIPTION], [VALID_VALUE])
SELECT 'Y', @colid, [DESCRIPTION], [VALUE] FROM @VALUES t1
WHERE NOT EXISTS(SELECT * FROM VALUE t2 WHERE t2.VALID_VALUE= t1.VALUE AND t2.COLUMN_ID = @colid)

IF ((SELECT COUNT(*) FROM @Values t1
WHERE EXISTS(SELECT * FROM VALUE t2 WHERE t2.VALID_VALUE= t1.VALUE AND t2.COLUMN_ID = @colid)) <> 2)
  throw 51000, 'Verify that all status records were inserted into the VALUE table', 1;

/*
Adds isDeleted column for deleting a user
*/

SET @colName = 'IS_DELETED';

IF NOT EXISTS(
        SELECT * 
        FROM 
            sys.columns c 
            INNER JOIN sys.objects o 
                ON o.OBJECT_ID = c.OBJECT_ID 
        WHERE 
            o.type = 'U' AND 
            o.name = @tblName
            AND c.name = @colName)
BEGIN
    ALTER TABLE USER_PERSON ADD IS_DELETED bit NOT NULL DEFAULT(0);
END;


SET @colName = 'LAST_LOGIN_DTTM';

IF NOT EXISTS(
        SELECT * 
        FROM 
            sys.columns c 
            INNER JOIN sys.objects o 
                ON o.OBJECT_ID = c.OBJECT_ID 
        WHERE 
            o.type = 'U' AND 
            o.name = @tblName
            AND c.name = @colName)
BEGIN
    ALTER TABLE USER_PERSON ADD LAST_LOGIN_DTTM datetime2 NULL;
END
