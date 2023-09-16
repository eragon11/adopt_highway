/*
AH-537 
Restore our maintenance section, roles, and county mappings back to the original but with GIS names
*/
SET NOCOUNT ON;

-- reset the sproc
EXEC sp_executesql @stmt=N'
CREATE
OR ALTER PROCEDURE aah_insert_missing_maintenance_sections AS 
BEGIN;
SET NOCOUNT ON;

DECLARE @ms_name NVARCHAR(255),
	@ms_number NVARCHAR(255),
	@ms_district INT;

DECLARE @maintenance_section TABLE (
		[ORGANIZATION_ID] [int] NULL,
		[NAME] [varchar](50) NOT NULL,
		[NUMBER] [int] NULL,
		[DISTRICT_NUMBER] [int] NULL
	);

-- insert legacy data
INSERT INTO @maintenance_section (
		[NAME],
		[NUMBER],
		[DISTRICT_NUMBER]
	)
SELECT DISTINCT 
	(RTRIM(UPPER(ms.[MAINT_SECT_NM]))),
	ms.MAINT_SECT_NBR,
	d.NUMBER
FROM aah_legacy..MAINT_SECT ms
	LEFT JOIN DISTRICT d ON LTRIM(RTRIM(ms.DIST_ABRVN_NM)) = LTRIM(RTRIM(d.CODE));

-- update any existing orgs
UPDATE @maintenance_section
SET ORGANIZATION_ID = t2.ORGANIZATION_ID
FROM @maintenance_section t1
	INNER JOIN MAINTENANCE_SECTION t2 ON LTRIM(RTRIM(UPPER(t1.NAME))) = LTRIM(RTRIM(UPPER(t2.NAME)))
	AND t1.NUMBER = t2.NUMBER
	AND t1.DISTRICT_NUMBER = t2.DISTRICT_NUMBER;

-- insert missing GIS offices
INSERT INTO @maintenance_section (
		[NAME],
		[NUMBER],
		[DISTRICT_NUMBER]
	)
SELECT DISTINCT 
	t1.OFFICE_NM,
	t1.MNT_SEC_NBR,
	t1.DIST_NBR
FROM gis.AAH_GIS_MAINTENANCE_SECTIONS t1
	LEFT JOIN @maintenance_section t2 ON t1.DIST_NBR = t2.DISTRICT_NUMBER AND t1.MNT_SEC_NBR = t2.NUMBER
WHERE t2.NUMBER IS NULL;

-- Update with GIS names
UPDATE t1
SET [NAME] = t2.OFFICE_NM
FROM @maintenance_section t1
INNER JOIN gis.AAH_GIS_MAINTENANCE_SECTIONS t2 ON 
	t2.DIST_NBR = t1.DISTRICT_NUMBER 
	AND t2.MNT_SEC_NBR = t1.NUMBER;

-- Insert any missing organizations
DECLARE ms_cursor CURSOR FOR
SELECT [NAME], [NUMBER], [DISTRICT_NUMBER]
FROM @maintenance_section
WHERE ORGANIZATION_ID IS NULL
ORDER BY [NUMBER];

OPEN ms_cursor FETCH NEXT
FROM ms_cursor INTO @ms_name,
	@ms_number,
	@ms_district;
WHILE @@FETCH_STATUS = 0 BEGIN;
		INSERT INTO ORGANIZATION ([TYPE])
		VALUES (''Maintenance Section'');
		UPDATE @maintenance_section
		SET ORGANIZATION_ID = SCOPE_IDENTITY()
		WHERE [NAME] = @ms_name
			AND [NUMBER] = @ms_number
			AND [DISTRICT_NUMBER] = @ms_district;
	FETCH NEXT FROM ms_cursor INTO 
		@ms_name,
		@ms_number,
		@ms_district;
END;
CLOSE ms_cursor;
DEALLOCATE ms_cursor;

-- insert any new offices
INSERT INTO [MAINTENANCE_SECTION] (
		[ORGANIZATION_ID],
		[NAME],
		[NUMBER],
		[DISTRICT_NUMBER],
		[DISTRICT_ID]
	)
SELECT ms.[ORGANIZATION_ID],
	ms.[NAME],
	ms.[NUMBER],
	ms.[DISTRICT_NUMBER],
	d.DISTRICT_ID
FROM @maintenance_section ms
INNER JOIN DISTRICT d ON ms.DISTRICT_NUMBER = d.NUMBER
LEFT JOIN MAINTENANCE_SECTION t1 ON 
	ms.[NUMBER] = t1.[NUMBER]	
	AND ms.DISTRICT_NUMBER = t1.DISTRICT_NUMBER
WHERE t1.[NUMBER] IS NULL;

-- update all names
UPDATE t1
SET [NAME] = t2.NAME
FROM
MAINTENANCE_SECTION t1
INNER JOIN @maintenance_section t2 ON 
	t1.DISTRICT_NUMBER = t2.DISTRICT_NUMBER AND t1.NUMBER = t2.NUMBER

SET NOCOUNT OFF;
END;
';

-- remove all maintenance section rows and reset the identity
DELETE FROM MAINTENANCE_SECTION;
DBCC CHECKIDENT('[MAINTENANCE_SECTION]', RESEED, 0);

-- re-run our newest aah_insert_missing_maintenance_section with the new data
EXEC aah_insert_missing_maintenance_sections;