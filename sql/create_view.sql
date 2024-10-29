-- Create a view of user transaction showing 
-- the item a character bought and the date
-- it was purchased.
DO $$
BEGIN
	IF NOT EXISTS (
		SELECT 1
		FROM pg_views
		WHERE viewname = 'USER_TRANSACTION'
	) THEN
		CREATE VIEW "USER_TRANSACTION" 
			AS SELECT 
				character_name AS character, 
				item_name AS purchased_item, 
				quantity AS amount_purchased,
				sale_price AS selling_price,
				total_price AS total_price,
				transaction_date AS date_purchased
			FROM 
				"CHARACTER" AS character 
				JOIN "TRANSACTION" AS transaction ON character.character_id = transaction.buyer_id
				JOIN "LISTING" AS list ON transaction.listing_id = list.listing_id
				JOIN "ITEM" AS item ON list.item_id = item.item_id;
	END IF;
END $$;