DECLARE @ORG_ID INT;

-- create an AAH TxDOT ORG
IF (NOT EXISTS(SELECT * FROM ORGANIZATION WHERE Type = 'TxDOT'))
BEGIN
    INSERT INTO ORGANIZATION (Type) VALUES('TxDOT');
    SET @ORG_ID = SCOPE_IDENTITY();
END
ELSE
BEGIN
    SELECT TOP 1 @ORG_ID = ORGANIZATION_ID FROM ORGANIZATION WHERE TYPE = 'TxDOT';
END

DECLARE @section_name NVARCHAR(255);
SET @section_name = 'Adopt A Highway Team'
IF (NOT EXISTS(SELECT * FROM TxDOT WHERE SECTION_NAME = @section_name))
BEGIN
    INSERT INTO TXDOT (SECTION_NAME, ORGANIZATION_ID) 
    VALUES (@section_name, @ORG_ID);
END

DECLARE @users_tbl TABLE (
    USERNAME          varchar(100)   NOT NULL,
    FULL_NAME         varchar(120)   NULL,
    FIRST_NAME        varchar(30)    NULL,
    LAST_NAME         varchar(30)    NULL
);

INSERT INTO @users_tbl(USERNAME, FULL_NAME, FIRST_NAME, LAST_NAME)
VALUES
('CCROMER', 'Catherine Cromer', 'Catherine', 'Cromer'),
('CLORENCE', 'Christina Lorence', 'Christina', 'Lorence'),
('BOZUNA', 'Becky Ozuna', 'Becky', 'Ozuna'),
('SGANTA-C', 'Subodh Ganta', 'Subodh', 'Ganta'),
('SCALCO-C', 'Sharon Calcotte', 'Sharon', 'Calcotte'),
('CKNAPPO', 'Carlotta Knappo', 'Carlotta', 'Knappo');

INSERT INTO USER_PERSON (USERNAME, FULL_NAME, FIRST_NAME, LAST_NAME)
SELECT t1.USERNAME, t1.FULL_NAME, t1.FIRST_NAME, t1.LAST_NAME 
FROM @users_tbl t1
LEFT JOIN USER_PERSON up ON t1.USERNAME = up.[USERNAME]
WHERE up.USER_ID IS NULL;

INSERT INTO ROLE(USER_ID, ORGANIZATION_ID, TYPE, START_DATE)
SELECT t2.USER_ID, @ORG_ID, 'Administrator', GETDATE()
FROM @users_tbl t1
INNER JOIN USER_PERSON t2 ON t1.USERNAME = t2.USERNAME
LEFT JOIN ROLE r on t2.[USER_ID] = r.[USER_ID] and r.[ORGANIZATION_ID] = @ORG_ID AND r.[TYPE] = 'Administrator'
WHERE r.ROLE_ID IS NULL;