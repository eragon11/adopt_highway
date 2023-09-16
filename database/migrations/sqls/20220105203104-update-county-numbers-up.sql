DECLARE @county TABLE (
    [COUNTY_ID] [int] NULL,
    [CODE] [char](3) NULL,
    [NAME] [varchar](30) NULL,
    [NUMBER] [int] NULL);

INSERT INTO @county
    ([COUNTY_ID], [CODE], [NAME], [NUMBER])
SELECT DISTINCT c.COUNTY_ID, c.CODE, c.NAME, s.CNTY_NBR
FROM [COUNTY] c
    INNER JOIN gis.AAH_GIS_SEGMENTS s on c.[COUNTY_ID] = s.[CNTY_NBR];

-- insert missing counties
INSERT INTO @county
    ([COUNTY_ID], [CODE], [NAME])
SELECT c.[COUNTY_ID], c.[CODE], c.[NAME]
FROM COUNTY c
    LEFT JOIN @county c1 ON c.COUNTY_ID = c1.COUNTY_ID
WHERE c1.COUNTY_ID IS NULL;

-- update numbers
UPDATE @county SET NUMBER = COUNTY_ID;

-- update the numbers
UPDATE t1
SET [NUMBER] = t2.[NUMBER]
FROM COUNTY t1
    INNER JOIN @county t2 on t1.[COUNTY_ID] = t2.[COUNTY_ID]

