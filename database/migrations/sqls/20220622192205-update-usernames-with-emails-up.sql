/* Replace with your SQL commands */-- create a table to hold the conversion values
DECLARE @EMAIL_CONVERT TABLE (
    CURRENT_USER_NAME NVARCHAR(100) NOT NULL,
    EMAIL NVARCHAR(255) NOT NULL
)

-- insert into our table
INSERT INTO @EMAIL_CONVERT ([CURRENT_USER_NAME],[EMAIL])
VALUES('ccromer','Catherine.Cromer@txdot.gov'),
('bozuna','Becky.Ozuna@txdot.gov'),
('aybarra1','Alyssa.Ybarra1@txdot.gov'),
('KJOHNS-C', 'KJOHNS-C@txdot.gov'),
('RHATHE-C','RHATHE-C@txdot.gov'),
('BSNIDE-C', 'BSNIDE-C@txdot.gov'),
('AFENIX-C', 'AFENIX-C@txdot.gov'),
('VPENUG-C', 'VPENUG-C@txdot.gov'),
('SGANTA-C', 'SGANTA-C@txdot.gov'),
('SREYNO1', 'Shelley.Reynolds@txdot.gov'),
('TMURRAY', 'Tabitha.Murray@txdot.gov'),
('PSTATON', 'Phillip.Staton@txdot.gov'),
('MHOHLE', 'Mikayla.Hohle@txdot.gov'),
('SFAHRNEY', 'Stephanie.Fahrney@txdot.gov'),
('CKNAPO', 'Carlotta.Knapo@txdot.gov'),
('GPARTH-C', 'GPARTH-C@txdot.gov'),
('DPALMER2', 'DPALMER2@txdot.gov'),
('ATHAKU-C', 'ATHAKU-C@txdot.gov'),
('TRACI.GRAHAM', 'Traci.Graham@txdot.gov'),
('KIMBERLY.SHERLEY', 'KIMBERLY.SHERLEY@txdot.gov'),
('MOLLY.OLSON', 'MOLLY.OLSON@txdot.gov'),
('JULIE.REYNOLDS', 'JULIE.REYNOLDS@txdot.gov'),
('STEPHANIE.FAHRNEY', 'STEPHANIE.FAHRNEY@txdot.gov'),
('TABITHA.MURRAY', 'TABITHA.MURRAY@txdot.gov'),
('LISA.TIPTON', 'LISA.TIPTON@txdot.gov'),
('JAN.ROBBINS', 'JAN.ROBBINS@txdot.gov'),
('GINGER.WILSON', 'GINGER.WILSON@txdot.gov'),
('OMAR.GARCIA', 'OMAR.GARCIA@txdot.gov'),
('ARIANA.JEFFERSON', 'ARIANA.JEFFERSON@txdot.gov'),
('JOSIE.AGUILARCROSBY', 'JOSIE.AGUILARCROSBY@txdot.gov'),
('CHRISTINE.JONES', 'CHRISTINE.JONES@txdot.gov'),
('MARGARET.JASSO', 'MARGARET.JASSO@txdot.gov'),
('HANNA.HENDERSON', 'HANNA.HENDERSON@txdot.gov'),
('MARISSA.GUERRETTAZ', 'MARISSA.GUERRETTAZ@txdot.gov'),
('LYDIA.SEGOVIA', 'LYDIA.SEGOVIA@txdot.gov'),
('CAROLYN.CRADDICK', 'CAROLYN.CRADDICK@txdot.gov'),
('SHELLEY.REYNOLDS', 'SHELLEY.REYNOLDS@txdot.gov'),
('GENE.POWELL', 'GENE.POWELL@txdot.gov'),
('STEPHANIE.O''NEAL', 'Stephanie.ONeal@txdot.gov'),
('AMANDA.MCEACHERN', 'AMANDA.MCEACHERN@txdot.gov'),
('JAMES.WHITLOCK', 'JAMES.WHITLOCK@txdot.gov'),
('MELANIE.MCBRIDE', 'MELANIE.MCBRIDE@txdot.gov'),
('JENNY.BIEN', 'JENNY.BIEN@txdot.gov'),
('KELLIE.MANNERING', 'KELLIE.MANNERING@txdot.gov'),
('CHRISTOPHER.PETERS', 'CHRISTOPHER.PETERS@txdot.gov'),
('LINDA.BERGER', 'LINDA.BERGER@txdot.gov');

-- Remove extra user records
DELETE t1
FROM ROLE t1
INNER JOIN USER_PERSON t2 ON t1.USER_ID = t2.USER_ID
WHERE t2.USERNAME IN('SREYNO1', 'MIKAYLA.ADARE','SFAHRNEY','TMURRAY');

DELETE FROM USER_PERSON WHERE USERNAME IN('SREYNO1', 'MIKAYLA.ADARE','SFAHRNEY','TMURRAY');

-- UPDATE TO THE EMAIL
UPDATE t2 SET USERNAME = t1.EMAIL 
FROM @EMAIL_CONVERT t1
INNER JOIN USER_PERSON t2 on t1.CURRENT_USER_NAME = t2.USERNAME;