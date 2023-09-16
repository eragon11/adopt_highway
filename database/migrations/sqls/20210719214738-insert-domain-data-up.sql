-- insert new tables
DECLARE @new_table_names TABLE (
    [NAME] NVARCHAR(255) NOT NULL
);

INSERT INTO @new_table_names ([NAME])
VALUES('AGREEMENT'),
('DOCUMENT'),
('GROUP_SPONSOR'),
('ORGANIZATION'),
('PICKUP'),
('ROLE'),
('SEGMENT'),
('STATUS'),
('SIGN_STATUS');

INSERT INTO [TABLE_NAME]([NAME])
SELECT ntn.[NAME] FROM @new_table_names ntn
LEFT JOIN [TABLE_NAME] tn ON ntn.NAME = tn.NAME
WHERE tn.NAME IS NULL;

-- insert new columns
DECLARE @new_column_names TABLE (
    [TABLE_NAME] NVARCHAR(255) NOT NULL,
    [COLUMN_NAME] NVARCHAR(255) NOT NULL
);

INSERT INTO @new_column_names ([TABLE_NAME], [COLUMN_NAME])
VALUES('AGREEMENT', 'STATUS'),
('ORGANIZATION', 'TYPE'),
('GROUP_SPONSOR', 'TYPE'),
('SEGMENT', 'STATUS_REASON'),
('SEGMENT', 'ROUTE_PREFIX'),
('SEGMENT', 'STATUS'),
('ROLE', 'TYPE'),
('PICKUP', 'TYPE'),
('DOCUMENT', 'TEMPLATE'),
('SIGN_STATUS', 'STATUS');

INSERT INTO [COLUMN_NAME] ([TABLE_ID], [NAME])
SELECT tn.[TABLE_ID], ncn.[COLUMN_NAME]
FROM @new_column_names ncn
INNER JOIN [TABLE_NAME] tn ON tn.[NAME] = ncn.[TABLE_NAME]
LEFT JOIN [COLUMN_NAME] cn ON ncn.[TABLE_NAME] = tn.[NAME] AND ncn.[COLUMN_NAME] = cn.[NAME]
WHERE cn.[COLUMN_ID] IS NULL;

-- insert into values
DECLARE @new_values TABLE (
    [TABLE_NAME] NVARCHAR(255) NOT NULL,
    [COLUMN_NAME] NVARCHAR(255) NOT NULL,
    [VALID_VALUE] NVARCHAR(255) NOT NULL,
    [DESCRIPTION] NVARCHAR(255) NOT NULL
);

