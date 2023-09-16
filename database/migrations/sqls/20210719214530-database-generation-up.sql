IF OBJECT_ID('ADDRESS', 'U') IS NULL
BEGIN;
    CREATE TABLE [ADDRESS]
    (
        [ADDRESS_ID] int IDENTITY(1,1),
        [USER_ID] int NOT NULL,
        [PRIMARY_CONTACT] char(3) NOT NULL,
        [TYPE] varchar(20) NOT NULL,
        [ADDRESS_LINE1] varchar(50) NULL,
        [ADDRESS_LINE2] varchar(50) NULL,
        [CITY] varchar(50) NULL,
        [STATE] char(2) NULL,
        [POSTAL_CODE] varchar(10) NULL,
        [COMMENT] varchar(500) NULL,
        PRIMARY KEY NONCLUSTERED (ADDRESS_ID)
    );
END;

IF OBJECT_ID('AGREEMENT', 'U') IS NULL
BEGIN;
    CREATE TABLE [AGREEMENT]
    (
        [AGREEMENT_ID] int IDENTITY(1,1),
        [GROUP_ID] int NOT NULL,
        [SEGMENT_ID] int NOT NULL,
        [STATUS] varchar(20) NULL,
        [BEGIN_DATE] date NULL,
        [END_DATE] date NULL,
        [COMMENT] varchar(500) NULL,
        PRIMARY KEY NONCLUSTERED (AGREEMENT_ID)
    );
END;

IF OBJECT_ID('COLUMN_NAME', 'U') IS NULL
BEGIN;
    CREATE TABLE [COLUMN_NAME]
    (
        [COLUMN_ID] int IDENTITY(1,1),
        [TABLE_ID] int NOT NULL,
        [NAME] varchar(30) NOT NULL,
        PRIMARY KEY NONCLUSTERED (COLUMN_ID)
    );
END;

IF OBJECT_ID('COUNTY', 'U') IS NULL
BEGIN;
    CREATE TABLE [COUNTY]
    (
        [COUNTY_ID] int IDENTITY(1,1),
        [CODE] char(3) NOT NULL,
        [NAME] varchar(30) NOT NULL,
        PRIMARY KEY NONCLUSTERED (COUNTY_ID)
    );
END;

IF OBJECT_ID('DISTRICT', 'U') IS NULL
BEGIN;
    CREATE TABLE [DISTRICT]
    (
        [DISTRICT_ID] int IDENTITY(1,1),
        [ORGANIZATION_ID] int NOT NULL,
        [CODE] char(3) NOT NULL,
        [NAME] varchar(50) NULL,
        PRIMARY KEY NONCLUSTERED (DISTRICT_ID)
    );
END;

IF OBJECT_ID('DOCUMENT', 'U') IS NULL
BEGIN;
    CREATE TABLE [DOCUMENT]
    (
        [DOCUMENT_ID] int IDENTITY(1,1),
        [AGREEMENT_ID] int NOT NULL,
        [TEMPLATE_NAME] varchar(3000) NOT NULL,
        [SENT_DATE] datetime NOT NULL,
        PRIMARY KEY NONCLUSTERED (DOCUMENT_ID)
    );
END;

IF OBJECT_ID('EMAIL', 'U') IS NULL
BEGIN;
    CREATE TABLE [EMAIL]
    (
        [EMAIL_ID] int IDENTITY(1,1),
        [USER_ID] int NOT NULL,
        [TYPE] varchar(10) NOT NULL,
        [VALUE] varchar(100) NOT NULL,
        [COMMENT] varchar(500) NULL,
        PRIMARY KEY NONCLUSTERED (EMAIL_ID)
    );
END;

IF OBJECT_ID('GROUP_SPONSOR', 'U') IS NULL
BEGIN;
    CREATE TABLE [GROUP_SPONSOR]
    (
        [GROUP_ID] int IDENTITY(1,1),
        [ORGANIZATION_ID] int NOT NULL,
        [TYPE] varchar(30) NOT NULL,
        [NAME] varchar(200) NULL,
        [COUNTY_CODE] char(3) NULL,
        [ESTIMATED_VOLUNTEER_COUNT] int NULL,
        [APPLICATION_SEND_DATE] date NULL,
        [INITIAL_CONTACT_DATE] date NULL,
        [COMMENT] varchar(500) NULL,
        PRIMARY KEY NONCLUSTERED (GROUP_ID)
    );
END;

