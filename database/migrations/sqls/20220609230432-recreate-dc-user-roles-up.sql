-- ADD DC users to the database for data cleanup

-- re add our user roles
-- create a table variable to hold the users
DECLARE @users_tbl TABLE (
    USERNAME        varchar(100)    NOT NULL,
    FULL_NAME       varchar(120)    NULL,
    FIRST_NAME      varchar(30)     NULL,
    LAST_NAME       varchar(30)     NULL,
    IsDc            bit             NULL        DEFAULT(1),
    DcLocation      varchar(100)    NULL 
);

INSERT INTO @users_tbl(USERNAME, FULL_NAME, FIRST_NAME, LAST_NAME, IsDc, DcLocation)
VALUES
('Traci.Graham',	'Traci Graham',	'Traci',	'Graham',	1,	'Abilene'),
('Kimberly.Sherley',	'Kimberly Sherley',	'Kimberly',	'Sherley',	1,	'Abilene'),
('Molly.Olson',	'Molly Olson',	'Molly',	'Olson',	1,	'Abilene'),
('Julie.Reynolds',	'Julie Reynolds',	'Julie',	'Reynolds',	1,	'Amarillo'),
('Stephanie.Fahrney',	'Stephanie Fahrney',	'Stephanie',	'Fahrney',	1,	'Atlanta'),
('Mikayla.Adare',	'Mikayla Adare',	'Mikayla',	'Adare',	1,	'Austin'),
('Tabitha.Murray',	'Tabitha Murray',	'Tabitha',	'Murray',	1,	'Beaumont'),
('Lisa.Tipton',	'Lisa Tipton',	'Lisa',	'Tipton',	1,	'Brownwood'),
('Jan.Robbins',	'Jan Robbins',	'Jan',	'Robbins',	1,	'Bryan'),
('Ginger.Wilson',	'Ginger Wilson',	'Ginger',	'Wilson',	1,	'Childress'),
('Omar.Garcia',	'Omar Garcia',	'Omar',	'Garcia',	1,	'Corpus Christi'),
('Ariana.Jefferson',	'Ariana Jefferson',	'Ariana',	'Jefferson',	1,	'Dallas'),
('Josie.AguilarCrosby',	'Josie Aguilar',	'Josie',	'Aguilar',	1,	'El Paso'),
('Christine.Jones',	'Christine Jones',	'Christine',	'Jones',	1,	'Fort Worth'),
('Margaret.Jasso',	'Margaret Jasso ',	'Margaret',	'Jasso',	1,	'Fort Worth'),
('Hanna.Henderson',	'Hanna Henderson',	'Hanna',	'Henderson',	1,	'Houston'),
('Marissa.Guerrettaz',	'Marissa Guerrettaz',	'Marissa',	'Guerrettaz',	1,	'Houston'),
('Lydia.Segovia',	'Lydia Segovia',	'Lydia',	'Segovia',	1,	'Laredo'),
('Carolyn.Craddick',	'Carolyn Craddick',	'Carolyn',	'Craddick',	1,	'Lubbock'),
('Shelley.Reynolds',	'Shelley Reynolds',	'Shelley',	'Reynolds',	1,	'Lufkin'),
('Gene.Powell',	'Gene Powell',	'Gene',	'Powell',	1,	'Odessa'),
('Stephanie.O''Neal',	'Stephanie O''Neal',	'Stephanie',	'O''Neal',	1,	'Paris'),
('Amanda.McEachern',	'Amanda McEachern',	'Amanda',	'McEachern',	1,	'Pharr'),
('James.Whitlock',	'James Whitlock',	'James',	'Whitlock',	1,	'San Angelo'),
('Melanie.McBride',	'Melanie McBride',	'Melanie',	'McBride',	1,	'San Antonio'),
('Jenny.Bien',	'Jenny Bien',	'Jenny',	'Bien',	1,	'Tyler'),
('Kellie.Mannering',	'Kellie Mannering ',	'Kellie',	'Mannering',	1,	'Waco'),
('Christopher.Peters',	'Chris Peters',	'Chris',	'Peters',	1,	'Wichita Falls'),
('Linda.Berger',	'Linda Berger ',	'Linda',	'Berger',	1,	'Yoakum');


-- declare variables used in cursor
DECLARE @uname VARCHAR(255), @fname VARCHAR(255), @lname VARCHAR(255), @IsDc bit, @DcLocation varchar(100);

DECLARE cursor_users CURSOR FOR
  SELECT username, FIRST_NAME, LAST_NAME, IsDc, DcLocation
FROM @users_tbl

-- open cursor
OPEN cursor_users;

-- loop through a cursor
FETCH NEXT FROM cursor_users INTO @uname, @fname, @lname, @IsDc, @DcLocation;
WHILE @@FETCH_STATUS = 0
    BEGIN
	-- remove user from all current roles
    DELETE r 
    FROM [ROLE] r
        INNER JOIN [USER_PERSON] u ON r.[USER_ID] = u.[USER_ID]
    WHERE 
        u.[USERNAME] = @uname;

	If @IsDc = 1
	BEGIN;
		EXEC AddUserToRole @username=@uname, @firstName = @fname, @lastName = @lname, @roleType='District Coordinator', @locationName=@DcLocation, @startDate='10/8/2021';
	END;

    FETCH NEXT FROM cursor_users INTO  @uname, @fname, @lname, @IsDc, @DcLocation;
END;

-- close and deallocate cursor
CLOSE cursor_users;
DEALLOCATE cursor_users;
