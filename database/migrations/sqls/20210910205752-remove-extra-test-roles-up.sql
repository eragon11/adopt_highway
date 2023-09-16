DELETE r
FROM ROLE r
    INNER JOIN USER_PERSON u on r.user_id = u.USER_ID
WHERE 
r.TYPE IN ('Approver', 'District Coordinator','Maintenance Coordinator','Sign Coordinator','Support Team')
    AND r.ORGANIZATION_ID = 1
    AND u.USERNAME IN ('BSNIDE-C', 'KJOHNS-C', 'AFENIX-C', 'RHATHE-C', 'VPENUG-C', 'VPANGU-C', 'CCROMER','CLORENCE','BOZUNA','SGANTA-C','SCALCO-C','CKNAPPO')