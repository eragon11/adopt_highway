DECLARE @testComment NVARCHAR(50) = 'SAMPLE DATA TEST COMMENT'
, @mockPending NVARCHAR(50) = 'Sign mock pending'
, @sentToShop NVARCHAR(50) = 'Sent to Shop by the Sign Coordinator'
, @signInstalled NVARCHAR(50) = 'Sign installed';

-- insert new sign records for testing
INSERT INTO [SIGN]
SELECT
    AGREEMENT_ID = a.AGREEMENT_ID,
    [TYPE] = '',
    [LINE_1] = SUBSTRING(gs.NAME, 1, 13),
    [LINE_2] = SUBSTRING(gs.NAME, 14, 13),
    [LINE_3] = SUBSTRING(gs.NAME, 27, 13),
    [LINE_4] = SUBSTRING(gs.NAME, 40, 13),
    [COMMENT] = @testComment
FROM AGREEMENT a
    INNER JOIN GROUP_SPONSOR gs on a.GROUP_ID = gs.GROUP_ID
    INNER JOIN gis.AAH_GIS_SEGMENTS sg ON a.SEGMENT_ID = CAST(sg.GlobalID AS VARCHAR(50))
	LEFT JOIN [SIGN] s ON a.AGREEMENT_ID = s.AGREEMENT_ID
WHERE s.AGREEMENT_ID IS NULL;

-- insert new sign status records for testing
INSERT INTO SIGN_STATUS ([SIGN_ID], [STATUS], [BEGIN_DATE], [COMMENT])
SELECT DISTINCT 
	s.[SIGN_ID]
	, @mockPending AS STATUS
	, DATEADD(dd, (-1 *((ABS(CHECKSUM(NewId())) % 50)+40)), GETDATE()) 
	, @testComment
FROM [SIGN] s
LEFT JOIN SIGN_STATUS t1 ON s.SIGN_ID = t1.SIGN_ID
WHERE t1.SIGN_ID IS NULL;

INSERT INTO SIGN_STATUS ([SIGN_ID], [STATUS], [BEGIN_DATE], [COMMENT])
SELECT DISTINCT 
	s.[SIGN_ID]
	, @sentToShop  AS STATUS
	, DATEADD(dd, ((ABS(CHECKSUM(NewId())) % 14)+5), ss.BEGIN_DATE) 
	, @testComment
FROM [SIGN] s
INNER JOIN [SIGN_STATUS] ss ON s.SIGN_ID = ss.SIGN_ID
WHERE ss.STATUS = @mockPending AND ss.COMMENT = @testComment;

-- the sign mockup phase ended the day before we sent the sign to the shop
UPDATE ss1
SET COMPLETION_DATE = DATEADD(dd, -1, ss2.BEGIN_DATE)
FROM [SIGN] s
INNER JOIN [SIGN_STATUS] ss1 ON s.SIGN_ID = ss1.SIGN_ID AND ss1.STATUS = @mockPending
INNER JOIN [SIGN_STATUS] ss2 ON s.SIGN_ID = ss2.SIGN_ID AND ss2.STATUS = @sentToShop;

-- then we installed the sign starting some random days after starting this new phase
INSERT INTO SIGN_STATUS ([SIGN_ID], [STATUS], [BEGIN_DATE], [COMMENT])
SELECT DISTINCT 
	s.[SIGN_ID]
	, @signInstalled  AS STATUS
	, DATEADD(dd, ((ABS(CHECKSUM(NewId())) % 14)+5), ss.BEGIN_DATE) 
	, @testComment
FROM [SIGN] s
INNER JOIN [SIGN_STATUS] ss ON s.SIGN_ID = ss.SIGN_ID
WHERE ss.STATUS = @sentToShop  AND ss.COMMENT = @testComment;

-- meaning we ended the sign shop phase the day before
UPDATE ss1
SET COMPLETION_DATE = DATEADD(dd, -1, ss2.BEGIN_DATE)
FROM [SIGN] s
INNER JOIN [SIGN_STATUS] ss1 ON s.SIGN_ID = ss1.SIGN_ID AND ss1.STATUS = @sentToShop
INNER JOIN [SIGN_STATUS] ss2 ON s.SIGN_ID = ss2.SIGN_ID AND ss2.STATUS = @signInstalled;

-- finish the installs
UPDATE ss
SET COMPLETION_DATE = DATEADD(dd, ((ABS(CHECKSUM(NewId())) % 14)+5), ss.BEGIN_DATE) 
FROM [SIGN] s
INNER JOIN [SIGN_STATUS] ss ON s.SIGN_ID = ss.SIGN_ID
WHERE ss.STATUS = @signInstalled AND ss.COMMENT = @testComment;