INSERT INTO @new_values ([TABLE_NAME], [COLUMN_NAME], [VALID_VALUE], [DESCRIPTION])
VALUES
('AGREEMENT', 'STATUS', 'Active', 'active agreement'),
('AGREEMENT', 'STATUS', 'Suspended', 'agreement suspended'),
('AGREEMENT', 'STATUS', 'Cancelled', 'cancelled agreement'),
('AGREEMENT', 'STATUS', 'Complete', 'agreement completed'),
('AGREEMENT', 'STATUS', 'Dropped', 'agreement dropped'),
('AGREEMENT', 'STATUS', 'Pending', 'pending approval'),
('AGREEMENT', 'STATUS', 'Renewal', 'renewal pending'),
('DOCUMENT', 'TEMPLATE', 'Active', ''),
('DOCUMENT', 'TEMPLATE', 'Automatic', ''),
('DOCUMENT', 'TEMPLATE', 'Manual', ''),
('DOCUMENT', 'TEMPLATE', 'Obsolete', ''),
('DOCUMENT', 'TEMPLATE', 'Report', ''),
('DOCUMENT', 'TEMPLATE', 'Cancellation Notice', ''),
('GROUP_SPONSOR', 'TYPE', 'BUSINESS', ''),
('GROUP_SPONSOR', 'TYPE', 'CIVIC', ''),
('GROUP_SPONSOR', 'TYPE', 'FAMILY', ''),
('GROUP_SPONSOR', 'TYPE', 'GOVERNMENT', ''),
('GROUP_SPONSOR', 'TYPE', 'OTHER', ''),
('GROUP_SPONSOR', 'TYPE', 'RELIGIOUS', ''),
('GROUP_SPONSOR', 'TYPE', 'SCHOOL', ''),
('GROUP_SPONSOR', 'TYPE', 'SCOUTS', ''),
('ORGANIZATION', 'TYPE', 'Group', ''),
('ORGANIZATION', 'TYPE', 'Maintenance Section', ''),
('ORGANIZATION', 'TYPE', 'District Office', ''),
('ORGANIZATION', 'TYPE', 'TxDOT', ''),
('PICKUP', 'TYPE', 'Fall Sweeps', ''),
('PICKUP', 'TYPE', 'Regular', ''),
('PICKUP', 'TYPE', 'Trash Off', ''),
('ROLE', 'TYPE', 'District Coordinator', ''),
('ROLE', 'TYPE', 'Maintenance Coordinator', ''),
('ROLE', 'TYPE', 'Approver', ''),
('ROLE', 'TYPE', 'Administrator', ''),
('ROLE', 'TYPE', 'Support Team', ''),
('ROLE', 'TYPE', 'Volunteer', ''),
('ROLE', 'TYPE', 'Sign Coordinator', ''),
('ROLE', 'TYPE', 'Maintenance-In-Field', ''),
('SEGMENT', 'ROUTE_PREFIX', 'BF', 'Business FM'), 
('SEGMENT', 'ROUTE_PREFIX', 'BI', 'Business IH'),
('SEGMENT', 'ROUTE_PREFIX', 'BS', 'Business State'),
('SEGMENT', 'ROUTE_PREFIX', 'BU', 'Business US'), 
('SEGMENT', 'ROUTE_PREFIX', 'FM', 'Farm to Market'), 
('SEGMENT', 'ROUTE_PREFIX', 'FS', 'FM Spur'), 
('SEGMENT', 'ROUTE_PREFIX', 'IH', 'Interstate '), 
('SEGMENT', 'ROUTE_PREFIX', 'PA', 'Principal Arterial'), 
('SEGMENT', 'ROUTE_PREFIX', 'PR', 'Park Road'), 
('SEGMENT', 'ROUTE_PREFIX', 'RE', 'Rec Road '), 
('SEGMENT', 'ROUTE_PREFIX', 'RM', 'Ranch to Market'), 
('SEGMENT', 'ROUTE_PREFIX', 'RP', 'Rec Road Spur'), 
('SEGMENT', 'ROUTE_PREFIX', 'RR', 'Ranch Road'), 
('SEGMENT', 'ROUTE_PREFIX', 'RS', 'RM Spur'), 
('SEGMENT', 'ROUTE_PREFIX', 'RU', 'RR Spur'), 
('SEGMENT', 'ROUTE_PREFIX', 'SA', 'State Alternate'), 
('SEGMENT', 'ROUTE_PREFIX', 'SH', 'State Highway'), 
('SEGMENT', 'ROUTE_PREFIX', 'SL', 'State Loop'), 
('SEGMENT', 'ROUTE_PREFIX', 'SS', 'State Spur'), 
('SEGMENT', 'ROUTE_PREFIX', 'UA', 'US Alternate'), 
('SEGMENT', 'ROUTE_PREFIX', 'UP', 'US Spur'), 
('SEGMENT', 'ROUTE_PREFIX', 'US', 'US Highway'), 
('SEGMENT', 'STATUS', 'Available', ''),
('SEGMENT', 'STATUS', 'Pending', ''),
('SEGMENT', 'STATUS', 'Adopted', ''),
('SEGMENT', 'STATUS', 'In Process', ''),
('SEGMENT', 'STATUS', 'Not Assessed', ''),
('SEGMENT', 'STATUS', 'Unavailable', ''),
('SEGMENT', 'STATUS', 'Deactivate', ''),
('SEGMENT', 'STATUS_REASON', 'Construction', ''),
('SEGMENT', 'STATUS_REASON', 'Weather', ''),
('SEGMENT', 'STATUS_REASON', 'District Change', ''),
('SEGMENT', 'STATUS_REASON', 'Safety Hazard', ''),
('SEGMENT', 'STATUS_REASON', 'Interstate', ''),
('SEGMENT', 'STATUS_REASON', 'Other', ''),
('SEGMENT', 'STATUS_REASON', 'Road No Longer Exists', ''),
('SEGMENT', 'STATUS_REASON', 'Error', ''),
('SEGMENT', 'STATUS_REASON', 'Non-TxDOT Road', ''),
('SIGN_STATUS', 'STATUS', 'Sign Mockup Pending', ''),
('SIGN_STATUS', 'STATUS', 'Sent to Shop by the Sign Coordinator', ''),
('SIGN_STATUS', 'STATUS', 'Sign Installed', '');

