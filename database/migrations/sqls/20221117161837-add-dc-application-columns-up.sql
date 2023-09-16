-- AGREEMENT_START_DATE AS DATETIME2

--
-- Add a new agreement start date column
--
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'AGREEMENT_START_DATE')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD AGREEMENT_START_DATE DATETIME2 NULL;
END

-- AGREEMENT_END_DATE AS DATETIME2

--
-- Add a new agreement end date column
--
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'AGREEMENT_END_DATE')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD AGREEMENT_END_DATE DATETIME2 NULL;
END

-- LENGTH_OF_ADOPTED_SECTION AS DECIMAL

IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'LENGTH_OF_ADOPTED_SECTION')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD LENGTH_OF_ADOPTED_SECTION DECIMAL NULL;
END

-- CLEANING_CYCLE_OF_ADOPTED_SECTION AS INT

IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'CLEANING_CYCLE_OF_ADOPTED_SECTION')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD CLEANING_CYCLE_OF_ADOPTED_SECTION INT NULL;
END

-- TXDOT_CONTACT_FULL_NAME AS NVARCHAR(255)
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'TXDOT_CONTACT_FULL_NAME')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD TXDOT_CONTACT_FULL_NAME NVARCHAR(255) NULL;
END

-- TXDOT_CONTACT_PHONE_NUMBER AS NVARCHAR(20)

IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'TXDOT_CONTACT_PHONE_NUMBER')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD TXDOT_CONTACT_PHONE_NUMBER NVARCHAR(20) NULL;
END


-- REQUIRED_PICKUPS_PER_YEAR AS INT

IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'REQUIRED_PICKUPS_PER_YEAR')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD REQUIRED_PICKUPS_PER_YEAR INT NULL;
END

--
-- Add a new pickups per year column
--
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'REQUIRED_PICKUPS_PER_YEAR')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD REQUIRED_PICKUPS_PER_YEAR INT NULL;
END

-- PICKUPS_START_DATE AS DATETIME2

--
-- Add a new pickups start date column
--
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'PICKUPS_START_DATE')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD PICKUPS_START_DATE DATETIME2 NULL;
END


-- PICKUPS_END_DATE AS DATETIME2

--
-- Add a new pickups end date column
--
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'PICKUPS_END_DATE')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD PICKUPS_END_DATE DATETIME2 NULL;
END

-- FIRST_SCHEDULED_PICKUP AS DATETIME2

--
-- Add a new first schedule pickups date column
--
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'FIRST_SCHEDULED_PICKUP')
BEGIN
    ALTER TABLE [APPLICATIONS] ADD FIRST_SCHEDULED_PICKUP DATETIME2 NULL;
END
