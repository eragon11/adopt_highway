/**
Create the read-only user role type
*/

-- insert into values
DECLARE @new_values TABLE (
    [TABLE_NAME] NVARCHAR(255) NOT NULL,
    [COLUMN_NAME] NVARCHAR(255) NOT NULL,
    [VALID_VALUE] NVARCHAR(255) NOT NULL,
    [DESCRIPTION] NVARCHAR(255) NOT NULL
);

INSERT INTO @new_values
    ([TABLE_NAME], [COLUMN_NAME], [VALID_VALUE], [DESCRIPTION])
VALUES
    ('ROLE', 'TYPE', 'Read Only User', '');

INSERT INTO [VALUE]
    ([COLUMN_ID], [VALID_VALUE], [DESCRIPTION], [ACTIVE])
SELECT cn.[COLUMN_ID], nv.[VALID_VALUE], nv.[DESCRIPTION], 'Y'
FROM @new_values nv
    INNER JOIN [TABLE_NAME] tn ON nv.[TABLE_NAME] = tn.[NAME]
    INNER JOIN [COLUMN_NAME] cn ON cn.[TABLE_ID] = tn.[TABLE_ID] AND nv.[COLUMN_NAME] = cn.[NAME]
    LEFT JOIN [VALUE] v ON cn.[COLUMN_ID] = v.[COLUMN_ID] AND nv.[VALID_VALUE] = v.[VALID_VALUE]
WHERE v.[COLUMN_ID] IS NULL AND v.[VALID_VALUE] IS NULL;

exec sp_executesql @statement=N'CREATE OR ALTER PROCEDURE [AddRoleToUser]
    (
    @username VARCHAR(255),
    @roletype VARCHAR(255),
    @locationName VARCHAR(255),
    @startDate DATETIME2 = null
)
AS
BEGIN;
    SET NOCOUNT ON;
    IF (@username IS NULL)
     BEGIN;
        THROW 51000, ''username is required'', 1;
    END;
    DECLARE @role VARCHAR(255);
    -- validate roletype and set role
    SELECT TOP (1)
        @role = v.VALID_VALUE
    FROM [VALUE] v
        INNER JOIN [COLUMN_NAME] c on c.COLUMN_ID = v.COLUMN_ID
        INNER JOIN [TABLE_NAME] t on c.TABLE_ID = t.TABLE_ID
    WHERE
    t.[NAME] = ''ROLE''
        AND v.VALID_VALUE = @roletype;
    IF (@role IS NULL)
    BEGIN;
        THROW 51000, ''roletype is not valid'', 1;
    END;
    -- insert new user_person records
    DECLARE @users_tbl TABLE (
        USERNAME varchar(100) NOT NULL
    );
    INSERT INTO @users_tbl
        (USERNAME)
    VALUES
        (UPPER(@username));

    -- get the organization id
    DECLARE @OrgId INT;
    IF (@role = ''Administrator'')
        SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM TXDOT
    WHERE [SECTION_NAME] = ''Adopt A Highway Team'';
    ELSE IF (@role = ''Read Only User'')
        SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM TXDOT
    WHERE [SECTION_NAME] = ''Adopt A Highway Team'';
    ELSE IF (@role = ''District Coordinator'')
        SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM DISTRICT
    WHERE UPPER([NAME]) = UPPER(@locationName);
    ELSE IF (@role = ''Maintenance Coordinator'')
        SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM MAINTENANCE_SECTION
    WHERE UPPER([NAME]) = UPPER(@locationName);
    ELSE IF (@role = ''Volunteer'')
        SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM GROUP_SPONSOR
    WHERE UPPER([NAME]) = UPPER(@locationName);
    -- throw an error if we didn''t find a location from the locationName provided
    DECLARE @locationError NVARCHAR(255);
    SET @locationError = ''Could not find a '' + @roleType + '' location for `'' + ISNULL(@locationName, ''<null>'') + ''`''
    IF (@OrgId IS NULL)
    THROW 51000, @locationError, 1;
    -- insert a new role, if it does not exist for the user at this organization id
    -- you can not insert more than one ROLE for an ORGANIZATIONID
    INSERT INTO [aah].[ROLE]
        ([USER_ID]
        ,[ORGANIZATION_ID]
        ,[TYPE]
        ,[START_DATE]
        ,[END_DATE])
    SELECT
        u.USER_ID
    , @OrgId
    , @roletype
    , COALESCE(@startDate, GETDATE())
    , null
    FROM [aah].[USER_PERSON] u
        INNER JOIN @users_tbl ut ON u.[USERNAME] = ut.[USERNAME]
        LEFT JOIN [aah].[ROLE] r ON u.[USER_ID] = r.[USER_ID] and r.TYPE = @roletype and r.[ORGANIZATION_ID] = @OrgId
    WHERE r.[ROLE_ID] IS NULL;
    SET NOCOUNT OFF;
