CREATE
OR ALTER PROC aah_insert_missing_districts
AS
BEGIN;
    SET NOCOUNT ON;
    -- inserts missing districts and counties
    DECLARE @district TABLE (
        [CODE] NVARCHAR(255) NOT NULL,
        [NAME] NVARCHAR(255) NOT NULL,
        [ORGANIZATION_ID] INT NULL
    );
    INSERT INTO @district
        ([CODE], [NAME])
    VALUES
        ('ABL', 'Abilene'),
        ('AMA', 'Amarillo'),
        ('ATL', 'Atlanta'),
        ('AUS', 'Austin'),
        ('BMT', 'Beaumont'),
        ('BWD', 'Brownwood'),
        ('BRY', 'Bryan'),
        ('CHS', 'Childress'),
        ('CRP', 'Corpus Christi'),
        ('ELP', 'El Paso'),
        ('DAL', 'Dallas'),
        ('FTW', 'Fort Worth'),
        ('HOU', 'Houston'),
        ('LRD', 'Laredo'),
        ('LBB', 'Lubbock'),
        ('LFK', 'Lufkin'),
        ('ODA', 'Odessa'),
        ('PAR', 'Paris'),
        ('PHR', 'Pharr'),
        ('SJT', 'San Angelo'),
        ('SAT', 'San Antonio'),
        ('TYL', 'Tyler'),
        ('WAC', 'Waco'),
        ('WFS', 'Wichita Falls'),
        ('YKM', 'Yoakum');
    DECLARE @code NVARCHAR(500),
    @ms_number NVARCHAR(500);
    DECLARE district_cursor CURSOR FOR
SELECT [CODE]
    FROM @district
    ORDER BY [CODE];
    OPEN district_cursor
    FETCH NEXT
FROM district_cursor INTO @code;
    WHILE @@FETCH_STATUS = 0
    BEGIN;
        INSERT INTO ORGANIZATION
            ([TYPE])
        VALUES
            ('District');
        UPDATE @district
SET ORGANIZATION_ID = SCOPE_IDENTITY()
WHERE [CODE] = @code;
        FETCH NEXT
FROM district_cursor INTO @code;
    END;
    close district_cursor;
    deallocate district_cursor;
    -- insert into district
    INSERT INTO DISTRICT
        ([CODE], [NAME], [ORGANIZATION_ID])
    SELECT c.[CODE],
        c.[NAME],
        c.[ORGANIZATION_ID]
    FROM @DISTRICT c
        LEFT JOIN DISTRICT c1 on c.[CODE] = c1.[CODE]
    WHERE c1.[CODE] IS NULL;
    SET NOCOUNT OFF;
END;
