--
-- Adds a primary key for the GROUP_CONTACTS table
--
IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'GROUP_CONTACTS' AND c.name = 'GROUP_CONTACT_ID')
    BEGIN
    DECLARE @GroupContact TABLE (
        [GROUP_ID] [int] NOT NULL,
        [USER_ID] [int] NOT NULL,
        [IS_PRIMARY_CONTACT] [bit] NOT NULL
        );

    INSERT INTO @GroupContact
    SELECT [GROUP_ID], [USER_ID], [IS_PRIMARY_CONTACT]
    FROM GROUP_CONTACTS;

    DROP TABLE [GROUP_CONTACTS];

    CREATE TABLE [GROUP_CONTACTS]
    (
        [GROUP_CONTACT_ID] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
        [GROUP_ID] [int] NOT NULL,
        [USER_ID] [int] NOT NULL,
        [IS_PRIMARY_CONTACT] [bit] NOT NULL
    );

    ALTER TABLE [GROUP_CONTACTS]  WITH CHECK ADD FOREIGN KEY([GROUP_ID])
        REFERENCES [GROUP_SPONSOR] ([GROUP_ID]);

    ALTER TABLE [GROUP_CONTACTS]  WITH CHECK ADD FOREIGN KEY([USER_ID])
        REFERENCES [USER_PERSON] ([USER_ID]);

    CREATE UNIQUE INDEX [UIDX_GROUP_CONTACTS] ON [GROUP_CONTACTS] ([GROUP_ID], [USER_ID]);

    INSERT GROUP_CONTACTS
        ([GROUP_ID], [USER_ID], [IS_PRIMARY_CONTACT])
    SELECT DISTINCT [GROUP_ID], [USER_ID], COALESCE([IS_PRIMARY_CONTACT], 0)
    FROM @GroupContact;
END;