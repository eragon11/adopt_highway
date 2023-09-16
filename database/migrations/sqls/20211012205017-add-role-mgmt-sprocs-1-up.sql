/*
REMOVES USERS FROM MC EAST HARRIS MAINT OFFICE ROLE
ADDS USERS TO MC JEFFERSON MAINT OFFICE ROLE
*/

DECLARE @role VARCHAR(255) = 'Maintenance Coordinator';

DECLARE @users_tbl TABLE (
    USERNAME varchar(100) NOT NULL,
    FIRST_NAME varchar(30) NULL,
    LAST_NAME varchar(30) NULL
);

INSERT INTO @users_tbl
    (USERNAME, FIRST_NAME, LAST_NAME)
VALUES
    ('KJOHNS-C', 'Kurt', 'Johnson'),
    ('RHATHE-C', 'Rick', 'Hatheway'),
    ('BSNIDE-C', 'Brad','Snider'),
    ('VPENUG-C', 'Alister', 'Fenix'),
    ('CCROMER', 'Catherine', 'Cromer'),
    ('CLORENCE', 'Christina', 'Lorence'),
    ('BOZUNA', 'Becky', 'Ozuna'),
    ('SGANTA-C', 'Subodh', 'Ganta'),
    ('SCALCO-C', 'Sharon', 'Calcotte'),
    ('CKNAPPO', 'Carlotta', 'Knappo');

-- declare variables used in cursor
DECLARE @uname VARCHAR(255), @fname VARCHAR(255), @lname VARCHAR(255);

-- declare cursor
DECLARE cursor_users CURSOR FOR
  SELECT username, FIRST_NAME, LAST_NAME
FROM @users_tbl

-- open cursor
OPEN cursor_users;

-- loop through a cursor
FETCH NEXT FROM cursor_users INTO @uname, @fname, @lname;
WHILE @@FETCH_STATUS = 0
    BEGIN

    DELETE r 
    FROM [ROLE] r
        INNER JOIN [USER_PERSON] u ON r.[USER_ID] = u.[USER_ID]
        INNER JOIN [MAINTENANCE_SECTION] m ON r.[ORGANIZATION_ID] = m.[ORGANIZATION_ID]
    WHERE 
        u.[USERNAME] = @uname
        AND r.[Type] = @role
        and UPPER(M.[NAME]) = UPPER('EAST HARRIS MAINT OFFICE');

    EXEC AddUserToRole @username=@uname, @firstName = @fname, @lastName = @lname, @roleType=@role, @locationName='JEFFERSON MAINTENANCE SECT', @startDate='10/8/2021';
    FETCH NEXT FROM cursor_users INTO  @uname, @fname, @lname;
END;

-- close and deallocate cursor
CLOSE cursor_users;
DEALLOCATE cursor_users;