IF OBJECT_ID('MAINTENANCE_SECTION', 'U') IS NULL
BEGIN;
    CREATE TABLE [MAINTENANCE_SECTION]
    (
        [MAINTENANCE_SECTION_ID] int IDENTITY(1,1),
        [ORGANIZATION_ID] int NOT NULL,
        [NAME] varchar(50) NOT NULL,
        [NUMBER] int NOT NULL,
        [DISTRICT_CODE] char(3) NOT NULL,
        [COUNTY_CODE] char(3) NOT NULL,
        PRIMARY KEY NONCLUSTERED (MAINTENANCE_SECTION_ID)
    );
END;

IF OBJECT_ID('ORGANIZATION', 'U') IS NULL
BEGIN;
    CREATE TABLE [ORGANIZATION]
    (
        [ORGANIZATION_ID] int IDENTITY(1,1),
        [TYPE] varchar(20) NOT NULL,
        PRIMARY KEY NONCLUSTERED (ORGANIZATION_ID)
    );
END;

IF OBJECT_ID('PHONE', 'U') IS NULL
BEGIN;
    CREATE TABLE [PHONE]
    (
        [PHONE_ID] int IDENTITY(1,1),
        [USER_ID] int NOT NULL,
        [TYPE] varchar(20) NOT NULL,
        [VALUE] varchar(20) NOT NULL,
        [COMMENT] varchar(500) NULL,
        PRIMARY KEY NONCLUSTERED (PHONE_ID)
    );
END;

IF OBJECT_ID('PICKUP', 'U') IS NULL
BEGIN;
    CREATE TABLE [PICKUP]
    (
        [PICKUP_ID] int IDENTITY(1,1),
        [AGREEMENT_ID] int NOT NULL,
        [TYPE] varchar(20) NOT NULL,
        [ACTUAL_PICKUP_DATE] datetime NOT NULL,
        [BAG_FILL_QUANTITY] int NULL,
        [VOLUME_QUANTITY] int NULL,
        [UNUSUAL_ITEM_DESCRIPTION] varchar(200) NULL,
        [EXTRA_CLEANUP] char(3) NOT NULL,
        [COMMENT] varchar(500) NULL,
        PRIMARY KEY NONCLUSTERED (PICKUP_ID)
    );
END;

IF OBJECT_ID('PICKUP_SCHEDULE', 'U') IS NULL
BEGIN;
    CREATE TABLE [PICKUP_SCHEDULE]
    (
        [PICKUP_SCHEDULE_ID] int IDENTITY(1,1),
        [AGREEMENT_ID] int NOT NULL,
        [TYPE] varchar(20) NOT NULL,
        [SCHEDULED_PICKUP_YEAR_MONTH] varchar(10) NOT NULL,
        [SCHEDULED_PICKUP_DATE] datetime NULL,
        [ESTIMATED_BAG_QUANTITY] varchar(20) NULL,
        [ESTIMATED_VEST_QUANTITY] varchar(20) NULL,
        PRIMARY KEY NONCLUSTERED (PICKUP_SCHEDULE_ID)
    );
END;

IF OBJECT_ID('ROLE', 'U') IS NULL
BEGIN;
    CREATE TABLE [ROLE]
    (
        [ROLE_ID] int IDENTITY(1,1),
        [USER_ID] int NOT NULL,
        [ORGANIZATION_ID] int NOT NULL,
        [TYPE] varchar(30) NOT NULL,
        [START_DATE] date CONSTRAINT [DF__ROLE__START_DATE__4222D4EF] DEFAULT (getdate()) NOT NULL,
        [END_DATE] date NULL,
        PRIMARY KEY NONCLUSTERED (ROLE_ID)
    );
END;

IF OBJECT_ID('SEGMENT', 'U') IS NULL
BEGIN;
    CREATE TABLE [SEGMENT]
    (
        [SEGMENT_ID] int IDENTITY(1,1),
        [MAINTENANCE_SECTION_ID] int NOT NULL,
        [STATUS] varchar(50) NOT NULL,
        [STATUS_REASON] varchar(20) NULL,
        [ROAD_NAME] varchar(100) NULL,
        [LENGTH] numeric(4, 2) NOT NULL,
        [FROM_TO_DESCRIPTION] varchar(500) NOT NULL,
        [ROUTE_PREFIX] char(2) NOT NULL,
        [ROUTE_NUMBER] char(4) NOT NULL,
        [SUFFIX_NAME] varchar(50) NULL,
        [ACREAGE_MEASURE] numeric(5, 2) NULL,
        [PICKUP_CYCLE] int NULL,
        [BASE_SIGN] char(10) NULL,
        [FROM_LATTITUDE] numeric(11, 8) NOT NULL,
        [FROM_LONGITUDE] numeric(11, 8) NOT NULL,
        [TO_LATTITUDE] numeric(11, 8) NOT NULL,
        [TO_LONGITUDE] numeric(11, 8) NOT NULL,
        [COMMENT] varchar(500) NULL,
        PRIMARY KEY NONCLUSTERED (SEGMENT_ID)
    );
