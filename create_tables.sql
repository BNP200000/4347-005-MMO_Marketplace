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
        PRIMARY KEY (character_id)
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