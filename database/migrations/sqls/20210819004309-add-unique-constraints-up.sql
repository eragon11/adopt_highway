SET NOCOUNT ON;

-- Add identity to SIGN_STATUS
DECLARE @sqlstr NVARCHAR(max) = '';

IF (SELECT OBJECTPROPERTY(OBJECT_ID('SIGN_STATUS'), 'TableHasIdentity')) = 0
BEGIN;
	CREATE TABLE [SIGN_STATUS_SWITCH](
		[SIGN_STATUS_ID] [int] NOT NULL IDENTITY(1, 1) PRIMARY KEY,
		[SIGN_ID] [int] NOT NULL,
		[STATUS] [varchar](100) NOT NULL,
		[BEGIN_DATE] [datetime2](7) NULL,
		[COMPLETION_DATE] [datetime2](7) NULL,
		[COMMENT] [varchar](500) NULL);
	
	SET IDENTITY_INSERT SIGN_STATUS_SWITCH ON;
	INSERT INTO SIGN_STATUS_SWITCH ([SIGN_STATUS_ID], [SIGN_ID], [STATUS], [BEGIN_DATE], [COMPLETION_DATE], [COMMENT])
	SELECT [SIGN_STATUS_ID], [SIGN_ID], [STATUS], [BEGIN_DATE], [COMPLETION_DATE], [COMMENT] 
	FROM SIGN_STATUS;
	SET IDENTITY_INSERT SIGN_STATUS_SWITCH OFF;
	DROP TABLE SIGN_STATUS_SWITCH;
END;

IF ((SELECT COL_LENGTH('GROUP_SPONSOR', 'COUNTY_ID')) IS NULL)
BEGIN;
	ALTER TABLE GROUP_SPONSOR 
	ADD COUNTY_ID INT NULL;
END;

IF (((SELECT COL_LENGTH('GROUP_SPONSOR', 'COUNTY_ID')) IS NOT NULL)
AND ((SELECT COL_LENGTH('GROUP_SPONSOR', 'COUNTY_CODE')) IS NOT NULL))
BEGIN
	SET @sqlstr='UPDATE GROUP_SPONSOR
	SET COUNTY_ID = c.COUNTY_ID
	FROM GROUP_SPONSOR gs
	INNER JOIN COUNTY c ON gs.COUNTY_CODE = c.CODE;'
	EXECUTE(@sqlstr);

	ALTER TABLE GROUP_SPONSOR DROP COLUMN [COUNTY_CODE];
END

IF ((SELECT COL_LENGTH('MAINTENANCE_SECTION', 'DISTRICT_ID')) IS NULL)
BEGIN;
	ALTER TABLE MAINTENANCE_SECTION 
	ADD DISTRICT_ID INT NULL;
END;

IF ((SELECT COL_LENGTH('MAINTENANCE_SECTION', 'COUNTY_ID')) IS NULL)
BEGIN;
	ALTER TABLE MAINTENANCE_SECTION 
	ADD COUNTY_ID INT NULL;
END;

IF (((SELECT COL_LENGTH('MAINTENANCE_SECTION', 'COUNTY_ID')) IS NOT NULL)
AND ((SELECT COL_LENGTH('MAINTENANCE_SECTION', 'COUNTY_CODE')) IS NOT NULL))
BEGIN
	SET @sqlstr = 'UPDATE MAINTENANCE_SECTION
	SET COUNTY_ID = c.COUNTY_ID
	FROM MAINTENANCE_SECTION mc
	INNER JOIN COUNTY c ON mc.COUNTY_CODE = c.CODE;';
	EXECUTE(@sqlstr);

	ALTER TABLE MAINTENANCE_SECTION DROP COLUMN [COUNTY_CODE];
END

