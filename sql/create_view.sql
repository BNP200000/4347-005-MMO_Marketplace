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
	END IF;
END $$;