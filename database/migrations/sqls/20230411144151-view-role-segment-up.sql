CREATE VIEW view_role_segment
AS
        SELECT DISTINCT
            s.AAH_SEGMENT_ID, s.GlobalID, s.AAH_ROUTE_NAME, s.CNTY_NBR, s.CNTY_NM, s.DIST_NBR, s.DIST_NM, s.MNT_OFFICE_NM, s.MNT_SEC_NBR, c.COUNTY_ID, ms.DISTRICT_ID, r.ROLE_ID, r.USER_ID, r.TYPE
        FROM
            USER_PERSON u
            INNER JOIN ROLE r ON u.USER_ID = r.USER_ID
            INNER JOIN ORGANIZATION o ON r.ORGANIZATION_ID = o.ORGANIZATION_ID
            INNER JOIN MAINTENANCE_SECTION ms ON r.ORGANIZATION_ID = ms.ORGANIZATION_ID
            INNER JOIN gis.AAH_GIS_SEGMENTS s ON ms.DISTRICT_NUMBER = s.DIST_NBR AND MS.NUMBER = s.MNT_SEC_NBR
            INNER JOIN COUNTY c ON s.CNTY_NBR = c.NUMBER
        WHERE
            r.TYPE = 'Maintenance Coordinator'
    UNION ALL
        SELECT DISTINCT
            s.AAH_SEGMENT_ID, s.GlobalID, s.AAH_ROUTE_NAME, s.CNTY_NBR, s.CNTY_NM, s.DIST_NBR, s.DIST_NM, s.MNT_OFFICE_NM, s.MNT_SEC_NBR, c.COUNTY_ID, d.DISTRICT_ID, r.ROLE_ID, r.USER_ID, r.TYPE
        FROM
            USER_PERSON u
            INNER JOIN ROLE r ON u.USER_ID = r.USER_ID
            INNER JOIN ORGANIZATION o ON r.ORGANIZATION_ID = o.ORGANIZATION_ID
            INNER JOIN DISTRICT d ON r.ORGANIZATION_ID = d.ORGANIZATION_ID
            INNER JOIN gis.AAH_GIS_SEGMENTS s ON d.NUMBER = s.DIST_NBR
            INNER JOIN COUNTY c ON s.CNTY_NBR = c.NUMBER
        WHERE
            r.TYPE = 'District Coordinator'
    UNION ALL
        SELECT DISTINCT
            s.AAH_SEGMENT_ID, s.GlobalID, s.AAH_ROUTE_NAME, s.CNTY_NBR, s.CNTY_NM, s.DIST_NBR, s.DIST_NM, s.MNT_OFFICE_NM, s.MNT_SEC_NBR, c.COUNTY_ID, d.DISTRICT_ID, r.ROLE_ID, r.USER_ID, r.TYPE
        FROM
            gis.AAH_GIS_SEGMENTS s
            INNER JOIN COUNTY c ON s.CNTY_NBR = c.NUMBER
            INNER JOIN DISTRICT d ON s.DIST_NBR = d.NUMBER
            INNER JOIN COUNTY_DISTRICT cd ON c.COUNTY_ID = cd.COUNTY_ID AND d.DISTRICT_ID = cd.DISTRICT_ID
CROSS JOIN ROLE r
        WHERE
            r.TYPE IN ('Administrator','Read Only User')