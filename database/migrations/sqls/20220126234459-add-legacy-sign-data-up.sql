exec sp_executesql @stmt = N'
-- FIRST Add an index on SIGN.AGREEMENT_ID
IF NOT EXISTS(select * from sys.tables as t
inner join sys.columns as c
    on  t.object_id = c.object_id
inner join sys.index_columns as ic 
    on c.column_id = ic.column_id and c.object_id = ic.object_id
inner join sys.indexes as i
    on ic.index_id = i.index_id and ic.object_id = i.object_id
where t.name = ''SIGN'' and c.name = ''AGREEMENT_ID'')
	CREATE INDEX IX_SIGN_AGREEMENT_ID ON SIGN (AGREEMENT_ID);
';


--And add an index on SIGN_STATUS.SIGN_ID
exec sp_executesql @stmt = N'
IF NOT EXISTS(select * from sys.tables as t
inner join sys.columns as c
    on  t.object_id = c.object_id
inner join sys.index_columns as ic 
    on c.column_id = ic.column_id and c.object_id = ic.object_id
inner join sys.indexes as i
    on ic.index_id = i.index_id and ic.object_id = i.object_id
where t.name = ''SIGN_STATUS'' and c.name = ''SIGN_ID'')
	CREATE INDEX IX_SIGN_STATUS_SIGN_ID ON SIGN_STATUS (SIGN_ID);
';

exec sp_executesql @stmt=N'
-- 
-- Adds legacy sign data
-- 
CREATE OR ALTER PROC aah_insert_missing_sign_data
AS
BEGIN
DECLARE @SignEvent TABLE (
	AGREEMENT_ID INT NULL,
    SIGN_NAME VARCHAR(52) NULL,
	CREATED_DT DATETIME2 NULL,
	UPDATED_DT DATETIME2 NULL,
	COMMENT VARCHAR(max) NULL 
);

;WITH cteLatestSign as (SELECT 
a.AGREEMENT_ID
, l.AAH_CNTRCT_EVNT_NM
, LEFT(gs.NAME, 52) as SIGN_NAME
, l.CREATE_DTTM
, l.UPDT_DTTM
, l.AAH_CNTRCT_EVNT_LOG_CMNT
FROM aah_legacy.dbo.AAH_CNTRCT_EVNT_LOG l
INNER JOIN aah_legacy.dbo.AAH_CNTRCT c on l.AAH_CNTRCT_ID = c.AAH_CNTRCT_ID
INNER JOIN aah_legacy.dbo.AAH_GRP g on c.AAH_GRP_ID = g.AAH_GRP_ID
LEFT JOIN AGREEMENT a on c.AAH_CNTRCT_ID = a.AGREEMENT_ID
LEFT JOIN GROUP_SPONSOR gs on a.GROUP_ID = gs.GROUP_ID
WHERE gs.NAME = g.AAH_GRP_NM AND a.AGREEMENT_ID = c.AAH_CNTRCT_ID
AND l.AAH_CNTRCT_EVNT_NM = ''Sign Order'')

-- insert contract groups from old system that match the new system
INSERT INTO @SignEvent(AGREEMENT_ID, SIGN_NAME, CREATED_DT, UPDATED_DT, COMMENT)
SELECT 
l.AGREEMENT_ID, l.SIGN_NAME, l.CREATE_DTTM, l.UPDT_DTTM, l.AAH_CNTRCT_EVNT_LOG_CMNT
FROM cteLatestSign l;


-- insert new records
INSERT INTO SIGN (AGREEMENT_ID, COMMENT, LINE_1, LINE_2, LINE_3, LINE_4, TYPE)
SELECT DISTINCT 
t1.AGREEMENT_ID, t1.COMMENT
, LEFT(t1.SIGN_NAME, 13), SUBSTRING(t1.SIGN_NAME, 13, 13), SUBSTRING(t1.SIGN_NAME, 26, 13), SUBSTRING(t1.SIGN_NAME, 39, 13), ''''
FROM @SignEvent t1
LEFT JOIN SIGN t2 ON t1.AGREEMENT_ID = t2.AGREEMENT_ID
WHERE t2.AGREEMENT_ID IS NULL;

-- update matching existing records
UPDATE t2
SET 
COMMENT = t1.COMMENT, 
LINE_1 = LEFT(t1.SIGN_NAME, 13), 
LINE_2 = SUBSTRING(t1.SIGN_NAME, 14, 13), 
LINE_3 = SUBSTRING(t1.SIGN_NAME, 27, 13), 
LINE_4 = SUBSTRING(t1.SIGN_NAME, 40, 13)
FROM @SignEvent t1
INNER JOIN SIGN t2 ON t1.AGREEMENT_ID = t2.AGREEMENT_ID;

-- add new sign status data
INSERT INTO SIGN_STATUS ([SIGN_ID], [STATUS], BEGIN_DATE, COMPLETION_DATE, COMMENT)
SELECT DISTINCT s1.SIGN_ID, ''Sign Installed'', s.CREATED_DT, s.UPDATED_DT, s.COMMENT
FROM @SignEvent s
INNER JOIN [SIGN] s1 ON s.AGREEMENT_ID = s1.AGREEMENT_ID
LEFT JOIN SIGN_STATUS s2 ON s1.SIGN_ID = s2.SIGN_ID AND s2.STATUS = ''Sign Installed''
WHERE s2.SIGN_STATUS_ID IS NULL;

END;';

exec sp_executesql N'
CREATE OR ALTER
      PROCEDURE [convert_aah_data]
AS
BEGIN;
    SET NOCOUNT ON;
    EXEC aah_insert_missing_districts;
    EXEC aah_insert_missing_counties;
    EXEC aah_insert_missing_maintenance_sections;
    EXEC aah_insert_missing_group_sponsors;
    EXEC aah_insert_missing_users;
    EXEC aah_insert_missing_pickups;
    EXEC aah_insert_missing_documents;
    EXEC aah_insert_missing_sign_data;
    SET NOCOUNT OFF;
END;
';

exec sp_executesql N'EXEC aah_insert_missing_sign_data;';