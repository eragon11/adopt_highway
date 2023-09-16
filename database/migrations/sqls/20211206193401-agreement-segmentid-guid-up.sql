/*
Changes the AGREEMENT table schema to use SEGMENT_ID as a uniqueidentifier column.
and replaces the AGREEMENT.SEGMENT_ID data with GUID from the gis.AAH_GIS_SEGMENTS.GlobalID field

Exit early if AGREEMENT is already of datatype uniqueidentifier
Exit if AAH_GIS_SEGMENTS is missing -- will only happen locally
Rename current AGREEMENT table to AGREEMENT_BACKUP
Create the new AGREEMENT table with a GUID for Segment ID.
Insert only NOT NULL fields from backup to new AGREEMENT table
Update data from backups with new GUID for SegmentID data
*/

-- exit early if datatype is already a GUID on AGREEMENT.SEGMENT_ID
IF EXISTS(SELECT C.NAME AS COLUMN_NAME,
    TYPE_NAME(C.USER_TYPE_ID) AS DATA_TYPE,
    C.IS_NULLABLE,
    C.MAX_LENGTH,
    C.PRECISION,
    C.SCALE
FROM SYS.COLUMNS C
    JOIN SYS.TYPES T
    ON C.USER_TYPE_ID=T.USER_TYPE_ID
WHERE C.OBJECT_ID=OBJECT_ID('AGREEMENT') AND C.NAME = 'SEGMENT_ID'
    AND TYPE_NAME(C.user_type_id) = 'nvarchar')
    BEGIN
    PRINT 'aah.AGREEMENT already converted to nvarchar';
    RETURN;
END

IF (NOT EXISTS(SELECT T.NAME AS TABLE_NAME
FROM SYS.TABLES T
    INNER JOIN SYS.schemas S on s.schema_id = t.schema_id
WHERE T.NAME = 'AAH_GIS_SEGMENTS' AND s.name = 'gis'))
	throw 51000, 'gis.AAH_GIS_SEGMENTS is missing', 1

-- rename the current agreements table to backup
IF OBJECT_ID('aah.AGREEMENT') IS NOT NULL AND OBJECT_ID('aah.AGREEMENT_BACKUP') IS NULL
BEGIN
    PRINT 'Moving AGREEMENT to AGREEMENT_BACKUP'
    exec sp_rename 'AGREEMENT', 'AGREEMENT_BACKUP';
END

-- create the agreement table with a GUID for Segment ID. Make NULL temporarily
PRINT 'Recreating AGREEMENT with new SEGMENT_ID'
exec sp_executesql N'
    IF OBJECT_ID(''aah.AGREEMENT'') IS NULL
    BEGIN
    CREATE TABLE [AGREEMENT](
        [AGREEMENT_ID] [int] IDENTITY(1,1) NOT NULL,
        [GROUP_ID] [int] NOT NULL,
        [SEGMENT_ID] [nvarchar](500) NULL,
        [STATUS] [nvarchar](20) NULL,
        [BEGIN_DATE] [datetime2](7) NULL,
        [END_DATE] [datetime2](7) NULL,
        [COMMENT] [nvarchar](500) NULL,
    PRIMARY KEY NONCLUSTERED
    (
        [AGREEMENT_ID] ASC
    )
    ) ON [PRIMARY]
    END';

-- migrate and transform our data
SET IDENTITY_INSERT AGREEMENT OFF;
SET IDENTITY_INSERT AGREEMENT ON;
INSERT INTO [AGREEMENT]
    ([AGREEMENT_ID]
    ,[GROUP_ID]
    , [SEGMENT_ID]
    , [STATUS]
    , [BEGIN_DATE]
    , [END_DATE]
    )
SELECT
    bu.[AGREEMENT_ID]
    , bu.[GROUP_ID], bu.[SEGMENT_ID]
    , bu.[STATUS]
    , bu.[BEGIN_DATE]
    , bu.[END_DATE]
FROM
    AGREEMENT_BACKUP bu
    LEFT JOIN AGREEMENT a1 on bu.AGREEMENT_ID = a1.AGREEMENT_ID
WHERE
        a1.AGREEMENT_ID IS NULL;

SET IDENTITY_INSERT AGREEMENT OFF;

-- update our columns - use new GUID, and fallback to AAH_SEGMENT_ID when it is not found
UPDATE a1
    SET
        [SEGMENT_ID] = s.[GlobalID]
    FROM
    AGREEMENT a1
    INNER JOIN AGREEMENT_BACKUP bu on bu.AGREEMENT_ID = a1.AGREEMENT_ID
    INNER JOIN gis.AAH_GIS_SEGMENTS s ON bu.SEGMENT_ID = s.AAH_SEGMENT_ID

-- our test is that our AGREEMENT AND BACKUP table have the same number of records
DECLARE @oldCount AS INT, @newCount AS INT;
DECLARE @errMessage NVARCHAR(200);

SELECT @newCount = COUNT(*)
FROM AGREEMENT;
SELECT @oldCount = COUNT(*)
FROM AGREEMENT_BACKUP;
SELECT @errMessage = CONCAT('AGREEMENT_BACKUP AND BACKUP table counts did not match: AGREEMENT (', @newCount, '), AGREEMENT_BACKUP(', @oldCount,')')

IF @newCount <> @oldCount
    THROW 51000, @errMessage,  1

PRINT 'Agreements converted successfully'

IF OBJECT_ID('aah.AGREEMENT_BACKUP') IS NOT NULL
        DROP TABLE AGREEMENT_BACKUP;
