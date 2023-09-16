CREATE OR ALTER PROCEDURE RemoveUserFromRole
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
        THROW 51000, 'username is required', 1;
    END;

    DECLARE @role VARCHAR(255);

    -- validate roletype and set role
    SELECT TOP (1)
        @role = v.VALID_VALUE
    FROM [VALUE] v
        INNER JOIN [COLUMN_NAME] c on c.COLUMN_ID = v.COLUMN_ID
        INNER JOIN [TABLE_NAME] t on c.TABLE_ID = t.TABLE_ID
    WHERE 
	t.[NAME] = 'ROLE'
        AND v.VALID_VALUE = @roletype;

    IF (@role IS NULL)
	BEGIN;
        THROW 51000, 'roletype is not valid', 1;
    END;

    DECLARE @userId INT;
    SELECT TOP (1)
        @userId = [USER_ID]
    FROM [USER_PERSON]
    WHERE [USERNAME] = @username;

    IF @userId IS NULL
		THROW 51000, 'USER_PERSON is not found', 1;

    -- get the organization id
    DECLARE @OrgId INT;

    IF (@role = 'Administrator')
		SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM TXDOT
    WHERE [SECTION_NAME] = 'Adopt A Highway Team';
	ELSE IF (@role = 'District Coordinator')
		SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM DISTRICT
    WHERE UPPER([NAME]) = UPPER(@locationName);
	ELSE IF (@role = 'Maintenance Coordinator')
		SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM MAINTENANCE_SECTION
    WHERE UPPER([NAME]) = UPPER(@locationName);
	ELSE IF (@role = 'Volunteer')
		SELECT TOP (1)
        @OrgId = ORGANIZATION_ID
    FROM GROUP_SPONSOR
    WHERE UPPER([NAME]) = UPPER(@locationName);

    -- throw an error if we didn't find a location from the locationName provided
    DECLARE @locationError NVARCHAR(255);
    SET @locationError = 'RemoveUserFromRole: Could not find a ' + @roleType + ' location for `' + COALESCE(@locationName, '<null>') + '`'
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
        PRINT 'Username `' + @userName + '` was removed from the ' + @roletype + ' role'
    END

    SET NOCOUNT OFF;

END;
