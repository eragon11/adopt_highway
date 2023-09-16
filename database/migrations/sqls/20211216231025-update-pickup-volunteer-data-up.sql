/*
We will move over the PICKUP table values only once from the volume to volunteer
*/

DECLARE @rc INT = 0, @zeroes INT = 0;
SELECT @rc = COUNT(*) FROM PICKUP
SELECT @zeroes = COUNT(*) FROM PICKUP WHERE VOLUNTEER_COUNT = 0

-- Only move if all PICKUP rows have a zero volunteer count
IF (@rc = @zeroes)
BEGIN
	-- move the values over from volume to volunteer
	UPDATE PICKUP SET VOLUNTEER_COUNT = VOLUME_QUANTITY
	-- then set the value to empty
	UPDATE PICKUP SET VOLUME_QUANTITY = NULL
END
