-- Create a view of character transaction showing 
-- the item a character bought and the date
-- it was purchased.
CREATE OR REPLACE VIEW "CHARACTER_TRANSACTION" 
AS SELECT 
	C.character_name AS character, 
	I.item_name AS purchased_item, 
	T.quantity AS amount_purchased,
	L.sale_price AS selling_price,
	T.total_price AS total_price,
	T.transaction_date AS date_purchased
FROM 
	"CHARACTER" AS C 
	JOIN "TRANSACTION" AS T ON C.character_id = T.buyer_id
	JOIN "LISTING" AS L ON T.listing_id = L.listing_id
	JOIN "ITEM" AS I ON L.item_id = I.item_id;
	
-- Create a view of character inventory
-- that displays the character name, their
-- inventory, and the quantity of each item
CREATE OR REPLACE VIEW "CHARACTER_INVENTORY" 
AS SELECT 
	C.character_name AS character, 
	I.item_name AS item, 
	V.quantity AS quantity,
	IC.item_category AS category,
	IR.item_rarity as rarity
FROM 
	"CHARACTER" AS C 
	JOIN "IN_INVENTORY" AS V ON C.character_id = V.character_id
	JOIN "ITEM" I ON V.item_id = I.item_id
	JOIN "ITEM_CATEGORY" IC ON I.category_id = IC.category_id
	JOIN "ITEM_RARITY" IR ON I.rarity_id = IR.rarity_id;

-- Create a view of user and their
-- associated characters they own
CREATE OR REPLACE VIEW "USER_CHARACTER_INFO" 
AS SELECT 
	U.username AS username,
	U.email AS email,
	C.character_name AS character,
	CL.class_name AS class,
	C.exp_level AS level,
	C.gold_balance AS balance
FROM 
	"USER" U
	INNER JOIN "CHARACTER" C ON U.user_id = C.owner_id
	INNER JOIN "CLASS" CL ON C.character_class = CL.class_id;

-- Create a view detailing the item info
-- such as name, category, rarity, and
-- usable classes
CREATE OR REPLACE VIEW "ITEM_INFO" 
AS SELECT 
	I.item_name AS item,
	IC.item_category AS category,
	IR.item_rarity AS rarity,
	STRING_AGG(C.class_name, ', ') AS equipable_classes
FROM 
	"ITEM" I
	JOIN "ITEM_CATEGORY" IC ON I.category_id = IC.category_id
	JOIN "ITEM_RARITY" IR ON I.rarity_id = IR.rarity_id
	JOIN "ITEM_CLASS" ICN ON I.item_id = ICN.item_id
	JOIN "CLASS" C ON ICN.class_id = C.class_id
	GROUP BY I.item_name, IC.item_category, IR.item_rarity;

-- Create a view of the item market 
-- displaying active item, default price,
-- quantity, selling price, and unit price
CREATE OR REPLACE VIEW "ITEM_MARKET"
AS SELECT
	I.item_name AS item,
	I.item_price AS default_price,
	L.quantity AS quantity,
	L.sale_price AS market_price,
	FLOOR(L.sale_price / L.quantity) AS unit_price,
	L.is_active AS status
FROM "ITEM" I
JOIN "LISTING" L ON I.item_id = L.item_id AND L.is_active = TRUE;
