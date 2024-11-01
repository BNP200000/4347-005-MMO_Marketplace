CREATE TABLE
    IF NOT EXISTS "USER" (
        user_id VARCHAR(25) PRIMARY KEY,
        username VARCHAR(25) NOT NULL,
        password VARCHAR(25) NOT NULL,
        email VARCHAR(25),
        account_type VARCHAR(25),
        has_free_chat BOOLEAN,
        has_safe_chat BOOLEAN,
        has_safe_server_access BOOLEAN
    );

CREATE TABLE
    IF NOT EXISTS "CLASS" (
        class_id VARCHAR(25) PRIMARY KEY,
        class_name VARCHAR(25),
        class_description VARCHAR(25),
        class_role VARCHAR(25)
    );

CREATE TABLE
    IF NOT EXISTS "CHARACTER" (
        character_id VARCHAR(25) PRIMARY KEY,
		exp_level INT CHECK(exp_level >= 0),
		character_name VARCHAR(25), 
        gold_balance INT CHECK(gold_balance >= 0),
        owner_id VARCHAR(25) NOT NULL,
        character_class VARCHAR(25),
        leader_id VARCHAR(25),
        FOREIGN KEY (owner_id) REFERENCES "USER" (user_id) ON DELETE CASCADE ON UPDATE CASCADE, -- "OWNS" relationship, 1 to N
        FOREIGN KEY (character_class) REFERENCES "CLASS" (class_id) ON DELETE CASCADE ON UPDATE CASCADE -- "BELONGS TO" relationship, 1 to 1
        -- NOTE; The foreign key constraint for "leader_id" is located in "insert_tables.sql" to avoid circular dependency. It relies on "PARTY"'s party_leader.
    );

CREATE TABLE
    IF NOT EXISTS "CHARACTER_FRIEND" (
        character_a_id VARCHAR(25),
        character_b_id VARCHAR(25),
        PRIMARY KEY (character_a_id, character_b_id),
        FOREIGN KEY (character_a_id) REFERENCES "CHARACTER" (character_id),
        FOREIGN KEY (character_b_id) REFERENCES "CHARACTER" (character_id)
    );

CREATE TABLE
    IF NOT EXISTS "PARTY" (
        party_name VARCHAR(50) UNIQUE,
        party_leader VARCHAR(25) UNIQUE,
        party_balance INT CHECK(party_balance >= 0),
        PRIMARY KEY (party_name, party_leader),
        FOREIGN KEY (party_leader) REFERENCES "CHARACTER" (character_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS "ITEM" (
        item_id SERIAL PRIMARY KEY,
        item_name VARCHAR(50) NOT NULL UNIQUE,
        item_category VARCHAR(25),
        item_rarity VARCHAR(25),
        item_price NUMERIC(10, 0) CHECK(item_price > 0),
        allowed_classes TEXT[]
    );

CREATE TABLE
    IF NOT EXISTS "IN_INVENTORY" (
        character_id VARCHAR(25) NOT NULL,
        item_id SERIAL NOT NULL,
        quantity int,
		PRIMARY KEY (character_id, item_id),
        FOREIGN KEY (character_id) REFERENCES "CHARACTER" (character_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (item_id) REFERENCES "ITEM" (item_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

CREATE TABLE
    IF NOT EXISTS "LISTING" (
        listing_id SERIAL PRIMARY KEY,
        character_id VARCHAR(25) NOT NULL,
        item_id SERIAL NOT NULL,
        quantity int NOT NULL CHECK(quantity >= 0),
        listing_date DATE NOT NULL,
        is_active BOOLEAN,
        sale_price NUMERIC(10, 0) CHECK(sale_price >= 0),
        FOREIGN KEY (character_id) REFERENCES "CHARACTER" (character_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (item_id) REFERENCES "ITEM" (item_id) ON DELETE CASCADE ON UPDATE CASCADE
		-- FOREIGN KEY (sale_price) REFERENCES "ITEM" (item_price) ON DELETE CASCADE ON UPDATE CASCADE --
    );

CREATE TABLE
    IF NOT EXISTS "TRANSACTION" (
        transaction_id CHAR(10) PRIMARY KEY,
        listing_id SERIAL,
		seller_id VARCHAR(25) NOT NULL,
		buyer_id VARCHAR(25) NOT NULL,
        total_price INT,
        transaction_date DATE,
		FOREIGN KEY (seller_id) REFERENCES "CHARACTER" (character_id) ON DELETE CASCADE ON UPDATE CASCADE,
		FOREIGN KEY (buyer_id) REFERENCES "CHARACTER" (character_id) ON DELETE CASCADE ON UPDATE CASCADE,
        FOREIGN KEY (listing_id) REFERENCES "LISTING" (listing_id) ON DELETE CASCADE ON UPDATE CASCADE
    );

-- Caluculate the total price value for the TRANSACTION table
CREATE OR REPLACE FUNCTION calculate_total_price()
RETURNS TRIGGER AS $$
BEGIN
	SELECT listing .quantity * listing.sale_price INTO NEW.total_price
	FROM "LISTING" as listing
	WHERE listing.listing_id = NEW.listing_id;
	RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- CREATE trigger if it does not exist
DO $$
BEGIN
	IF NOT EXISTS(
		SELECT 1 FROM pg_trigger
		WHERE tgname = 'set_total_price'
	) THEN 
		CREATE TRIGGER set_total_price
		BEFORE INSERT OR UPDATE ON "TRANSACTION"
		FOR EACH ROW
		EXECUTE FUNCTION calculate_total_price();
	END IF;
END $$;

-- Update total_price when TRANSACTION is updated
CREATE OR REPLACE FUNCTION update_total_price()
RETURNS TRIGGER AS $$
BEGIN
	UPDATE "TRANSACTION"
	SET total_price = NEW.quantity * NEW.sale_price
	WHERE listing_id = NEW.listing_id;
	RETURN NEW;
END; 
$$ LANGUAGE plpgsql;

DO $$
BEGIN
	IF NOT EXISTS(
		SELECT 1 FROM pg_trigger
		WHERE tgname = 'update_total_price'
	) THEN
		CREATE TRIGGER update_total_price
		AFTER UPDATE OF quantity, sale_price ON "LISTING"
		FOR EACH ROW
		EXECUTE FUNCTION update_total_price();
	END IF;
END $$;


		