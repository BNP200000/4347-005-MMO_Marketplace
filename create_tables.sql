CREATE TABLE
    IF NOT EXISTS "USERS" (
        user_id VARCHAR(25) NOT NULL,
        username VARCHAR(25) NOT NULL,
        password VARCHAR(25) NOT NULL,
        email VARCHAR(25),
        PRIMARY KEY (user_id)
    );

CREATE TABLE
    IF NOT EXISTS "CLASSES" (
        class_id VARCHAR(25) NOT NULL,
        class_name VARCHAR(25),
        class_description VARCHAR(25),
        class_role VARCHAR(25),
        PRIMARY KEY (class_id)
    );

CREATE TABLE
    IF NOT EXISTS "CHARACTERS" (
        character_id VARCHAR(25) NOT NULL,
        exp_level INT,
        character_name VARCHAR(25),
        gold_balance INT,
        owner_id VARCHAR(25) NOT NULL,
        character_class VARCHAR(25),
        party_leader VARCHAR(25),
        PRIMARY KEY (character_id),
        FOREIGN KEY (owner_id) REFERENCES "USERS" (user_id), -- "OWNS" relationship, 1 to N
        FOREIGN KEY (character_class) REFERENCES "CLASSES" (class_id), -- "BELONGS TO" relationship, 1 to 1
        FOREIGN KEY (party_leader) REFERENCES "CHARACTERS" (character_id) -- "MANAGES" relationship, 1 to N
    );

CREATE TABLE
    IF NOT EXISTS "PARTY" (
        party_name varchar(50) primary key,
        party_balance int
    );

CREATE TABLE
    IF NOT EXISTS "TRANSACTION" (
        transaction_id char(10) primary key,
        total_price int,
        transaction_date date
    );

INSERT INTO
    "USERS" (user_id, username, password, email)
VALUES
    (
        '1x2y3z456',
        'dragonlord',
        'pass123',
        'dragonlord@example.com'
    ),
    (
        '2y3z4a567',
        'skywalker',
        'star123',
        'skywalker@example.com'
    ),
    (
        '3z4a5b678',
        'ironfist',
        'punch789',
        'ironfist@example.com'
    ),
    (
        '4a5b6c789',
        'shadowblade',
        'shadow456',
        'shadowblade@example.com'
    ),
    (
        '5b6c7d890',
        'stormrider',
        'rider567',
        'stormrider@example.com'
    ),
    (
        '6c7d8e901',
        'firemage',
        'fire321',
        'firemage@example.com'
    ),
    (
        '7d8e9f012',
        'windrunner',
        'wind111',
        'windrunner@example.com'
    ),
    (
        '8e9f0g123',
        'earthwarden',
        'earth222',
        'earthwarden@example.com'
    ),
    (
        '9f0g1h234',
        'waterseer',
        'water333',
        'waterseer@example.com'
    ),
    (
        '0g1h2i345',
        'lightbringer',
        'light444',
        'lightbringer@example.com'
    );

INSERT INTO
    "CLASSES" (
        class_id,
        class_name,
        class_description,
        class_role
    )
VALUES
    (
        '1m2n3o456',
        'Warrior',
        'Frontline fighter',
        'Tank'
    ),
    ('2n3o4p567', 'Rogue', 'Stealthy assassin', 'DPS'),
    ('3o4p5q678', 'Mage', 'Master of magic', 'DPS'),
    (
        '4p5q6r789',
        'Cleric',
        'Healer of the wounded',
        'Healer'
    ),
    ('5q6r7s890', 'Paladin', 'Holy warrior', 'Tank'),
    ('6r7s8t901', 'Ranger', 'Expert marksman', 'DPS'),
    (
        '7s8t9u012',
        'Druid',
        'Nature spellcaster',
        'Healer'
    ),
    ('8t9u0v123', 'Monk', 'Martial artist', 'DPS'),
    (
        '9u0v1w234',
        'Bard',
        'Musical supporter',
        'Support'
    ),
    (
        '0v1w2x345',
        'Necromancer',
        'Summoner of the dead',
        'DPS'
    );

INSERT INTO
    "CHARACTERS" (
        character_id,
        exp_level,
        character_name,
        gold_balance,
        owner_id,
        character_class,
        party_leader
    )
VALUES
    (
        '1a2b3c456',
        5,
        'Alduin',
        300,
        '1x2y3z456',
        '1m2n3o456',
        NULL
    ), -- Alduin is a Warrior, no leader
    (
        '2b3c4d567',
        3,
        'Lyria',
        150,
        '2y3z4a567',
        '2n3o4p567',
        '1a2b3c456'
    ), -- Lyria is a Rogue, led by Alduin
    (
        '3c4d5e678',
        7,
        'Gorath',
        500,
        '3z4a5b678',
        '3o4p5q678',
        '1a2b3c456'
    ), -- Gorath is a Mage, led by Alduin
    (
        '4d5e6f789',
        6,
        'Serana',
        250,
        '4a5b6c789',
        '1m2n3o456',
        NULL
    ), -- Serana is a Warrior, no leader
    (
        '5e6f7g890',
        10,
        'Theron',
        800,
        '5b6c7d890',
        '2n3o4p567',
        '1a2b3c456'
    ), -- Theron is a Rogue, led by Alduin
    (
        '6f7g8h901',
        4,
        'Miraak',
        200,
        '6c7d8e901',
        '3o4p5q678',
        '2b3c4d567'
    ), -- Miraak is a Mage, led by Lyria
    (
        '7g8h9i012',
        12,
        'Valdrin',
        1000,
        '7d8e9f012',
        '4p5q6r789',
        '3c4d5e678'
    ), -- Valdrin is a Cleric, led by Gorath
    (
        '8h9i0j123',
        2,
        'Nalya',
        100,
        '8e9f0g123',
        '1m2n3o456',
        '2b3c4d567'
    ), -- Nalya is a Warrior, led by Lyria
    (
        '9i0j1k234',
        9,
        'Druin',
        750,
        '9f0g1h234',
        '4p5q6r789',
        '3c4d5e678'
    ), -- Druin is a Cleric, led by Gorath
    (
        '0j1k2l345',
        8,
        'Kael',
        600,
        '0g1h2i345',
        '5q6r7s890',
        '1a2b3c456'
    );

-- Kael is a Paladin, led by Alduin
-- Insert into Party table
INSERT INTO
    Party (party_name, party_id)
VALUES
    ('Lyrical', 53422),
    ('Arcane', 3234223),
    ('Dragon Slayer', 1000),
    ('Witch Hunter', 54223),
    ('Tuba Gang', 546),
    ('Stroopwafel', 564),
    ('Birds of Prey', 32),
    ('The Fallen', 7869),
    ('Masked Fools', 435345),
    ('Asgard', 34523);

INSERT INTO
    Transaction (transaction_id, party_id, transaction_date)
VALUES
    ('741966', 53422, '2024-10-22'),
    ('703221', 3234223, '2024-10-28'),
    ('703814', 1000, '2024-11-04'),
    ('772759', 54223, '2024-11-06'),
    ('744093', 546, '2024-11-12'),
    ('733026', 564, '2024-11-23'),
    ('773521', 32, '2024-11-30'),
    ('781428', 7869, '2024-12-14'),
    ('761722', 435345, '2024-12-21'),
    ('716844', 34523, '2024-12-24');