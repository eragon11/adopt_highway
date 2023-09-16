IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'APPLICATIONS' AND c.name = 'MULESOFT_STATUS')
BEGIN
    ALTER TABLE APPLICATIONS ADD
	MULESOFT_STATUS varchar(100) NULL
END

DROP INDEX IF EXISTS [UIDX_GROUP_CONTACTS] ON [aah].[GROUP_CONTACTS];

CREATE UNIQUE NONCLUSTERED INDEX [UIDX_GROUP_CONTACTS] ON [aah].[GROUP_CONTACTS]
(
	[GROUP_ID] ASC,
	[USER_ID] ASC,
	[IS_PRIMARY_CONTACT] ASC
)
