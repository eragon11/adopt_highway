/*
Adds DELETED_AT column for deleting a user
Updates DELETED_AT value to now where IS_DELETED is true
Removes all constraints on USER_PERSON.IS_DELETED before dropping the column.
*/

-- used by Typeorm
DECLARE @tblName NVARCHAR(max) = 'USER_PERSON', @colName NVARCHAR(max) = 'DELETED_AT';

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
	PRINT 'Adding DELETED_AT column to USER_PERSON';
    ALTER TABLE USER_PERSON ADD DELETED_AT datetimeoffset NULL;
    -- now update users to be deleted who are already marked deleted.
END;
ELSE
BEGIN;
	throw 51000, 'Did not create USER_PERSON.DELETED_AT successfully', 1;
END;

SET @colName = 'IS_DELETED';

IF EXISTS(
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
	-- now update users to be deleted who are already marked deleted.
	exec sp_executesql N'UPDATE USER_PERSON 	SET DELETED_AT = GETDATE()	WHERE IS_DELETED = 1;';

	-- First, drop all indexes on our table
	DECLARE @sql NVARCHAR(MAX);
	SET @sql = N'';

	DECLARE cur_sql CURSOR FOR
	SELECT N'
	ALTER TABLE ' + QUOTENAME(s.name) + N'.'
	+ QUOTENAME(t.name) + N' DROP CONSTRAINT '
	+ QUOTENAME(obj_Constraint.name) + ';' as [SQL]
    FROM  sys.schemas s JOIN sys.objects t ON s.schema_id = t.schema_id
        JOIN sys.objects obj_Constraint 
            ON t.object_id = obj_Constraint.parent_object_id 
        JOIN sys.sysconstraints constraints 
             ON constraints.constid = obj_Constraint.object_id 
        JOIN sys.columns c 
             ON c.object_id = t.object_id 
            AND c.column_id = constraints.colid 
    WHERE t.NAME=@tblName AND c.NAME = @colName;
	OPEN cur_sql 
	FETCH NEXT FROM cur_sql INTO @sql;
	WHILE @@FETCH_STATUS = 0 BEGIN;
	EXEC sys.sp_executesql @sql;
	FETCH NEXT FROM cur_sql INTO @sql;
	END;
	CLOSE cur_sql;
	DEALLOCATE cur_sql;	

    ALTER TABLE USER_PERSON DROP COLUMN IS_DELETED;
END;
