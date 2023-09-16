-- remove all roles and reset the identity
DELETE FROM ROLE
DBCC CHECKIDENT('[ROLE]', RESEED, 0);

-- re add our user roles
-- create a table variable to hold the users
DECLARE @users_tbl TABLE (
    USERNAME        varchar(100)    NOT NULL,
    FULL_NAME       varchar(120)    NULL,
    FIRST_NAME      varchar(30)     NULL,
    LAST_NAME       varchar(30)     NULL,
	IsAdmin         bit             NULL        DEFAULT(0),
    IsDc            bit             NULL        DEFAULT(0),
    DcLocation      varchar(100)    NULL, 
    IsMc            bit             NULL        DEFAULT(0),
    McLocation      varchar(100)    NULL
);

DECLARE @Jefferson VARCHAR(100), @Tyler VARCHAR(100);
SELECT TOP 1 @Jefferson = NAME FROM MAINTENANCE_SECTION WHERE NAME LIKE '%Jefferson%';
SELECT TOP 1 @Tyler = NAME FROM MAINTENANCE_SECTION WHERE NAME = 'Tyler';

INSERT INTO @users_tbl(USERNAME, FULL_NAME, FIRST_NAME, LAST_NAME, IsAdmin, IsDc, DcLocation, IsMC, McLocation)
VALUES('KJOHNS-C','Kurt Johnson', 'Kurt', 'Johnson', 1, 1, 'Austin', 1, @Jefferson),
('BSNIDE-C','Brad Snider','Brad','Snider', 1, 1, 'Austin', 1, @Jefferson),
('AFENIX-C','Alister Fenix','Alister','Fenix', 1, 1, 'Austin', 1, @Jefferson),
('RHATHE-C','Rick Hatheway','Rick','Hatheway', 1, 1, 'Austin', 1, @Jefferson),
('VPENUG-C','Varun Penugonda','Varun','Penugonda', 1, 1, 'Austin', 1, @Jefferson),
('VPANGU-C','Venugopal Panguluri','Venu','Panguluri', 1, 0, null, 0, null),
('CCROMER', 'Catherine Cromer', 'Catherine', 'Cromer', 1, 0, null, 0, null),
('CLORENCE', 'Christina Lorence', 'Christina', 'Lorence', 1, 0, null, 0, null),
('BOZUNA', 'Becky Ozuna', 'Becky', 'Ozuna', 1, 0, null, 0, null),
('SGANTA-C', 'Subodh Ganta', 'Subodh', 'Ganta', 1, 0, null, 0, null),
('CKNAPO',  'Carlotta Knapo', 'Carlotta', 'Knapo', 1, 0, null, 0, null),
('VKUMA3-C', 'Vidhya Kumar','Vidhya','Kumar', 1, 0, null, 0, null),
('GPARTH-C', 'Gopinath Parthasarathy', 'Gopinath','Parthasarathy', 1, 0, null, 0, null),
('SREYNO1', 'Shelley Reynolds', 'Shelley', 'Reynolds', 0, 1, 'Lufkin', 0, null),
('TMURRAY', 'Tabitha Murray', 'Tabitha', 'Murray', 0, 1, 'Beaumont', 0, null),
('PSTATON', 'Philip Staton', 'Philip', 'Staton', 0, 1, 'Dallas', 0, null),
('MHOHLE', 'Mikayla Adare', 'Mikayla', 'Adare', 0, 1, 'Austin', 0, null),
('SFAHRNEY', 'Stephanie Fahrney', 'Stephanie', 'Fahrney', 0, 1, 'Atlanta', 0, null),
('DPALMER2', 'Lynn Palmer', 'Lynn', 'Palmer', 0, 0, null, 1, @Tyler);

-- declare variables used in cursor
DECLARE @uname VARCHAR(255), @fname VARCHAR(255), @lname VARCHAR(255), @IsAdmin bit, @IsDc bit, @DcLocation varchar(100), @IsMC bit, @McLocation varchar(100);

DECLARE cursor_users CURSOR FOR
  SELECT username, FIRST_NAME, LAST_NAME, IsAdmin, IsDc, DcLocation, IsMc, McLocation
FROM @users_tbl

-- open cursor
OPEN cursor_users;

-- loop through a cursor
FETCH NEXT FROM cursor_users INTO @uname, @fname, @lname, @IsAdmin, @IsDc, @DcLocation, @IsMc, @McLocation;
WHILE @@FETCH_STATUS = 0
    BEGIN
	-- remove user from all current roles
    DELETE r 
    FROM [ROLE] r
        INNER JOIN [USER_PERSON] u ON r.[USER_ID] = u.[USER_ID]
    WHERE 
        u.[USERNAME] = @uname;

	If @IsAdmin = 1
	BEGIN;
		EXEC AddUserToRole @username=@uname, @firstName = @fname, @lastName = @lname, @roleType='Administrator', @locationName='', @startDate='10/8/2021';
	END;

	If @IsMC = 1
	BEGIN;
		EXEC AddUserToRole @username=@uname, @firstName = @fname, @lastName = @lname, @roleType='Maintenance Coordinator', @locationName=@McLocation, @startDate='10/8/2021';
	END;

	If @IsDc = 1
	BEGIN;
		EXEC AddUserToRole @username=@uname, @firstName = @fname, @lastName = @lname, @roleType='District Coordinator', @locationName=@DcLocation, @startDate='10/8/2021';
	END;

    FETCH NEXT FROM cursor_users INTO  @uname, @fname, @lname, @IsAdmin, @IsDc, @DcLocation, @IsMc, @McLocation;
END;

-- close and deallocate cursor
CLOSE cursor_users;
DEALLOCATE cursor_users;
