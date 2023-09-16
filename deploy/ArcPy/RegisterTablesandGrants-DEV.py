import arcpy
import os

myDB=r"deploy\ArcPy\datafiles\aah_dataowner_dev.sde"
myQuery=""" Select Name from [sde].[GDB_ITEMS] where Name like 'aah%' """

sql1="""
BEGIN 
IF NOT EXISTS (SELECT * FROM [aah].[SIGN]
                   WHERE AGREEMENT_ID = "AGREEMENT_ID"
                   AND LINE_1 = "LINE_1")
BEGIN 
  insert into [aah].[SIGN] (AGREEMENT_ID,TYPE,LINE_1,LINE_2,LINE_3,LINE_4,COMMENT)
values (2531046,null,'Texarkana','Jeep','Junkies','Club','Rick is a member')
END
END"""

sql2="""
BEGIN 
IF NOT EXISTS (SELECT * FROM [aah].[SIGN_STATUS]
                   WHERE SIGN_STATUS_ID = "SIGN_STATUS_ID"
                    AND SIGN_ID = "SIGN_ID"
                    AND COMMENT = "COMMENT")
BEGIN 
    insert into SIGN_STATUS (SIGN_STATUS_ID,SIGN_ID,STATUS,BEGIN_DATE,COMPLETION_DATE,COMMENT)
values (1,1,'Sign Installed','2021-08-10','2021-08-10','Rick drove his jeep to the sign shop, picked up the sign, and installed it himself - impressive!')
END
END"""

sqlConn=arcpy.ArcSDESQLExecute(myDB)

result=sqlConn.execute(myQuery)
result=sqlConn.execute(sql1)
result=sqlConn.execute(sql2)
sql_statement_list=myQuery.split(";")
for sql in sql_statement_list:
    egdb_return=sqlConn.execute(sql)

arcpy.env.workspace=r"deploy\ArcPy\datafiles\aah_dataowner_dev.sde"

fc_list=sql_statement_list=myQuery.split(";")
for sql in sql_statement_list:
    egdb_return=sqlConn.execute(sql)
    for row in egdb_return:

        print(('TABLE ALREADY REGISTERED WITH GEODATABASE'+" "+  r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\{:<12}"*len
              (row)).format(*row)+'"')

arcpy.ListTables()

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.AGREEMENT",
        in_object_id_field = "AGREEMENT_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.AGREEMENT table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.Agreement was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.AGREEMENT",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.AGREEMENT table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.AGREEMENT",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.AGREEMENT table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.PICKUP_SCHEDULE",
        in_object_id_field = "PICKUP_SCHEDULE_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print(
        'aah.aah.PICKUP_SCHEDULE table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.PICKUP_SCHEDULE was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.PICKUP_SCHEDULE",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.PICKUP_SCHEDULE table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.PICKUP_SCHEDULE",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.PICKUP_SCHEDULE table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.SIGN",
        in_object_id_field = "SIGN_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.SIGN table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.SIGN was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.SIGN",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.SIGN table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.SIGN",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.SIGN table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.VALUE",
        in_object_id_field = "VALUE_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.VALUE table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.VALUE was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.VALUE",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.VALUE table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.VALUE",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.VALUE table has been granted Privileges for user gis-- SUCCEEDED")
try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.DISTRICT",
        in_object_id_field = "DISTRICT_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.DISTRICT table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.DISTRICT was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.DISTRICT",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.DISTRICT table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.DISTRICT",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.DISTRICT table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.ADDRESS",
        in_object_id_field = "ADDRESS_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.ADDRESS table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.ADDRESS was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.ADDRESS",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.ADDRESS table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.ADDRESS",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.ADDRESS table has been granted Privileges for user gis-- SUCCEEDED")
