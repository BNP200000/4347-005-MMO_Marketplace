// Format QUERY display for certain tables
export const formatQuery = (tableName: string) => {
    const formatted_queries = {
      "CHARACTER": `SELECT
                  C.character_id,
                  C.character_name,
                  C.exp_level,
                  C.gold_balance,
                  U.username as owner, 
                  P.class_name as class,
                  L.character_name as leader
              FROM "${tableName}" AS C
              LEFT JOIN
                  "USER" AS U ON U.user_id = C.owner_id
              LEFT JOIN
                  "CLASS" AS P ON P.class_id = C.character_class
              LEFT JOIN   
                  "CHARACTER" AS L ON L.character_id = C.leader_id;`,
  
      "PARTY": `SELECT 
                  P.party_name,
                  C.character_name as party_leader,
                  P.party_balance
              FROM "${tableName}" AS P
              LEFT JOIN
                  "CHARACTER" AS C ON C.character_id = P.party_leader;`,
  
      "CHARACTER_FRIEND": `SELECT
                  A.character_name AS character,
                  B.character_name AS friend
              FROM "${tableName}" AS F
              LEFT JOIN
                  "CHARACTER" AS A ON F.character_a_id = A.character_id
              LEFT JOIN
                  "CHARACTER" AS B ON F.character_b_id = b.character_id;`,
  
      "ITEM": `SELECT 
                  I.item_id, 
                  I.item_name, 
                  IC.item_category AS item_category,
                  IR.item_rarity AS item_rarity,
                  I.item_price,
                  STRING_AGG(C.class_name, ', ') AS allowed_classes
              FROM "${tableName}" AS I
              LEFT JOIN "ITEM_CATEGORY" AS IC ON IC.category_id = I.category_id
              LEFT JOIN "ITEM_RARITY" AS IR ON IR.rarity_id = I.rarity_id
              LEFT JOIN "ITEM_CLASS" AS IT ON IT.item_id = I.item_id
              LEFT JOIN "CLASS" AS C ON C.class_id = IT.class_id
              GROUP BY
                I.item_id,
                I.item_name,
                IC.item_category,
                IR.item_rarity,
                I.item_price
              ORDER BY
                I.item_id;`,
      
      "IN_INVENTORY": `SELECT
                  C.character_name AS character,
                  I.item_name AS item,
                  V.quantity
              FROM "${tableName}" AS V
              LEFT JOIN 
                  "CHARACTER" AS C ON C.character_id = V.character_id
              LEFT JOIN
                  "ITEM" AS I ON I.item_id = V.item_id;`,
  
  "LISTING": `SELECT
                  L.listing_id,
                  L.character_id,
                  C.character_name AS character_name,
                  L.item_id,
                  I.item_name AS item_name,
                  L.quantity,
                  L.listing_date,
                  L.is_active,
                  L.sale_price
              FROM "${tableName}" AS L
              LEFT JOIN
                  "CHARACTER" AS C ON C.character_id = L.character_id
              LEFT JOIN
                  "ITEM" AS I ON I.item_id = L.item_id;`,
  
      "TRANSACTION": `SELECT
                  T.transaction_id,
                  T.listing_id,
                  S.character_name as seller,
                  B.character_name as buyer,
                  T.quantity as quantity,
                  T.total_price,
                  T.transaction_date
              FROM "${tableName}" AS T
              LEFT JOIN
                  "CHARACTER" AS S ON S.character_id = T.seller_id
              LEFT JOIN
                  "CHARACTER" AS B ON B.character_id = T.buyer_id;`
    };
  
    return formatted_queries[tableName] || `SELECT * FROM "${tableName}"`;
}