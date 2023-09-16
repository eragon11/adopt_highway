/*
AH-537 Create the county-maintenance office mappings as a reusable proc.
Re-create all mappings 
*/

CREATE OR ALTER PROC aah_insert_missing_county_mappings
AS 
BEGIN;
SET NOCOUNT ON;

-- create our mapping table inserts
DECLARE @COUNTY_MAINTENANCE_SECTION TABLE (
	CNTY_NBR INT NOT NULL,
	DIST_NBR INT NOT NULL,
	MNT_SEC_NBR INT NOT NULL
);

-- populate with known inserts
INSERT INTO @COUNTY_MAINTENANCE_SECTION(CNTY_NBR, DIST_NBR, MNT_SEC_NBR)
 SELECT DISTINCT 
 ags.CNTY_NBR , ags.DIST_NBR , ags.MNT_SEC_NBR
 FROM gis.AAH_GIS_SEGMENTS ags 
 INNER JOIN gis.AAH_GIS_COUNTIES c ON ags.CNTY_NBR  = c.TXDOT_CNTY_NBR  
 ORDER BY 1, 2, 3

-- The following are manually mapped because they are missing counties
-- The map was used to locate the offices that cover these counties
INSERT INTO @COUNTY_MAINTENANCE_SECTION (CNTY_NBR, DIST_NBR, MNT_SEC_NBR) 
VALUES 
(9, 5, 11),
(9, 5, 10),
(23, 25, 8),
(23, 25, 12),
(36, 20, 1),
(51, 25, 1),
(51, 25, 6),
(63, 25, 3),
(65, 25, 2),
(66, 21, 8),
(79, 25, 11),
(88, 7, 2),
(88, 7, 8),
(97, 25, 1),
(97, 25, 4),
(97, 25, 12),
(100, 25, 7),
(101, 20, 9),
(135, 25, 6),
(135, 25, 5),
(138, 25, 5),
(138, 25, 11),
(146, 20, 5),
(160, 23, 6),
(173, 25, 4),
(206, 23, 8),
(206, 14, 9),
(215, 23, 9),
(242, 25, 9),
(242, 25,10),
(242, 4, 4);



-- First, drop all indexes on our table
DECLARE @sql NVARCHAR(MAX);
SET @sql = N'';

DECLARE cur_sql CURSOR FOR
SELECT N'
  ALTER TABLE ' + QUOTENAME(s.name) + N'.'
  + QUOTENAME(t.name) + N' DROP CONSTRAINT '
  + QUOTENAME(c.name) + ';' as [SQL]
FROM sys.objects AS c
INNER JOIN sys.tables AS t
ON c.parent_object_id = t.[object_id]
INNER JOIN sys.schemas AS s 
ON t.[schema_id] = s.[schema_id]
WHERE c.[type] IN ('D','C','F','PK','UQ')
AND t.name IN ('COUNTY_DISTRICT','COUNTY_MAINTENANCE_SECTION')
ORDER BY c.[type];
OPEN cur_sql 
FETCH NEXT FROM cur_sql INTO @sql;
WHILE @@FETCH_STATUS = 0 BEGIN;
	EXEC sys.sp_executesql @sql;
	FETCH NEXT FROM cur_sql INTO @sql;
END;
CLOSE cur_sql;
DEALLOCATE cur_sql;

-- clear out the mapping table first
DELETE FROM COUNTY_MAINTENANCE_SECTION;
DBCC CHECKIDENT('[COUNTY_MAINTENANCE_SECTION]', RESEED, 0);

-- clear out the mapping tables first
DELETE FROM COUNTY_DISTRICT;
DBCC CHECKIDENT('[COUNTY_DISTRICT]', RESEED, 0);

-- re-insert our county maintenance section maps back
INSERT INTO COUNTY_MAINTENANCE_SECTION(COUNTY_ID, MAINTENANCE_SECTION_ID)
SELECT t3.COUNTY_ID, t2.MAINTENANCE_SECTION_ID
FROM @COUNTY_MAINTENANCE_SECTION t1 
INNER JOIN MAINTENANCE_SECTION t2 ON t1.DIST_NBR = t2.DISTRICT_NUMBER AND t1.MNT_SEC_NBR = t2.NUMBER
INNER JOIN COUNTY t3 ON t1.CNTY_NBR = t3.NUMBER
LEFT JOIN COUNTY_MAINTENANCE_SECTION t4 ON t3.COUNTY_ID = t4.COUNTY_ID AND t2.MAINTENANCE_SECTION_ID = t4.MAINTENANCE_SECTION_ID
WHERE t4.COUNTY_MAINTENANCE_SECTION_ID IS NULL;

-- re-insert our county maintenance section maps back
INSERT INTO COUNTY_DISTRICT(COUNTY_ID, DISTRICT_ID)
SELECT DISTINCT t3.COUNTY_ID, t2.DISTRICT_ID
FROM @COUNTY_MAINTENANCE_SECTION t1 
INNER JOIN MAINTENANCE_SECTION t2 ON t1.DIST_NBR = t2.DISTRICT_NUMBER AND t1.MNT_SEC_NBR = t2.NUMBER
INNER JOIN COUNTY t3 ON t1.CNTY_NBR = t3.NUMBER
LEFT JOIN COUNTY_DISTRICT t4 ON t3.COUNTY_ID = t4.COUNTY_ID AND t2.DISTRICT_ID = t4.DISTRICT_ID
WHERE t4.COUNTY_DISTRICT_ID IS NULL;

SET NOCOUNT OFF;
END;

SET NOCOUNT ON;
EXEC aah_insert_missing_county_mappings;
SET NOCOUNT OFF;
