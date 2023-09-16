/**
Adds the read-only users roles to the AAH dev team
*/

-- create a table variable to hold the users
DECLARE @users_tbl TABLE (
    USERNAME        varchar(100)    NOT NULL
);


INSERT INTO @users_tbl(USERNAME)
VALUES('KJOHNS-C'),
('BSNIDE-C'),
('AFENIX-C');

-- declare variables used in cursor
DECLARE @uname VARCHAR(255), @now DATETIME2 = GETDATE();

DECLARE cursor_users CURSOR FOR
  SELECT username
FROM @users_tbl

-- open cursor
OPEN cursor_users;

-- loop through a cursor
FETCH NEXT FROM cursor_users INTO @uname;
WHILE @@FETCH_STATUS = 0
BEGIN;
    EXEC AddRoleToUser @username=@uname, @roleType='Read Only User', @locationName='', @startDate=@now;	
    FETCH NEXT FROM cursor_users INTO  @uname;
END;

-- close and deallocate cursor
CLOSE cursor_users;
DEALLOCATE cursor_users;