END;

IF OBJECT_ID('SIGN', 'U') IS NULL
BEGIN;
    CREATE TABLE [SIGN]
    (
        [SIGN_ID] int IDENTITY(1,1),
        [AGREEMENT_ID] int NOT NULL,
        [TYPE] varchar(20) NULL,
        [LINE_1] char(13) NULL,
        [LINE_2] char(13) NULL,
        [LINE_3] char(13) NULL,
        [LINE_4] char(13) NULL,
        [COMMENT] varchar(500) NULL,
        PRIMARY KEY NONCLUSTERED (SIGN_ID)
    );
END;

IF OBJECT_ID('SIGN_STATUS', 'U') IS NULL
BEGIN;
    CREATE TABLE [SIGN_STATUS]
    (
        [SIGN_STATUS_ID] int NOT NULL,
        [SIGN_ID] int NOT NULL,
        [STATUS] varchar(100) NOT NULL,
        [BEGIN_DATE] datetime NOT NULL,
        [COMPLETION_DATE] datetime NULL,
        [COMMENT] varchar(500) NULL,
        PRIMARY KEY NONCLUSTERED (SIGN_STATUS_ID)
    );
END;

IF OBJECT_ID('TABLE_NAME', 'U') IS NULL
BEGIN;
    CREATE TABLE [TABLE_NAME]
    (
        [TABLE_ID] int IDENTITY(1,1),
        [NAME] varchar(30) NOT NULL,
        PRIMARY KEY NONCLUSTERED (TABLE_ID)
    );
END;

IF OBJECT_ID('TRANSACTION_LOG', 'U') IS NULL
BEGIN;
    CREATE TABLE [TRANSACTION_LOG]
    (
        [LOG_ID] int IDENTITY(1,1),
        [USERNAME] varchar(255) NOT NULL,
        [DATE] datetime NOT NULL,
        [TABLE_NAME] varchar(30) NULL,
        [TABLE_ID] int NULL,
        [ACTION] char(10) NULL,
        [DESCRIPTION] varchar(1000) NOT NULL,
        PRIMARY KEY NONCLUSTERED (LOG_ID)
    );
END;

IF OBJECT_ID('TXDOT', 'U') IS NULL
BEGIN;
    CREATE TABLE [TXDOT]
    (
        [TXDOT_ID] int IDENTITY(1,1),
        [ORGANIZATION_ID] int NOT NULL,
        [SECTION_NAME] varchar(20) NULL,
        PRIMARY KEY NONCLUSTERED (TXDOT_ID)
    );
END;

IF OBJECT_ID('USER_PERSON', 'U') IS NULL
BEGIN;
    CREATE TABLE [USER_PERSON]
    (
        [USER_ID] int IDENTITY(1,1),
        [USERNAME] varchar(100) NULL,
        [FULL_NAME] varchar(120) NULL,
        [PREFIX] varchar(30) NULL,
        [FIRST_NAME] varchar(30) NULL,
        [MIDDLE_NAME] varchar(30) NULL,
        [LAST_NAME] varchar(30) NULL,
        [SUFFIX] varchar(30) NULL,
        [TITLE] varchar(30) NULL,
        [PREFERRED_NAME] varchar(100) NULL,
        [COMMENT] varchar(500) NULL,
        PRIMARY KEY NONCLUSTERED ([USER_ID])
    );
END;

IF OBJECT_ID('VALUE', 'U') IS NULL
BEGIN;
    CREATE TABLE [VALUE]
    (
        [VALUE_ID] int IDENTITY(1,1),
        [COLUMN_ID] int NOT NULL,
        [VALID_VALUE] varchar(50) NOT NULL,
        [DESCRIPTION] varchar(500) NULL,
        [ACTIVE] char(3) NULL,
        PRIMARY KEY NONCLUSTERED (VALUE_ID)
    );
END;

IF OBJECT_ID('VALUE_RELATIONSHIP', 'U') IS NULL
BEGIN;
    CREATE TABLE [VALUE_RELATIONSHIP]
    (
        [RELATIONSHIP_ID] int IDENTITY(1,1),
        [VALUE_ID] int NOT NULL,
        [RELATED_VALUE_ID] int NOT NULL,
        PRIMARY KEY NONCLUSTERED (RELATIONSHIP_ID)
    );
END