IF (((SELECT COL_LENGTH('MAINTENANCE_SECTION', 'DISTRICT_ID')) IS NOT NULL)
AND ((SELECT COL_LENGTH('MAINTENANCE_SECTION', 'DISTRICT_CODE')) IS NOT NULL))
BEGIN
	SET @sqlstr = 'UPDATE MAINTENANCE_SECTION
	SET DISTRICT_ID = c.DISTRICT_ID
	FROM MAINTENANCE_SECTION mc
	INNER JOIN DISTRICT c ON mc.DISTRICT_CODE = c.CODE;';
	EXECUTE(@sqlstr);

	ALTER TABLE MAINTENANCE_SECTION DROP COLUMN [DISTRICT_CODE];
END

IF OBJECT_ID('[AK_ADDRESS]') IS NULL 
BEGIN;
	ALTER TABLE [ADDRESS]
	ADD CONSTRAINT AK_ADDRESS UNIQUE ([USER_ID], [PRIMARY_CONTACT],[ADDRESS_LINE1],[ADDRESS_LINE2], [CITY], [STATE], [POSTAL_CODE]);
END;

IF OBJECT_ID('[AK_COLUMN_NAME]') IS NULL 
BEGIN;
	ALTER TABLE [COLUMN_NAME]
	ADD CONSTRAINT AK_COLUMN_NAME UNIQUE ([TABLE_ID], [NAME]);
END;

IF OBJECT_ID('[AK_COUNTY]') IS NULL 
BEGIN;
	ALTER TABLE [COUNTY]
	ADD CONSTRAINT AK_COUNTY UNIQUE ([CODE]);
END;

IF OBJECT_ID('[AK_DISTRICT]') IS NULL 
BEGIN;
	ALTER TABLE [DISTRICT]
	ADD CONSTRAINT AK_DISTRICT UNIQUE ([CODE]);
END;

IF OBJECT_ID('[AK_DOCUMENT]') IS NULL 
BEGIN;
	ALTER TABLE [DOCUMENT]
	ADD CONSTRAINT AK_DOCUMENT UNIQUE ([AGREEMENT_ID], [TEMPLATE_NAME], [SENT_DATE]);
END;

IF OBJECT_ID('[AK_EMAIL]') IS NULL 
BEGIN;
	ALTER TABLE [EMAIL]
	ADD CONSTRAINT AK_EMAIL UNIQUE ([USER_ID], [TYPE]);
END;

IF OBJECT_ID('[AK_MAINTENANCE_SECTION]') IS NULL 
BEGIN;
	ALTER TABLE [MAINTENANCE_SECTION]
	ADD CONSTRAINT AK_MAINTENANCE_SECTION UNIQUE ([ORGANIZATION_ID], [NUMBER], [DISTRICT_ID], [COUNTY_ID]);
END;

IF OBJECT_ID('[AK_PHONE]') IS NULL 
BEGIN;
	ALTER TABLE [PHONE]
	ADD CONSTRAINT AK_PHONE UNIQUE ([USER_ID], [TYPE]);
END;

IF OBJECT_ID('[AK_ROLE]') IS NULL 
BEGIN;
	ALTER TABLE [ROLE]
	ADD CONSTRAINT AK_ROLE UNIQUE ([USER_ID],[ORGANIZATION_ID],[TYPE]);
END;

IF OBJECT_ID('[AK_TABLE_NAME]') IS NULL 
BEGIN;
	ALTER TABLE [TABLE_NAME]
	ADD CONSTRAINT AK_TABLE_NAME UNIQUE ([NAME]);
END;

IF OBJECT_ID('[AK_USER_PERSON]') IS NULL 
BEGIN;
	ALTER TABLE [USER_PERSON]
	ADD CONSTRAINT AK_USER_PERSON UNIQUE ([USERNAME]);
END;

IF OBJECT_ID('[AK_VALUE]') IS NULL 
BEGIN;
	ALTER TABLE [VALUE]
	ADD CONSTRAINT AK_VALUE UNIQUE ([COLUMN_ID], [VALID_VALUE]);
END;

IF OBJECT_ID('[AK_VALUE_RELATIONSHIP]') IS NULL 
BEGIN;
	ALTER TABLE [VALUE_RELATIONSHIP]
	ADD CONSTRAINT AK_VALUE_RELATIONSHIP UNIQUE ([VALUE_ID], [RELATED_VALUE_ID]);
END;

SET NOCOUNT OFF;