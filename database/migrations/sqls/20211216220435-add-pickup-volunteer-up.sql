/*
For the pickup report, we saw a column in the PICKUP table named VOLUME_QUANTITY and we were putting the count of volunteers from the legacy data (PICKUP_VOLR_QTY) into that column.  

Catherine pointed out that our new system will be recording pounds of trash collected. It appears clear our database table design is missing the volunteer column. 

Also, we were putting legacy volunteer counts into the column where are going to store pounds collected (VOLUME_QUANTITY).

VOLUME_QUANTITY should be empty and we need a new column for those volunteer counts. 

Therefore, our change will be: 

•	Add a new database column to the PICKUP table called VOLUNTEER_COUNT to hold the number of volunteers that attended the pickup. Alter the legacy data procedure to populate VOLUNTEER_COUNT with data from PICKUP_VOLR_QTY
•	Change that same procedure to not populate VOLUME_QUANTITY. Recording volume is a feature in the new system.
•	Update the Pickup API call to show the field “volunteerQuantity” as number. It currently shows “volunteerQuantity” as text.

*/

IF NOT EXISTS(SELECT *
FROM sys.columns c INNER JOIN sys.objects o on o.OBJECT_ID = c.OBJECT_ID
WHERE o.type = 'U' and o.name = 'PICKUP' AND c.name = 'VOLUNTEER_COUNT')
BEGIN
    ALTER TABLE PICKUP ADD VOLUNTEER_COUNT [INT] NOT NULL DEFAULT(0)
END
