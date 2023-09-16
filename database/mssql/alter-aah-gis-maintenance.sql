IF LOWER('$(ENVIRONMENT)') = 'local'
    PRINT 'Environment is $(ENVIRONMENT)'
    USE aah;

    BEGIN
        IF COL_LENGTH('gis.AAH_GIS_MAINTENANCE_SECTIONS', 'ORGANIZATION_ID') IS NOT NULL
        BEGIN
            PRINT 'Updating [gis].[GIS_MAINTENANCE_SECTIONS] with ORGANIZATION_ID';
            DECLARE @AAH_GIS_MAINTENANCE_SECTIONS TABLE (
                [ORGANIZATION_ID] [int] NULL
            );
            
            UPDATE gms
            SET 
            ORGANIZATION_ID = ams.ORGANIZATION_ID
            FROM [gis].[AAH_GIS_MAINTENANCE_SECTIONS] gms
            LEFT JOIN [gis].[AAH_GIS_DISTRICTS] gd ON gms.DIST_ABRVN_NM = gd.DIST_ABRVN
            LEFT JOIN [aah].[DISTRICT] ad ON ad.CODE = gd.DIST_ABRVN
            LEFT JOIN [aah].[MAINTENANCE_SECTION] ams on ad.DISTRICT_ID = ams.DISTRICT_ID and gms.MNT_SEC_NBR = ams.NUMBER;
        END;
    END;