END;
';

exec sp_executesql @statement=N'CREATE OR ALTER   PROCEDURE [RemoveUserFromRole]
    (
    @username VARCHAR(255),
    @roletype VARCHAR(255),
    @locationName VARCHAR(255)
)
AS
BEGIN;
    SET NOCOUNT ON;

    IF (@username IS NULL)
	 BEGIN;
        THROW 51000, ''username is required'', 1;
    END;

    DECLARE @role VARCHAR(255);

    -- validate roletype and set role
    SELECT TOP (1)
        @role = v.VALID_VALUE
    FROM [VALUE] v
        INNER JOIN [COLUMN_NAME] c on c.COLUMN_ID = v.COLUMN_ID
        INNER JOIN [TABLE_NAME] t on c.TABLE_ID = t.TABLE_ID
    WHERE 
	t.[NAME] = ''ROLE''
        AND v.VALID_VALUE = @roletype;

    IF (@role IS NULL)
	BEGIN;
        THROW 51000, ''roletype is not valid'', 1;
    END;

    DECLARE @userId INT;
    SELECT TOP (1)
        @userId = [USER_ID]
    FROM [USER_PERSON]
    WHERE [USERNAME] = @username;

    IF @userId IS NULL
		THROW 51000, ''USER_PERSON is not found'', 1;

    -- get the organization id
    DECLARE @OrgId INT;

    IF (@role = ''Administrator'')
		SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM TXDOT
    WHERE [SECTION_NAME] = ''Adopt A Highway Team'';
	ELSE IF (@role = ''Read Only User'')
		SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM TXDOT
    WHERE [SECTION_NAME] = ''Adopt A Highway Team'';
	ELSE IF (@role = ''District Coordinator'')
		SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM DISTRICT
    WHERE UPPER([NAME]) = UPPER(@locationName);
	ELSE IF (@role = ''Maintenance Coordinator'')
		SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM MAINTENANCE_SECTION
    WHERE UPPER([NAME]) = UPPER(@locationName);
	ELSE IF (@role = ''Volunteer'')
		SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM GROUP_SPONSOR
    WHERE UPPER([NAME]) = UPPER(@locationName);

    -- throw an error if we didn''t find a location from the locationName provided
    DECLARE @locationError NVARCHAR(255);
    SET @locationError = ''RemoveUserFromRole: Could not find a '' + @roleType + '' location for `'' + COALESCE(@locationName, ''<null>'') + ''`''
    IF (@OrgId IS NULL)
    BEGIN;
        THROW 51000, @locationError, 1;
    END;

    DECLARE @roleCount int;

    -- get row count
    SELECT @roleCount = COUNT(*)
    FROM [USER_PERSON] u
        INNER JOIN [ROLE] r ON u.[USER_ID] = r.[USER_ID]
    WHERE u.USERNAME = @username AND r.[ORGANIZATION_ID] = @OrgId AND r.TYPE = @roleType;

    -- print out that we created a new role.
    IF @roleCount = 1
	BEGIN
        DELETE FROM [ROLE]
		WHERE [USER_ID] = @userId AND [TYPE] = @roleType AND [ORGANIZATION_ID] = @OrgId
        PRINT ''Username `'' + @userName + ''` was removed from the '' + @roletype + '' role''
    END

    SET NOCOUNT OFF;

END;
';
