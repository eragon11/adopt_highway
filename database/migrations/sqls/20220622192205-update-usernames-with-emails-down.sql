/* Replace with your SQL commands */-- create a table to hold the conversion values
DECLARE @EMAIL_CONVERT TABLE (
    CURRENT_USER_NAME NVARCHAR(100) NOT NULL,
    EMAIL NVARCHAR(255) NOT NULL
)

-- insert into our table
INSERT INTO @EMAIL_CONVERT ([CURRENT_USER_NAME],[EMAIL])
VALUES('Catherine.Cromer@txdot.gov','ccromer'),
('Becky.Ozuna@txdot.gov','bozuna'),
('Alyssa.Ybarra1@txdot.gov','aybarra1'),
('KJOHNS-C@txdot.gov','KJOHNS-C'),
('RHATHE-C@txdot.gov','RHATHE-C'),
('BSNIDE-C@txdot.gov','BSNIDE-C'),
('AFENIX-C@txdot.gov','AFENIX-C'),
('VPENUG-C@txdot.gov','VPENUG-C'),
('SGANTA-C@txdot.gov','SGANTA-C'),
('Shelley.Reynolds@txdot.gov','SREYNO1'),
('Tabitha.Murray@txdot.gov','TMURRAY'),
('Phillip.Staton@txdot.gov','PSTATON'),
('Mikayla.Hohle@txdot.gov','MHOHLE'),
('Stephanie.Fahrney@txdot.gov','SFAHRNEY'),
('Carlotta.Knapo@txdot.gov','CKNAPO'),
('GPARTH-C@txdot.gov','GPARTH-C'),
('DPALMER2@txdot.gov','DPALMER2'),
('ATHAKU-C@txdot.gov','ATHAKU-C'),
('Traci.Graham@txdot.gov','TRACI.GRAHAM'),
('KIMBERLY.SHERLEY@txdot.gov','KIMBERLY.SHERLEY'),
('MOLLY.OLSON@txdot.gov','MOLLY.OLSON'),
('JULIE.REYNOLDS@txdot.gov','JULIE.REYNOLDS'),
('STEPHANIE.FAHRNEY@txdot.gov','STEPHANIE.FAHRNEY'),
('TABITHA.MURRAY@txdot.gov','TABITHA.MURRAY'),
('LISA.TIPTON@txdot.gov','LISA.TIPTON'),
('JAN.ROBBINS@txdot.gov','JAN.ROBBINS'),
('GINGER.WILSON@txdot.gov','GINGER.WILSON'),
('OMAR.GARCIA@txdot.gov','OMAR.GARCIA'),
('ARIANA.JEFFERSON@txdot.gov','ARIANA.JEFFERSON'),
('JOSIE.AGUILARCROSBY@txdot.gov','JOSIE.AGUILARCROSBY'),
('CHRISTINE.JONES@txdot.gov','CHRISTINE.JONES'),
('MARGARET.JASSO@txdot.gov','MARGARET.JASSO'),
('HANNA.HENDERSON@txdot.gov','HANNA.HENDERSON'),
('MARISSA.GUERRETTAZ@txdot.gov','MARISSA.GUERRETTAZ'),
('LYDIA.SEGOVIA@txdot.gov','LYDIA.SEGOVIA'),
('CAROLYN.CRADDICK@txdot.gov','CAROLYN.CRADDICK'),
('SHELLEY.REYNOLDS@txdot.gov','SHELLEY.REYNOLDS'),
('GENE.POWELL@txdot.gov','GENE.POWELL'),
('Stephanie.ONeal@txdot.gov','STEPHANIE.O''NEAL'),
('AMANDA.MCEACHERN@txdot.gov','AMANDA.MCEACHERN'),
('JAMES.WHITLOCK@txdot.gov','JAMES.WHITLOCK'),
('MELANIE.MCBRIDE@txdot.gov','MELANIE.MCBRIDE'),
('JENNY.BIEN@txdot.gov','JENNY.BIEN'),
('KELLIE.MANNERING@txdot.gov','KELLIE.MANNERING'),
('CHRISTOPHER.PETERS@txdot.gov','CHRISTOPHER.PETERS'),
('LINDA.BERGER@txdot.gov','LINDA.BERGER');

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