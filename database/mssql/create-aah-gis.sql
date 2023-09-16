PRINT 'Environment is $(ENVIRONMENT)'

IF LOWER('$(ENVIRONMENT)') <> 'local'
    RETURN

IF ((SELECT OBJECT_ID('gis.AAH_GIS_DISTRICTS')) IS NULL)
BEGIN
    CREATE TABLE [gis].[AAH_GIS_DISTRICTS]
    (
        [OBJECTID] [int] NOT NULL,
        [DIST_ABRVN] [nvarchar](3) NULL,
        [DIST_NBR] [int] NULL,
        [DIST_NM] [nvarchar](20) NULL,
        [Shape__Area] [numeric](38, 8) NULL,
        [Shape__Length] [numeric](38, 8) NULL,
        [SHAPE] [geometry] NULL,
        [GDB_GEOMATTR_DATA] [varbinary](max) NULL,
    );

    PRINT 'Added [gis].[AAH_GIS_DISTRICTS]';
END;

IF ((SELECT OBJECT_ID('gis.AAH_GIS_MAINTENANCE_SECTIONS')) IS NULL)
BEGIN
    CREATE TABLE [gis].[AAH_GIS_MAINTENANCE_SECTIONS]
    (
        [OBJECTID] [int] NOT NULL,
        [ORGANIZATION_ID] [smallint] NULL,
        [OFFICE_NM] [nvarchar] (50) NULL,
        [MNT_SEC_NBR] [smallint] NULL,
        [DIST_NM] [nvarchar] (35) NULL,
        [DIST_NBR] [smallint] NULL,
        [DIST_ABRVN_NM] [nvarchar] (3) NULL,
        [CREATE_USE] [nvarchar] (30) NULL,
        [CREATE_DT] [nvarchar] (25) NULL,
        [EDIT_NM] [nvarchar] (25) NULL,
        [EDIT_DT] [nvarchar] (25) NULL,
        [CMNT] [nvarchar] (200) NULL,
        [SHAPE] [geometry] NULL,
        [GDB_GEOMATTR_DATA] [varbinary] (max) NULL,
    )
    PRINT 'Added [gis].[AAH_GIS_MAINTENANCE_SECTIONS]';
END;

IF ((SELECT OBJECT_ID('gis.AAH_GIS_SEGMENTS')) IS NULL)
BEGIN
    CREATE TABLE [gis].[AAH_GIS_SEGMENTS]
    (
        OBJECTID int NOT NULL PRIMARY KEY,
        AAH_SEGMENT_ID int NULL,
        SEGMENT_STATUS nvarchar(50) NULL,
        FROM_TO_DESC nvarchar(200) NULL,
        SEGMENT_LENGTH_MILES numeric(38,8) NULL,
        AAH_ROUTE_NAME nvarchar(50) NULL,
        DIST_NM nvarchar(20) NULL,
        DIST_ABRVN nvarchar(3) NULL,
        DIST_NBR int NULL,
        CNTY_NM nvarchar(20) NULL,
        CNTY_NBR int NULL,
        MNT_OFFICE_NM nvarchar(50) NULL,
        MNT_SEC_NBR smallint NULL,
        CREATED_BY nvarchar(50) NULL,
        CREATED_ON datetime2 NULL,
        UPDATED_BY nvarchar(50) NULL,
        UPDATED_ON datetime2 NULL,
        SEGMENT_PREFIX nvarchar(3) NULL,
        SEGMENT_RTE_NUMBER nvarchar(10) NULL,
        SEGMENT_SUFFIX nvarchar(5) NULL,
        SEGMENT_ROADBED nvarchar(50) NULL,
        SEGMENT_BOUNDS nvarchar(100) NULL,
        SEGMENT_FROM_LAT numeric(38,8) NULL,
        SEGMENT_FROM_LONG numeric(38,8) NULL,
        SEGMENT_TO_LAT numeric(38,8) NULL,
        SEGMENT_TO_LONG numeric(38,8) NULL,
        REF_MARKER_FROM nvarchar(5) NULL,
        REF_MARKER_TO nvarchar(5) NULL,
        BEGIN_DFO numeric(38,8) NULL,
        END_DFO numeric(38,8) NULL,
        GROUP_NAME nvarchar(1000) NULL,
        UNAVAILABLE_REASON_FIELD nvarchar(100) NULL,
        DEACTIVATED_REASON_FIELD nvarchar(100) NULL,
        MAINTAINANCE_OFFICER_EMAIL nvarchar(100) NULL,
        DISTRICT_COORDINATOR_EMAIL nvarchar(100) NULL,
        DEACTIVATE_OTHER nvarchar(100) NULL,
        UNAVAILABLE_OTHER nvarchar(100) NULL,
        REACTIVATE_OTHER nvarchar(100) NULL,
        TXDOT_ROUTE_NAME nvarchar(17) NULL,
        ORGANIZATION_ID int NULL,
        GlobalID uniqueidentifier NOT NULL,
        Shape geometry NULL,
        GDB_GEOMATTR_DATA varbinary(MAX) NULL
    );
    PRINT 'Added [gis].[AAH_GIS_SEGMENTS]';
END;

IF ((SELECT OBJECT_ID('gis.AAH_GIS_COUNTIES')) IS NULL)
BEGIN
    CREATE TABLE gis.AAH_GIS_COUNTIES
    (
        OBJECTID int NOT NULL PRIMARY KEY,
        CMPTRL_CNTY_NBR int NULL,
        CNTY_NM nvarchar(20) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
        DPS_CNTY_NBR int NULL,
        FIPS_ST_CNTY_CD nvarchar(5) COLLATE SQL_Latin1_General_CP1_CI_AS NULL,
        TXDOT_CNTY_NBR int NULL,
        TXDOT_DIST_NBR int NULL,
        GID int NOT NULL,
        Shape__Area numeric(38,8) NULL,
        Shape__Length numeric(38,8) NULL,
        SHAPE geometry NULL,
        GDB_GEOMATTR_DATA varbinary(MAX) NULL,
    );
    PRINT 'Added [gis].[AAH_GIS_COUNTIES]';
END;
