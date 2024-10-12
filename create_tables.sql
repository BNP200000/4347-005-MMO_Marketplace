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
        FOREIGN KEY (owner_id) REFERENCES USERS (user_id), -- "OWNS" relationship, 1 to N
        FOREIGN KEY (character_class) REFERENCES CLASSES (class_id), -- "BELONGS TO" relationship, 1 to 1
        FOREIGN KEY (party_leader) REFERENCES CHARACTERS (character_id) -- "MANAGES" relationship, 1 to N
    );