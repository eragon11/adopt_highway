/*
Restore the original [aah_insert_missing_group_sponsors] sproc
*/


CREATE OR ALTER
  PROCEDURE [aah_insert_missing_group_sponsors]
AS
BEGIN;
    SET NOCOUNT ON;
    DECLARE @group_sponsor TABLE (
        [GROUP_ID] [int] NULL,
        [ORGANIZATION_ID] [int] NULL,
        [TYPE] [varchar](30) NULL,
        [NAME] [varchar](200) NULL,
        [ESTIMATED_VOLUNTEER_COUNT] [int] NULL,
        [APPLICATION_SEND_DATE] [datetime2](7) NULL,
        [INITIAL_CONTACT_DATE] [datetime2](7) NULL,
        [COMMENT] [varchar](500) NULL,
        [COUNTY_ID] [int] NULL
    );
    INSERT INTO @group_sponsor
        (
        [GROUP_ID],
        [NAME],
        [TYPE],
        [COUNTY_ID],
        [ESTIMATED_VOLUNTEER_COUNT],
        [APPLICATION_SEND_DATE],
        [INITIAL_CONTACT_DATE],
        [COMMENT]
        )
    SELECT t1.[AAH_GRP_ID],
        t1.[AAH_GRP_NM],
        t1.[AAH_GRP_TYPE_NM],
        c.[COUNTY_ID],
        t1.[AAH_GRP_ESTMTD_VOLR_QTY],
        t1.[AAH_GRP_APPLN_SEND_DT],
        t1.[AAH_GRP_INIT_CNTCT_DT],
        t1.[AAH_GRP_CMNT]
    FROM aah_legacy..[AAH_GRP] t1
        INNER JOIN COUNTY c on FORMAT(t1.[TXDOT_CNTY_NBR], '00#') = c.[CODE];

    -- FIX THE COUNTY THAT ISN'T CORRECT
    UPDATE @group_sponsor
    SET COUNTY_ID = (SELECT TOP 1
        COUNTY_ID
    FROM COUNTY
    WHERE NAME = 'Fort Bend')
    WHERE [NAME] = 'FOSTER AIR FORCE JUNIOR ROTC' AND COUNTY_ID IS NULL;

    IF ((SELECT COUNT(*)
    FROM @group_sponsor
    WHERE COUNTY_ID IS NULL) > 0)
    BEGIN;
        THROW 51000, 'The AAH_GRP table has missing county values', 1;
    END;

    DECLARE @grp_id INT = 0;
    DECLARE gs_cursor CURSOR FOR
SELECT [GROUP_ID]
    FROM @group_sponsor
    ORDER BY [GROUP_ID];
    OPEN gs_cursor
    FETCH NEXT
FROM gs_cursor INTO @grp_id;
    WHILE @@FETCH_STATUS = 0
    BEGIN;
        INSERT INTO ORGANIZATION
            ([TYPE])
        VALUES
            ('Group');
        UPDATE @group_sponsor
SET ORGANIZATION_ID = SCOPE_IDENTITY()
WHERE [GROUP_ID] = @grp_id;
        FETCH NEXT
FROM gs_cursor INTO @grp_id;
    END;
    close gs_cursor;
    deallocate gs_cursor;
    SET IDENTITY_INSERT [GROUP_SPONSOR] ON;
    INSERT INTO [GROUP_SPONSOR]
        (
        [GROUP_ID],
        [ORGANIZATION_ID],
        [TYPE],
        [NAME],
        [ESTIMATED_VOLUNTEER_COUNT],
        [APPLICATION_SEND_DATE],
        [INITIAL_CONTACT_DATE],
        [COMMENT],
        [COUNTY_ID]
        )
    SELECT gs.GROUP_ID,
        gs.[ORGANIZATION_ID],
        gs.[TYPE],
        gs.[NAME],
        gs.[ESTIMATED_VOLUNTEER_COUNT],
        gs.[APPLICATION_SEND_DATE],
        gs.[INITIAL_CONTACT_DATE],
        gs.[COMMENT],
        gs.[COUNTY_ID]
    FROM @group_sponsor gs
        LEFT JOIN GROUP_SPONSOR t1 ON gs.[GROUP_ID] = t1.[GROUP_ID]
    WHERE t1.GROUP_ID IS NULL;
    SET IDENTITY_INSERT [GROUP_SPONSOR] OFF;
    -- insert into AGREEMENT
    DECLARE @agreement TABLE(
        [AGREEMENT_ID] [int] NOT NULL,
        [GROUP_ID] [int] NOT NULL,
        [SEGMENT_ID] [nvarchar](50) NOT NULL,
        [STATUS] [varchar](20) NULL,
        [BEGIN_DATE] [datetime2](7) NULL,
        [END_DATE] [datetime2](7) NULL,
        [COMMENT] [varchar](500) NULL
    );
    INSERT INTO @agreement
        (
        [AGREEMENT_ID],
        [GROUP_ID],
        [SEGMENT_ID],
        [STATUS],
        [BEGIN_DATE],
        [END_DATE]
        )
    SELECT t1.[AAH_CNTRCT_ID],
        t1.[AAH_GRP_ID],
        t1.[AAH_SGMNT_ID],
        t1.[AAH_CNTRCT_STAT_NM],
        t1.[AAH_CNTRCT_START_DT],
        t1.[AAH_CNTRCT_EXPIR_DT]
    FROM aah_legacy..[AAH_CNTRCT] t1;

    -- update the table variable where we have a GUID
    UPDATE t1
    SET SEGMENT_ID = GlobalID
    FROM @agreement t1
        INNER JOIN gis.[AAH_GIS_SEGMENTS] t2 ON CAST(t1.SEGMENT_ID AS VARCHAR(255)) = t2.AAH_SEGMENT_ID

    SET IDENTITY_INSERT AGREEMENT ON;
    INSERT INTO [AGREEMENT]
        (
        [AGREEMENT_ID],
        [GROUP_ID],
        [SEGMENT_ID],
        [STATUS],
        [BEGIN_DATE],
        [END_DATE]
        )
    SELECT t1.[AGREEMENT_ID],
        t3.[GROUP_ID],
        t1.[SEGMENT_ID],
        t1.[STATUS],
        t1.[BEGIN_DATE],
        t1.[END_DATE]
    FROM @agreement t1
        INNER JOIN @group_sponsor t2 ON t1.GROUP_ID = t2.GROUP_ID
        INNER JOIN GROUP_SPONSOR t3 ON t2.ORGANIZATION_ID = t3.ORGANIZATION_ID
        LEFT JOIN AGREEMENT t4 ON t1.AGREEMENT_ID = t4.AGREEMENT_ID
    WHERE t4.AGREEMENT_ID IS NULL;
    SET IDENTITY_INSERT AGREEMENT OFF;

    -- update the table variable where we have a GUID
    UPDATE t1
    SET SEGMENT_ID = GlobalID
    FROM @agreement t1
        INNER JOIN AGREEMENT t4 ON t1.AGREEMENT_ID = t4.AGREEMENT_ID
        INNER JOIN gis.[AAH_GIS_SEGMENTS] t2 ON CAST(t1.SEGMENT_ID AS VARCHAR(255)) = t2.AAH_SEGMENT_ID

    SET NOCOUNT OFF;
END;
