CREATE
    OR ALTER PROCEDURE convert_aah_data
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
    SET NOCOUNT OFF;
END;