try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.COLUMN_NAME",
        in_object_id_field = "COLUMN_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.COLUMN_NAME table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.COLUMN_NAME was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.COLUMN_NAME",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.COLUMN_NAME table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.COLUMN_NAME",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.COLUMN_NAME table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.CONTACT_TYPE",
        in_object_id_field = "CONTACT_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.CONTACT_TYPE table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.CONTACT_TYPE was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.CONTACT_TYPE",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.CONTACT_TYPE table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.CONTACT_TYPE",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.CONTACT_TYPE table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.COUNTY",
        in_object_id_field = "COUNTY_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.COUNTY table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.COUNTY was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.COUNTY",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.COUNTY table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.COUNTY",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.COUNTY table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.DOCUMENT",
        in_object_id_field = "DOCUMENT_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.DOCUMENT table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.DOCUMENT was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.DOCUMENT",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.DOCUMENT table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.DOCUMENT",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.DOCUMENT table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.EMAIL",
        in_object_id_field = "EMAIL_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.EMAIL table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.EMAIL was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.EMAIL",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.EMAIL table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.EMAIL",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.EMAIL table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.GROUP_SPONSOR",
        in_object_id_field = "ORGANIZATION_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.GROUP_SPONSOR table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.GROUP_SPONSOR was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.GROUP_SPONSOR",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.GROUP_SPONSOR table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.GROUP_SPONSOR",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.GROUP_SPONSOR table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.PHONE",
        in_object_id_field = "PHONE_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.PHONE table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.PHONE was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.PHONE",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.PHONE table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.PHONE",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.PHONE table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.PICKUP",
        in_object_id_field = "PICKUP_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.PICKUP table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.PICKUP was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.PICKUP",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.PICKUP table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.PICKUP",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.PICKUP table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.ROLE",
        in_object_id_field = "ROLE_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.ROLE table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.ROLE was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.ROLE",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.ROLE table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.ROLE",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.ROLE table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.SEGMENT",
        in_object_id_field = "SEGMENT_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.SEGMENT table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.SEGMENT was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.SEGMENT",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.SEGMENT table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.SEGMENT",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.SEGMENT table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.SIGN_STATUS",
        in_object_id_field = "SIGN_STATUS_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.SIGN_STATUS table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.SIGN_STATUS was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.SIGN_STATUS",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.SIGN_STATUS table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.SIGN_STATUS",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.SIGN_STATUS table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.TABLE_NAME",
        in_object_id_field = "TABLE_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.TABLE_NAME table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.TABLE_NAME was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.TABLE_NAME",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.TABLE_NAME table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.TABLE_NAME",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.TABLE_NAME table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.TRANSACTION_LOG",
        in_object_id_field = "LOG_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.TRANSACTION_LOG table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.TRANSACTION_LOG was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.TRANSACTION_LOG",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.TRANSACTION_LOG table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.TRANSACTION_LOG",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.TRANSACTION_LOG table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.TXDOT",
        in_object_id_field = "TXDOT_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.TXDOT table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.TXDOT was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.TXDOT",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.TXDOT table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.TXDOT",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.TXDOT table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.USER_PERSON",
        in_object_id_field = "USER_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.USER_PERSON table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.USER_PERSON was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.USER_PERSON",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.USER_PERSON table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.USER_PERSON",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.USER_PERSON table has been granted Privileges for user gis-- SUCCEEDED")

try:
    arcpy.RegisterWithGeodatabase_management(
        in_dataset =   r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.VALUE_RELATIONSHIP",
        in_object_id_field = "RELATIONSHIP_ID", in_shape_field = None, in_geometry_type = '', in_extent = None,
        in_spatial_reference = None)

except (RuntimeError, TypeError, NameError) as d:
    print(d)
    print('aah.aah.VALUE_RELATIONSHIP table is already registered with the Geodatabase, ignores error ERROR 001050: Registered with geodatabase')
    pass
else:
    print('aah.aah.VALUE_RELATIONSHIP was just Registered with the Geodatabase-- SUCCEEDED')

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.VALUE_RELATIONSHIP",
        "aah_publisher", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as e:
    print(e)

else:
    print("aah.aah.VALUE_RELATIONSHIP table has been granted Privileges for user aah_publisher-- SUCCEEDED")

try:
    arcpy.management.ChangePrivileges(
          r"deploy\ArcPy\datafiles\dev\aah_dataowner_dev.sde\aah.aah.VALUE_RELATIONSHIP",
        "gis", "GRANT", "GRANT")

except (RuntimeError, TypeError, NameError) as f:
    print("ERROR in granting Privileges to gis user")

else:
    print("aah.aah.VALUE_RELATIONSHIP table has been granted Privileges for user gis-- SUCCEEDED")

print("----END OF SCRIPT, PROCESS COMPLETE-----")