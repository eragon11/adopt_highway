/**
 Create roles for new developer Ameeth Takur (ATHAKU-C)
 */
DECLARE @uname NVARCHAR(255) = 'ATHAKU-C',
    @fname NVARCHAR(255) = 'Ameeth',
    @lname NVARCHAR(255) = 'Thakur',
    @now datetime2 = GETDATE();

EXEC AddUserToRole @username = @uname,
@firstName = @fname,
@lastName = @lname,
@roleType = 'Administrator',
@locationName = '',
@startDate = @now;

EXEC AddRoleToUser @username = @uname,
@roleType = 'Read Only User',
@locationName = NULL,
@startDate = @now;

EXEC AddRoleToUser @username = @uname,
@roleType = 'District Coordinator',
@locationName = 'Austin',
@startDate = @now;

EXEC AddRoleToUser @username = @uname,
@roleType = 'Maintenance Coordinator',
@locationName = 'Jefferson',
@startDate = @now;

DECLARE @CNT INT = 0;

SELECT @CNT = COUNT(*)
FROM USER_PERSON up
    INNER JOIN ROLE r ON up.USER_ID = r.USER_ID
WHERE up.USERNAME = @uname;

DECLARE @errmsg NVARCHAR(max);
SET @errmsg = CONCAT('\rRoles for ', @uname, ' were not created successfully');

IF @CNT <> 4 THROW 51000, @errmsg, 1;