/* Replace with your SQL commands *//* Replace with your SQL commands *//**
Adds the email field for applications 
*/

IF (OBJECT_ID('APPLICATIONS') IS NULL)
BEGIN;
    THROW 51000, 'APPLICATIONS table does not exist', 1;
END;

ALTER TABLE [APPLICATIONS] ADD EMAIL VARCHAR(255) NULL;