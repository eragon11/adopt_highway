/**
INSERTS PUBLIC EMAILS OF DEV TEAM 
FOR TESTING PING EXTERNAL AUTHENTICATION
*/
DECLARE @users_tbl TABLE (
    USERNAME varchar(100) NOT NULL,
    FULL_NAME varchar(120) NULL,
    FIRST_NAME varchar(30) NULL,
    LAST_NAME varchar(30) NULL
);

-- inserting AAH team members to debug locally and on web
INSERT INTO @users_tbl
    (USERNAME, FULL_NAME, FIRST_NAME, LAST_NAME)
VALUES
('aah.txdotuser01@gmail.com'
        , 'AAH Test User 1'
        , 'AAH'
        , 'Test User 1'),
('aah.txdotuser02@gmail.com'
        , 'AAH Test User 2'
        , 'AAH'
        , 'Test User 2');

INSERT INTO USER_PERSON
    (USERNAME, FULL_NAME, FIRST_NAME, LAST_NAME)
SELECT t1.USERNAME, t1.FULL_NAME, t1.FIRST_NAME, t1.LAST_NAME
FROM @users_tbl t1
    LEFT JOIN USER_PERSON up ON t1.USERNAME = up.USERNAME
WHERE up.USER_ID IS NULL;

-- insert addresses
INSERT INTO [ADDRESS]
    ([USER_ID]
    ,[PRIMARY_CONTACT]
    ,[TYPE]
    ,[ADDRESS_LINE1]
    ,[ADDRESS_LINE2]
    ,[CITY]
    ,[STATE]
    ,[POSTAL_CODE]
    ,[COMMENT])
SELECT u.USER_ID, 'Y', 'MAILING', '123 MAIN ST', 'APT 123', 'AUSTIN', 'TX', '78705', 'SAMPLE DATA INSERTED'
FROM USER_PERSON u
WHERE username IN  ('aah.txdotuser01@gmail.com','aah.txdotuser02@gmail.com');

-- insert into email
INSERT INTO [aah].[EMAIL]
    ([USER_ID]
    ,[TYPE]
    ,[VALUE]
    ,[COMMENT])
SELECT
    u.[USER_ID]
, 'Primary'
, u.USERNAME
, 'SAMPLE DATA INSERT'
FROM USER_PERSON u
WHERE username IN  ('aah.txdotuser01@gmail.com','aah.txdotuser02@gmail.com');

-- insert phone
INSERT INTO [aah].[PHONE]
    ([USER_ID]
    ,[TYPE]
    ,[VALUE]
    ,[COMMENT])
SELECT
    u.[USER_ID]
, 'Primary'
, '512-555-1234'
, 'SAMPLE DATA INSERT'
FROM USER_PERSON u
WHERE username IN  ('aah.txdotuser01@gmail.com','aah.txdotuser02@gmail.com');


DECLARE @ORG_ID INT;

-- INSERT AN UNKNOWN ORG
INSERT INTO ORGANIZATION
    ([TYPE])
SELECT 'UNKNOWN'
WHERE NOT EXISTS (SELECT [TYPE]
FROM [ORGANIZATION]
WHERE [TYPE] = 'UNKNOWN');

-- GET THE ORG ID
SELECT TOP 1
    @ORG_ID = [ORGANIZATION_ID]
FROM [ORGANIZATION]
WHERE [TYPE] = 'UNKNOWN';

-- INSERT AN UNKNOWN GROUP
INSERT INTO [GROUP_SPONSOR]
    ([ORGANIZATION_ID]
    ,[TYPE]
    ,[NAME]
    ,[ESTIMATED_VOLUNTEER_COUNT]
    ,[APPLICATION_SEND_DATE]
    ,[INITIAL_CONTACT_DATE]
    ,[COMMENT]
    ,[COUNTY_ID])
SELECT @ORG_ID
           , 'Unknown'
           , 'UNKNOWN GROUP'
           , 0
           , GETDATE()
           , GETDATE()
           , 'USED FOR TESTING PURPOSES'
           , 14
WHERE NOT EXISTS (SELECT ORGANIZATION_ID
FROM GROUP_SPONSOR
WHERE ORGANIZATION_ID = @ORG_ID);

-- Create the volunteer role
INSERT INTO [ROLE]
    ([USER_ID], [ORGANIZATION_ID], [TYPE], [START_DATE])
SELECT t2.USER_ID, @ORG_ID, 'Volunteer', GETDATE()
FROM @users_tbl t1
    LEFT JOIN [USER_PERSON] t2 ON t1.[USERNAME] = t2.[USERNAME]
    LEFT JOIN [ROLE] r ON t2.[USER_ID] = r.[USER_ID] and r.[TYPE] = 'Volunteer' AND r.[ORGANIZATION_ID] = @ORG_ID
WHERE r.[ROLE_ID] IS NULL;
