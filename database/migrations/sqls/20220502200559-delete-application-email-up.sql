/* Replace with your SQL commands *//**
Adds email and county fields for applications to match PDF application form
*/

IF (OBJECT_ID('APPLICATIONS') IS NULL)
BEGIN;
    THROW 51000, 'APPLICATIONS table does not exist', 1;
END;

ALTER TABLE [APPLICATIONS] DROP COLUMN [EMAIL];