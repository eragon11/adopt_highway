/* 
We discovered issues with legacy data
If you sort on the county number, Kenedy county was in the Ds.
This task is to use the aah.gis.AAH_GIS_COUNTIES to update your county NUMBER values
 */
 
-- update counties
UPDATE t2
SET 
[NAME] = t1.[CNTY_NM],
[NUMBER] = t1.[TXDOT_CNTY_NBR]
FROM [gis].[AAH_GIS_COUNTIES] t1
LEFT JOIN COUNTY t2 on t1.DPS_CNTY_NBR = t2.COUNTY_ID