INSERT INTO [VALUE] ([COLUMN_ID], [VALID_VALUE], [DESCRIPTION], [ACTIVE])
SELECT cn.[COLUMN_ID], nv.[VALID_VALUE], nv.[DESCRIPTION], 'Y'
FROM @new_values nv
INNER JOIN [TABLE_NAME] tn ON nv.[TABLE_NAME] = tn.[NAME]
INNER JOIN [COLUMN_NAME] cn ON cn.[TABLE_ID] = tn.[TABLE_ID] AND nv.[COLUMN_NAME] = cn.[NAME]
LEFT JOIN [VALUE] v ON cn.[COLUMN_ID] = v.[COLUMN_ID] AND nv.[VALID_VALUE] = v.[VALID_VALUE]
WHERE v.[COLUMN_ID] IS NULL AND v.[VALID_VALUE] IS NULL;

-- insert new value relationships
declare @new_value_relationships TABLE (
	[TABLE_NAME] NVARCHAR(255) NOT NULL,
    [COLUMN_NAME] NVARCHAR(255) NOT NULL,	
    [RELATED_COLUMN_NAME] NVARCHAR(255) NOT NULL,	
	[VALID_VALUE] NVARCHAR(255) NOT NULL,
	[RELATED_VALUE] NVARCHAR(255) NOT NULL);

INSERT INTO @new_value_relationships ([TABLE_NAME], [COLUMN_NAME], [RELATED_COLUMN_NAME], [VALID_VALUE], [RELATED_VALUE])
VALUES
('SEGMENT', 'STATUS', 'STATUS_REASON', 'Unavailable', 'Construction'),
('SEGMENT', 'STATUS', 'STATUS_REASON', 'Unavailable', 'Weather'),
('SEGMENT', 'STATUS', 'STATUS_REASON', 'Unavailable', 'District Change'),
('SEGMENT', 'STATUS', 'STATUS_REASON', 'Unavailable', 'Safety Hazard'),
('SEGMENT', 'STATUS', 'STATUS_REASON', 'Unavailable', 'Interstate'),
('SEGMENT', 'STATUS', 'STATUS_REASON', 'Unavailable', 'Other'),
('SEGMENT', 'STATUS', 'STATUS_REASON', 'Deactivate', 'Non-TxDOT Road'),
('SEGMENT', 'STATUS', 'STATUS_REASON', 'Deactivate', 'Road No Longer Exists'),
('SEGMENT', 'STATUS', 'STATUS_REASON', 'Deactivate', 'Error'),
('SEGMENT', 'STATUS', 'STATUS_REASON', 'Deactivate', 'Other');

INSERT INTO VALUE_RELATIONSHIP ([VALUE_ID], [RELATED_VALUE_ID])
SELECT v.VALUE_ID, rv.VALUE_ID
FROM @new_value_relationships nvr
INNER JOIN [TABLE_NAME] tn ON nvr.[TABLE_NAME] = tn.[NAME]
INNER JOIN [COLUMN_NAME] cn ON cn.[TABLE_ID] = tn.[TABLE_ID] AND nvr.[COLUMN_NAME] = cn.[NAME]
INNER JOIN [COLUMN_NAME] rcn ON rcn.[TABLE_ID] = tn.[TABLE_ID] AND nvr.[RELATED_COLUMN_NAME] = rcn.[NAME]
LEFT JOIN [VALUE] v ON cn.[COLUMN_ID] = v.[COLUMN_ID] AND nvr.[VALID_VALUE] = v.[VALID_VALUE]
LEFT JOIN [VALUE] rv ON rcn.[COLUMN_ID] = rv.[COLUMN_ID] AND nvr.[RELATED_VALUE] = rv.[VALID_VALUE]
LEFT JOIN [VALUE_RELATIONSHIP] vr ON vr.[VALUE_ID] = v.[VALUE_ID] AND rv.[VALUE_ID] = vr.[RELATED_VALUE_ID]
WHERE vr.VALUE_ID IS NULL AND vr.RELATED_VALUE_ID IS NULL;