-- AH-482

-- GOAL create sample user

-- insert new user_person records
DECLARE @users_tbl TABLE (
    USERNAME varchar(100) NOT NULL,
    FULL_NAME varchar(120) NULL,
    FIRST_NAME varchar(30) NULL,
    LAST_NAME varchar(30) NULL,
    DISTRICT_NAME varchar(255) NULL
);

INSERT INTO @users_tbl
    (USERNAME, FULL_NAME, FIRST_NAME, LAST_NAME, DISTRICT_NAME)
VALUES
    ('SDOE', 'Steve Doe', 'Steve', 'Doe', 'Austin');

INSERT INTO USER_PERSON
    (USERNAME, FULL_NAME, FIRST_NAME, LAST_NAME)
SELECT t1.USERNAME, t1.FULL_NAME, t1.FIRST_NAME, t1.LAST_NAME
FROM @users_tbl t1
    LEFT JOIN USER_PERSON up ON t1.USERNAME = up.[USERNAME]
WHERE up.[USER_ID] IS NULL;

INSERT INTO [ROLE]
    ([USER_ID]
    ,[ORGANIZATION_ID]
    ,[TYPE]
    ,[START_DATE]
    ,[END_DATE])
SELECT
    u.USER_ID
    , d.ORGANIZATION_ID
    , 'Administrator'
    , DATEADD(yy, -7, getdate())
    , null
FROM USER_PERSON u
    INNER JOIN @users_tbl ut ON u.[USERNAME] = ut.[USERNAME]
    LEFT JOIN [DISTRICT] d on ut.[DISTRICT_NAME] = d.[NAME]
    LEFT JOIN [ORGANIZATION] o on d.[ORGANIZATION_ID] = o.[ORGANIZATION_ID]
    LEFT JOIN [ROLE] r ON u.[USER_ID] = r.[USER_ID] and d.[ORGANIZATION_ID] = r.[ORGANIZATION_ID]
WHERE r.[ROLE_ID] IS NULL;