SET NOCOUNT ON;
DECLARE @roleorg TABLE ([TYPE] VARCHAR(255) null,[ORGANIZATION_ID] int NULL)
INSERT INTO @roleorg ([TYPE])
VALUES('District Coordinator')
, ('Maintenance Coordinator')
, ('Support Team')
, ('Approver')
, ('Volunteer')
, ('Sign Coordinator')
DECLARE @DcOrgId INT, @McOrgId INT, @VOrgId INT
-- Set our ORGs
SELECT TOP 1 @DcOrgId = ORGANIZATION_ID
FROM DISTRICT
WHERE NAME ='Austin';
SELECT TOP 1 @McOrgId = ORGANIZATION_ID
FROM MAINTENANCE_SECTION
WHERE NAME = 'EAST HARRIS MAINT OFFICE'
SELECT TOP 1 @VOrgId = o.ORGANIZATION_ID
FROM GROUP_SPONSOR g INNER JOIN ORGANIZATION o on g.ORGANIZATION_ID = o.ORGANIZATION_ID
INNER JOIN AGREEMENT a on a.GROUP_ID = g.GROUP_ID
WHERE STATUS = 'Active' AND END_DATE > GETDATE();
-- Assign some ORG IDs to roles
update @roleorg
SET ORGANIZATION_ID = @DcOrgId
WHERE [TYPE] = 'District Coordinator'
update @roleorg
SET ORGANIZATION_ID = @McOrgId
WHERE [TYPE] = 'Maintenance Coordinator'
update @roleorg
SET ORGANIZATION_ID = @McOrgId
WHERE [TYPE] = 'Support Team'
update @roleorg
SET ORGANIZATION_ID = @McOrgId
WHERE [TYPE] = 'Approver'
update @roleorg
SET ORGANIZATION_ID = @McOrgId
WHERE [TYPE] = 'Sign Coordinator'
update @roleorg
SET ORGANIZATION_ID = @VOrgId
WHERE [TYPE] = 'Volunteer'
update @roleorg
SET ORGANIZATION_ID = (SELECT TOP 1 ORGANIZATION_ID FROM TxDOT)
WHERE [TYPE] = 'Administrator'
update @roleorg
SET ORGANIZATION_ID = (SELECT TOP 1 ORGANIZATION_ID FROM TxDOT)
WHERE [ORGANIZATION_ID] IS NULL;
SET NOCOUNT OFF;
DECLARE @roles TABLE ([USER_ID] int null,[TYPE] VARCHAR(255) null,[ORGANIZATION_ID] int NULL)
EXEC convert_aah_data
INSERT INTO @roles ([USER_ID], [TYPE], [ORGANIZATION_ID])
SELECT u.[USER_ID], r.[TYPE], r.[ORGANIZATION_ID]
FROM @roleorg r
CROSS JOIN USER_PERSON u 
WHERE u.USERNAME IN ('BSNIDE-C', 'KJOHNS-C', 'AFENIX-C', 'RHATHE-C', 'VPENUG-C', 'VPANGU-C', 'CCROMER','CLORENCE','BOZUNA','SGANTA-C','SCALCO-C','CKNAPPO')
INSERT INTO ROLE (USER_ID, TYPE, ORGANIZATION_ID, START_DATE )
SELECT r.USER_ID, r.TYPE, r.ORGANIZATION_ID, DATEADD(dd, -733, GETDATE())
FROM @roles r
LEFT JOIN role r1 ON r1.USER_ID = r.USER_ID AND r.TYPE = r1.TYPE AND r.ORGANIZATION_ID = r1.ORGANIZATION_ID
WHERE r1.ROLE_ID IS NULL;
SET NOCOUNT OFF;
