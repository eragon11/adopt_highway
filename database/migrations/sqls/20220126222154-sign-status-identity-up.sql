SET NOCOUNT ON;

IF (SELECT OBJECTPROPERTY(OBJECT_ID('SIGN_STATUS'), 'TableHasIdentity')) = 0
BEGIN;
	CREATE TABLE [SIGN_STATUS_SWITCH](
		[SIGN_STATUS_ID] [int] NOT NULL IDENTITY(1, 1) PRIMARY KEY,
		[SIGN_ID] [int] NOT NULL,
		[STATUS] [varchar](100) NOT NULL,
		[BEGIN_DATE] [datetime2](7) NULL,
		[COMPLETION_DATE] [datetime2](7) NULL,
		[COMMENT] [varchar](500) NULL);
	
	SET IDENTITY_INSERT SIGN_STATUS_SWITCH ON;
	INSERT INTO SIGN_STATUS_SWITCH ([SIGN_STATUS_ID], [SIGN_ID], [STATUS], [BEGIN_DATE], [COMPLETION_DATE], [COMMENT])
	SELECT [SIGN_STATUS_ID], [SIGN_ID], [STATUS], [BEGIN_DATE], [COMPLETION_DATE], [COMMENT] 
	FROM SIGN_STATUS;
	SET IDENTITY_INSERT SIGN_STATUS_SWITCH OFF;
	DROP TABLE SIGN_STATUS;
    PRINT 'Moving SIGN_STATUS to SIGN_STATUS_SWITCH'
    EXEC sp_rename 'SIGN_STATUS_SWITCH', 'SIGN_STATUS';
END;
