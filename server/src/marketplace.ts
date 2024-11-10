import pool from "./dbConfig";
import { getUserId, getCharacterId, getClassId, getLeaderId, getItemId, getCategoryId, getRarityId } from "./dbConfig";
import { v4 as uuidv4 } from "uuid";

// Format QUERY display for certain tables
const formatQuery = (tableName: string) => {
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
                C.character_name AS character,
                I.item_name AS item,
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

const handleCharacterInsert = async (columns: string[], values: any[]) => {
  const insertCols = [...columns];
  const insertValues = [...values];

  const ownerIdx = columns.indexOf("owner");
  if (ownerIdx === -1) {
    throw new Error("Owner could not be found");
  }
  const ownerName = values[ownerIdx];
  const ownerId = await getUserId(ownerName);
  insertCols[ownerIdx] = "owner_id";
  insertValues[ownerIdx] = ownerId;

  const classIdx = columns.indexOf("class");
  if (classIdx === -1) {
    throw new Error("Class could not be found");
  }
  const className = values[classIdx];
  const classId = await getClassId(className);
  insertCols[classIdx] = "character_class";
  insertValues[classIdx] = classId;

  const leaderIdx = columns.indexOf("leader");
  if (leaderIdx === -1) {
    throw new Error("Leader could not be found");
  }
  insertCols[leaderIdx] = "leader_id";
  if (values[leaderIdx] !== null) {
    const leader = values[leaderIdx];
    const leaderId = await getLeaderId(leader, "CHARACTER");
    insertValues[leaderIdx] = leaderId;
  } else {
    insertValues[leaderIdx] = null;
  }

  const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO "CHARACTER"
                  (${insertCols.join(", ")}) 
                  VALUES (${placeholders}) 
                  RETURNING *`;
  return { query, value: insertValues };
};

const handleFriendInsert = async (columns: string[], values: any[]) => {
  const insertCols = [...columns];
  const insertValues = [...values];

  const characterIdx = columns.indexOf("character");
  if (characterIdx === -1) {
    throw new Error("Character could not be found");
  }
  const chararacterName = values[characterIdx];
  const characterId = await getCharacterId(chararacterName);
  insertCols[characterIdx] = "character_a_id";
  insertValues[characterIdx] = characterId;

  const friendIdx = columns.indexOf("friend");
  if (friendIdx === -1) {
    throw new Error("Friend could not be found");
  }
  const friendName = values[friendIdx];
  const friendId = await getCharacterId(friendName);
  insertCols[friendIdx] = "character_b_id";
  insertValues[friendIdx] = friendId;

  const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO "CHARACTER_FRIEND"
                  (${insertCols.join(", ")}) 
                  VALUES (${placeholders}) 
                  RETURNING *`;
  return { query, value: insertValues };
};

const handlePartyInsert = async (columns: string[], values: any[]) => {
  const insertCols = [...columns];
  const insertValues = [...values];

  const leaderIdx = columns.indexOf("party_leader");
  if (leaderIdx === -1) {
    throw new Error("Character could not be found");
  }
  const leader = values[leaderIdx];
  const leaderId = await getLeaderId(leader, "PARTY");
  insertValues[leaderIdx] = leaderId;

  const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO "PARTY"
                  (${insertCols.join(", ")}) 
                  VALUES (${placeholders}) 
                  RETURNING *`;
  return { query, value: insertValues };
}

const handleItemInsert = async (columns: string[], values: any[]) => {
  const insertCols = [...columns].filter(
    col => col !== "allowed_classes"
  );
  const insertValues = [...values].filter(
    (_, idx) => columns[idx] !== "allowed_classes"
  );

  const categoryIdx = columns.indexOf("item_category");
  if (categoryIdx === -1) {
    throw new Error("Item category not found");
  }
  const category = values[categoryIdx];
  const categoryId = await getCategoryId(category);
  insertCols[categoryIdx] = "category_id";
  insertValues[categoryIdx] = categoryId;

  const rarityIdx = columns.indexOf("item_rarity");
  if (rarityIdx === -1) {
    throw new Error("Item rarity not found");
  }
  const rarity = values[rarityIdx];
  const rarityId = await getRarityId(rarity);
  insertCols[rarityIdx] = "rarity_id";
  insertValues[rarityIdx] = rarityId;

  const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO "ITEM"
                  (${insertCols.join(", ")}) 
                  VALUES (${placeholders}) 
                  RETURNING *`;

  return { query, value: insertValues };
};

const handleItemUpdate = async (columns: string[], values: any[]) => {
};

const handleInventoryOrListingInsert = async (columns: string[], values: any[]) => {
  const insertCols = [...columns];
  const insertValues = [...values];

  const characterIdx = columns.indexOf("character");
  if (characterIdx === -1) {
    throw new Error("Character could not be found");
  }
  const characterName = values[characterIdx];
  const characterId = await getCharacterId(characterName);
  insertCols[characterIdx] = "character_id";
  insertValues[characterIdx] = characterId;

  const itemIdx = columns.indexOf("item");
  if (itemIdx === -1) {
    throw new Error("Item could not be found");
  }
  const itemName = values[itemIdx];
  const itemId = await getItemId(itemName);
  insertCols[itemIdx] = "item_id";
  insertValues[itemIdx] = itemId;

  const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO "${insertCols.includes("quantity") ? "IN_INVENTORY" : "LISTING"}"
                  (${insertCols.join(", ")}) 
                  VALUES (${placeholders}) 
                  RETURNING *`;
  return { query, value: insertValues };
};

const handleTransactionInsert = async (columns: string[], values: any[]) => {
  const insertCols = [...columns];
  const insertValues = [...values];

  const listingIdx = columns.indexOf("listing_id");
  if (listingIdx === -1) {
    throw new Error("Listing ID could not be found");
  }
  const listingId = values[listingIdx];

  const sellerIdx = columns.indexOf("seller");
  if (sellerIdx === -1) {
    throw new Error("Seller could not be found");
  }
  const sellerName = values[sellerIdx];
  const sellerId = await getCharacterId(sellerName);
  insertCols[sellerIdx] = "seller_id";
  insertValues[sellerIdx] = sellerId;

  const buyerIdx = columns.indexOf("buyer");
  if (buyerIdx === -1) {
    throw new Error("Buyer could not be found");
  }
  const buyerName = values[buyerIdx];
  const buyerId = await getCharacterId(buyerName);
  insertCols[buyerIdx] = "buyer_id";
  insertValues[buyerIdx] = buyerId;

  // Check if the seller is on the LISTING table
  const listCheck = `SELECT 1 FROM "LISTING" WHERE character_id = $1 and listing_id = $2`
  const listRes = await pool.query(listCheck, [sellerId, listingId]);
  if (listRes.rowCount === 0) {
    throw new Error(`Seller ${sellerName} is not listed in the LISTING table`);
  }

  const placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO "TRANSACTION"
                  (${insertCols.join(", ")}) 
                  VALUES (${placeholders}) 
                  RETURNING *`;
  return { query, value: insertValues };
};

const handleItemClassInsert = async (tableName: string, columns: string[], values: any[], data: Record<string, any>) => {
  if (tableName === "ITEM") {
    const classesIdx = columns.indexOf("allowed_classes");
    if (classesIdx !== -1) {
      const classes = values[classesIdx];
      const insertClasses = classes.map(async (className) => {
        const classId = await getClassId(className);
        return pool.query(`INSERT INTO "ITEM_CLASS" (item_id, class_id) VALUES ($1, $2)`, [data.item_id, classId]);
      });
      await Promise.all(insertClasses);
    }
  }
}

const getTable = async (tableName: string, displayFormat: string) => {
  try {
    const query = formatQuery(tableName);
    const results = await pool.query(query);
    if (results && results.rows.length > 0) {
      return results.rows;
    } else {
      throw new Error("No results found");
    }
  } catch (error) {
    throw new Error("Internal server error");
  }
};

const createRecord = async (tableName: string, data: Record<string, any>) => {
  const columns = Object.keys(data);
  const values = Object.values(data);

  if (columns.length === 0 || values.length === 0) {
    throw new Error("No columns or values provided");
  }

  // Generate UUID values for the primary key of the tables
  if (!["ITEM", "LISTING", "ITEM_CATEGORY", "ITEM_RARITY"].includes(tableName) && columns[0].endsWith("_id")) {
    values[0] = uuidv4();
  }

  try {
    let handler;
    switch (tableName) {
      case "CHARACTER":
        handler = handleCharacterInsert;
        break;
      case "CHARACTER_FRIEND":
        handler = handleFriendInsert;
        break;
      case "PARTY":
        handler = handlePartyInsert;
        break;
      case "ITEM":
        handler = handleItemInsert;
        console.log("APPLE");
        break;
      case "IN_INVENTORY":
      case "LISTING":
        handler = handleInventoryOrListingInsert;
        break;
      case "TRANSACTION":
        handler = handleTransactionInsert;
        break;
    }

    let query, insertValues;

    if (handler) {
      ({ query, value: insertValues } = await handler(columns, values));
    } else {
      const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
      query = `INSERT INTO "${tableName}" 
              (${columns.join(", ")}) 
              VALUES (${placeholders})
              RETURNING *`;
      insertValues = values;
    }

    return await new Promise(function (resolve, reject) {
      pool.query(query, insertValues, async (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        if (results && results.rows) {
          const row = results.rows[0];
          resolve(`Added ${JSON.stringify(row)} to ${tableName}`);


          // Add the list of classes that are allowed to an item into
          // the ITEM_CLASS table
          await handleItemClassInsert(tableName, columns, values, row);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch (error) {
    throw new Error("Internal server error");
  }
};


module.exports = {
  getTable,
  createRecord,
};
