ALTER PROC aah_insert_missing_counties
AS
BEGIN;
    SET NOCOUNT ON;

    DECLARE @COUNTY TABLE (
        COUNTY_ID int IDENTITY(1,1) NOT NULL PRIMARY KEY,
        CODE char(3) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
        NAME varchar(30) COLLATE SQL_Latin1_General_CP1_CI_AS NOT NULL,
        [NUMBER] int NULL
    );

    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'001', N'Anderson', 1),
        (N'002', N'Andrews', 2),
        (N'003', N'Angelina', 3),
        (N'004', N'Aransas', 4),
        (N'005', N'Archer', 5),
        (N'006', N'Armstrong', 6),
        (N'007', N'Atascosa', 7),
        (N'008', N'Austin', 8),
        (N'009', N'Bailey', 9),
        (N'010', N'Bandera', 10);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'011', N'Bastrop', 11),
        (N'012', N'Baylor', 12),
        (N'013', N'Bee', 13),
        (N'014', N'Bell', 14),
        (N'015', N'Bexar', 15),
        (N'016', N'Blanco', 16),
        (N'017', N'Borden', 17),
        (N'018', N'Bosque', 18),
        (N'019', N'Bowie', 19),
        (N'020', N'Brazoria', 20);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'021', N'Brazos', 21),
        (N'022', N'Brewster', 22),
        (N'023', N'Briscoe', 23),
        (N'024', N'Brooks', 24),
        (N'025', N'Brown', 25),
        (N'026', N'Burleson', 26),
        (N'027', N'Burnet', 27),
        (N'028', N'Caldwell', 28),
        (N'029', N'Calhoun', 29),
        (N'030', N'Callahan', 30);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'031', N'Cameron', 31),
        (N'032', N'Camp', 32),
        (N'033', N'Carson', 33),
        (N'034', N'Cass', 34),
        (N'035', N'Castro', 35),
        (N'036', N'Chambers', 36),
        (N'037', N'Cherokee', 37),
        (N'038', N'Childress', 38),
        (N'039', N'Clay', 39),
        (N'040', N'Cochran', 40);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'041', N'Coke', 41),
        (N'042', N'Coleman', 42),
        (N'043', N'Collin', 43),
        (N'044', N'Collingsworth', 44),
        (N'045', N'Colorado', 45),
        (N'046', N'Comal', 46),
        (N'047', N'Comanche', 47),
        (N'048', N'Concho', 48),
        (N'049', N'Cooke', 49),
        (N'050', N'Coryell', 50);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'051', N'Cottle', 51),
        (N'052', N'Crane', 52),
        (N'053', N'Crockett', 53),
        (N'054', N'Crosby', 54),
        (N'055', N'Culberson', 55),
        (N'056', N'Dallam', 56),
        (N'057', N'Dallas', 57),
        (N'058', N'Dawson', 58),
        (N'059', N'Deaf Smith', 59),
        (N'060', N'Delta', 60);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'061', N'Denton', 61),
        (N'062', N'De Witt', 62),
        (N'063', N'Dickens', 63),
        (N'064', N'Dimmit', 64),
        (N'065', N'Donley', 65),
        (N'066', N'Duval', 67),
        (N'067', N'Eastland', 68),
        (N'068', N'Ector', 69),
        (N'069', N'Edwards', 70),
        (N'070', N'Ellis', 71);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'071', N'El Paso', 72),
        (N'072', N'Erath', 73),
        (N'073', N'Falls', 74),
        (N'074', N'Fannin', 75),
        (N'075', N'Fayette', 76),
        (N'076', N'Fisher', 77),
        (N'077', N'Floyd', 78),
        (N'078', N'Foard', 79),
        (N'079', N'Fort Bend', 80),
        (N'080', N'Franklin', 81);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'081', N'Freestone', 82),
        (N'082', N'Frio', 83),
        (N'083', N'Gaines', 84),
        (N'084', N'Galveston', 85),
        (N'085', N'Garza', 86),
        (N'086', N'Gillespie', 87),
        (N'087', N'Glasscock', 88),
        (N'088', N'Goliad', 89),
        (N'089', N'Gonzales', 90),
        (N'090', N'Gray', 91);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'091', N'Grayson', 92),
        (N'092', N'Gregg', 93),
        (N'093', N'Grimes', 94),
        (N'094', N'Guadalupe', 95),
        (N'095', N'Hale', 96),
        (N'096', N'Hall', 97),
        (N'097', N'Hamilton', 98),
        (N'098', N'Hansford', 99),
        (N'099', N'Hardeman', 100),
        (N'100', N'Hardin', 101);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'101', N'Harris', 102),
        (N'102', N'Harrison', 103),
        (N'103', N'Hartley', 104),
        (N'104', N'Haskell', 105),
        (N'105', N'Hays', 106),
        (N'106', N'Hemphill', 107),
        (N'107', N'Henderson', 108),
        (N'108', N'Hidalgo', 109),
        (N'109', N'Hill', 110),
        (N'110', N'Hockley', 111);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'111', N'Hood', 112),
        (N'112', N'Hopkins', 113),
        (N'113', N'Houston', 114),
        (N'114', N'Howard', 115),
        (N'115', N'Hudspeth', 116),
        (N'116', N'Hunt', 117),
        (N'117', N'Hutchinson', 118),
        (N'118', N'Irion', 119),
        (N'119', N'Jack', 120),
        (N'120', N'Jackson', 121);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'121', N'Jasper', 122),
        (N'122', N'Jeff Davis', 123),
        (N'123', N'Jefferson', 124),
        (N'124', N'Jim Hogg', 125),
        (N'125', N'Jim Wells', 126),
        (N'126', N'Johnson', 127),
        (N'127', N'Jones', 128),
        (N'128', N'Karnes', 129),
        (N'129', N'Kaufman', 130),
        (N'130', N'Kendall', 131);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'131', N'Kenedy', 66),
        (N'132', N'Kent', 132),
        (N'133', N'Kerr', 133),
        (N'134', N'Kimble', 134),
        (N'135', N'King', 135),
        (N'136', N'Kinney', 136),
        (N'137', N'Kleberg', 137),
        (N'138', N'Knox', 138),
        (N'139', N'Lamar', 139),
        (N'140', N'Lamb', 140);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'141', N'Lampasas', 141),
        (N'142', N'La Salle', 142),
        (N'143', N'Lavaca', 143),
        (N'144', N'Lee', 144),
        (N'145', N'Leon', 145),
        (N'146', N'Liberty', 146),
        (N'147', N'Limestone', 147),
        (N'148', N'Lipscomb', 148),
        (N'149', N'Live Oak', 149),
        (N'150', N'Llano', 150);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'151', N'Loving', 151),
        (N'152', N'Lubbock', 152),
        (N'153', N'Lynn', 153),
        (N'154', N'McCulloch', 160),
        (N'155', N'McLennan', 161),
        (N'156', N'McMullen', 162),
        (N'157', N'Madison', 154),
        (N'158', N'Marion', 155),
        (N'159', N'Martin', 156),
        (N'160', N'Mason', 157);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'161', N'Matagorda', 158),
        (N'162', N'Maverick', 159),
        (N'163', N'Medina', 163),
        (N'164', N'Menard', 164),
        (N'165', N'Midland', 165),
        (N'166', N'Milam', 166),
        (N'167', N'Mills', 167),
        (N'168', N'Mitchell', 168),
        (N'169', N'Montague', 169),
        (N'170', N'Montgomery', 170);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'171', N'Moore', 171),
        (N'172', N'Morris', 172),
        (N'173', N'Motley', 173),
        (N'174', N'Nacogdoches', 174),
        (N'175', N'Navarro', 175),
        (N'176', N'Newton', 176),
        (N'177', N'Nolan', 177),
        (N'178', N'Nueces', 178),
        (N'179', N'Ochiltree', 179),
        (N'180', N'Oldham', 180);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'181', N'Orange', 181),
        (N'182', N'Palo Pinto', 182),
        (N'183', N'Panola', 183),
        (N'184', N'Parker', 184),
        (N'185', N'Parmer', 185),
        (N'186', N'Pecos', 186),
        (N'187', N'Polk', 187),
        (N'188', N'Potter', 188),
        (N'189', N'Presidio', 189),
        (N'190', N'Rains', 190);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'191', N'Randall', 191),
        (N'192', N'Reagan', 192),
        (N'193', N'Real', 193),
        (N'194', N'Red River', 194),
        (N'195', N'Reeves', 195),
        (N'196', N'Refugio', 196),
        (N'197', N'Roberts', 197),
        (N'198', N'Robertson', 198),
        (N'199', N'Rockwall', 199),
        (N'200', N'Runnels', 200);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'201', N'Rusk', 201),
        (N'202', N'Sabine', 202),
        (N'203', N'San Augustine', 203),
        (N'204', N'San Jacinto', 204),
        (N'205', N'San Patricio', 205),
        (N'206', N'San Saba', 206),
        (N'207', N'Schleicher', 207),
        (N'208', N'Scurry', 208),
        (N'209', N'Shackelford', 209),
        (N'210', N'Shelby', 210);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'211', N'Sherman', 211),
        (N'212', N'Smith', 212),
        (N'213', N'Somervell', 213),
        (N'214', N'Starr', 214),
        (N'215', N'Stephens', 215),
        (N'216', N'Sterling', 216),
        (N'217', N'Stonewall', 217),
        (N'218', N'Sutton', 218),
        (N'219', N'Swisher', 219),
        (N'220', N'Tarrant', 220);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'221', N'Taylor', 221),
        (N'222', N'Terrell', 222),
        (N'223', N'Terry', 223),
        (N'224', N'Throckmorton', 224),
        (N'225', N'Titus', 225),
        (N'226', N'Tom Green', 226),
        (N'227', N'Travis', 227),
        (N'228', N'Trinity', 228),
        (N'229', N'Tyler', 229),
        (N'230', N'Upshur', 230);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'231', N'Upton', 231),
        (N'232', N'Uvalde', 232),
        (N'233', N'Val Verde', 233),
        (N'234', N'Van Zandt', 234),
        (N'235', N'Victoria', 235),
        (N'236', N'Walker', 236),
        (N'237', N'Waller', 237),
        (N'238', N'Ward', 238),
        (N'239', N'Washington', 239),
        (N'240', N'Webb', 240);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'241', N'Wharton', 241),
        (N'242', N'Wheeler', 242),
        (N'243', N'Wichita', 243),
        (N'244', N'Wilbarger', 244),
        (N'245', N'Willacy', 245),
        (N'246', N'Williamson', 246),
        (N'247', N'Wilson', 247),
        (N'248', N'Winkler', 248),
        (N'249', N'Wise', 249),
        (N'250', N'Wood', 250);
    INSERT INTO @COUNTY
        (CODE,NAME,[NUMBER])
    VALUES
        (N'251', N'Yoakum', 251),
        (N'252', N'Young', 252),
        (N'253', N'Zapata', 253),
        (N'254', N'Zavala', 254),
        (N'   ', N'(UNKNOWN)', 255);

    -- insert into county
    INSERT INTO COUNTY
        ([CODE], [NAME])
    SELECT c.[CODE],
        c.[NAME]
    FROM @COUNTY c
        LEFT JOIN COUNTY c1 on c.[CODE] = c1.[CODE]
    WHERE c1.[CODE] IS NULL;

    SET NOCOUNT OFF;
END;

