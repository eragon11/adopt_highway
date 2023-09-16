-- remove the Read Only User record from VALUE
DELETE v
FROM [TABLE_NAME] tn
INNER JOIN [COLUMN_NAME] cn ON cn.[TABLE_ID] = tn.[TABLE_ID]
LEFT JOIN [VALUE] v ON cn.[COLUMN_ID] = v.[COLUMN_ID]
WHERE 
tn.NAME = 'ROLE'
AND cn.NAME = 'TYPE'
AND v.VALID_VALUE = 'Read Only User';