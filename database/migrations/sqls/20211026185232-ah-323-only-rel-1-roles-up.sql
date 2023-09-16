/*
[AH-323] Show only the release 1 roles - admin, DC, and MC
*/

-- create a table variable to hold the users
DECLARE @users_tbl TABLE (
    USERNAME          varchar(100)   NOT NULL,
    FULL_NAME         varchar(120)   NULL,
    FIRST_NAME        varchar(30)    NULL,
    LAST_NAME         varchar(30)    NULL
);

INSERT INTO @users_tbl(USERNAME, FULL_NAME, FIRST_NAME, LAST_NAME)
VALUES('KJOHNS-C','Kurt Johnson', 'Kurt', 'Johnson'),
('BSNIDE-C','Brad Snider','Brad','Snider'),
('AFENIX-C','Alister Fenix','Alister','Fenix'),
('RHATHE-C','Rick Hatheway','Rick','Hatheway'),
('VPENUG-C','Venu Penugonda','Venu','Penugonda'),
('VPANGU-C','Venugopal Panguluri','Venu','Panguluri'),
('CCROMER', 'Catherine Cromer', 'Catherine', 'Cromer'),
('CLORENCE', 'Christina Lorence', 'Christina', 'Lorence'),
('BOZUNA', 'Becky Ozuna', 'Becky', 'Ozuna'),
('SGANTA-C', 'Subodh Ganta', 'Subodh', 'Ganta'),
('SCALCO-C', 'Sharon Calcotte', 'Sharon', 'Calcotte'),
('CKNAPPO', 'Carlotta Knappo', 'Carlotta', 'Knappo');

-- declare variables used in cursor
DECLARE @uname VARCHAR(255), @fname VARCHAR(255), @lname VARCHAR(255);

DECLARE cursor_users CURSOR FOR
  SELECT username, FIRST_NAME, LAST_NAME
FROM @users_tbl

-- open cursor
OPEN cursor_users;

-- loop through a cursor
FETCH NEXT FROM cursor_users INTO @uname, @fname, @lname;
WHILE @@FETCH_STATUS = 0
    BEGIN
	-- remove user from all current roles
    DELETE r 
    FROM [ROLE] r
        INNER JOIN [USER_PERSON] u ON r.[USER_ID] = u.[USER_ID]
    WHERE 
        u.[USERNAME] = @uname;

    EXEC AddUserToRole @username=@uname, @firstName = @fname, @lastName = @lname, @roleType='Administrator', @locationName='', @startDate='10/8/2021';
	EXEC AddUserToRole @username=@uname, @firstName = @fname, @lastName = @lname, @roleType='Maintenance Coordinator', @locationName='JEFFERSON MAINTENANCE SECT', @startDate='10/8/2021';
	EXEC AddUserToRole @username=@uname, @firstName = @fname, @lastName = @lname, @roleType='District Coordinator', @locationName='Austin', @startDate='10/8/2021';
    FETCH NEXT FROM cursor_users INTO  @uname, @fname, @lname;
END;

-- close and deallocate cursor
CLOSE cursor_users;
DEALLOCATE cursor_users;
