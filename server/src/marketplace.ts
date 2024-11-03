import pool from "./dbConfig";
import {getUserId, getCharacterId, getClassId, getLeaderId, getItemId} from "./dbConfig";
import { v4 as uuidv4 } from "uuid";

// Format QUERY display for certain tables
const formatQuery = (tableName: string) => {
    let query = `SELECT * FROM "${tableName}";`;

    switch(tableName) {
        case "CHARACTER":
            query = `SELECT
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
                "CHARACTER" AS L ON L.character_id = C.leader_id;`;
            break;
        case "PARTY":
            query = `SELECT 
                P.party_name,
                C.character_name as party_leader,
                P.party_balance
            FROM "${tableName}" AS P
            LEFT JOIN
                "CHARACTER" AS C ON C.character_id = P.party_leader;`;
            break;
        case "CHARACTER_FRIEND":
            query = `SELECT
                A.character_name AS character,
                B.character_name AS friend
            FROM "${tableName}" AS F
            LEFT JOIN
                "CHARACTER" AS A ON F.character_a_id = A.character_id
            LEFT JOIN
                "CHARACTER" AS B ON F.character_b_id = b.character_id;`;
            break;
        case "ITEM":
            query = `SELECT 
                I.item_id, 
                I.item_name, 
                I.item_category,
                I.item_rarity,
                I.item_price,
                STRING_AGG(C.class_name, ', ') AS allowed_classes
            FROM "${tableName}" AS I
            LEFT JOIN "CLASS" AS C ON C.class_id = ANY(I.allowed_classes)
            GROUP BY 
                I.item_id, 
                I.item_name, 
                I.item_category,
                I.item_rarity,
                I.item_price
            ORDER BY I.item_id;`;
            break;
        case "IN_INVENTORY":
            query = `SELECT
                C.character_name AS character,
                I.item_name AS item,
                V.quantity
            FROM "${tableName}" AS V
            LEFT JOIN 
                "CHARACTER" AS C ON C.character_id = V.character_id
            LEFT JOIN
                "ITEM" AS I ON I.item_id = V.item_id;`;
            break;
        case "LISTING":
            query = `SELECT
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
                "ITEM" AS I ON I.item_id = L.item_id;`;
            break;
        case "TRANSACTION":
            query = `SELECT
                T.transaction_id,
                T.listing_id,
                S.character_name as seller,
                B.character_name as buyer,
                T.total_price,
                T.transaction_date
            FROM "${tableName}" AS T
            LEFT JOIN
                "CHARACTER" AS S ON S.character_id = T.seller_id
            LEFT JOIN
                "CHARACTER" AS B ON B.character_id = T.buyer_id;`;
            break;
    }

    return query;
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
  let columns = Object.keys(data);
  let values = Object.values(data);

  if (columns.length === 0 || values.length === 0) {
    throw new Error("No columns or values provided");
  }

  // Generate UUID values for the primary key of the tables
  if(!["ITEM", "LISTING"].includes(tableName) && columns[0].endsWith("_id")) {
    values[0] = uuidv4();
  }

  try {
    // Base insert
    let placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    let query = `INSERT INTO "${tableName}"
                  (${columns.join(", ")}) 
                  VALUES (${placeholders}) 
                  RETURNING *`;

    // Modified insert based on the table
    if(tableName === "CHARACTER") {
      const insertCols = [...columns];
      const insertValues = [...values];

      const ownerIdx = columns.indexOf("owner");
      if(ownerIdx === -1) {
        throw new Error("Owner could not be found");
      }
      const ownerName = values[ownerIdx];
      const ownerId = await getUserId(ownerName);
      insertCols[ownerIdx] = "owner_id";
      insertValues[ownerIdx] = ownerId;

      const classIdx = columns.indexOf("class");
      if(classIdx === -1) {
        throw new Error("Class could not be found");
      }
      const className = values[classIdx];
      const classId = await getClassId(className);      
      insertCols[classIdx] = "character_class";
      insertValues[classIdx] = classId;

      const leaderIdx = columns.indexOf("leader");
      if(leaderIdx === -1) {
        throw new Error("Leader could not be found");
      }
      insertCols[leaderIdx] = "leader_id";
      if(values[leaderIdx] !== null) {
        const leader = values[leaderIdx];
        const leaderId = await getLeaderId(leader, tableName);
        insertValues[leaderIdx] = leaderId;
      } else {
        insertValues[leaderIdx] = null;
      }

      placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
      query = `INSERT INTO "${tableName}"
                (${insertCols.join(", ")})
                VALUES (${placeholders})
                RETURNING *`;
      values = insertValues;
    } else if(tableName === "CHARACTER_FRIEND") {
      const insertCols = [...columns];
      const insertValues = [...values];

      const characterIdx = columns.indexOf("character");
      if(characterIdx === -1) {
        throw new Error("Character could not be found");
      } 
      const chararacterName = values[characterIdx];
      const characterId = await getCharacterId(chararacterName);
      insertCols[characterIdx] = "character_a_id";
      insertValues[characterIdx] = characterId;

      const friendIdx = columns.indexOf("friend");
      if(friendIdx === -1) {
        throw new Error("Friend could not be found");
      }
      const friendName = values[friendIdx];
      const friendId = await getCharacterId(friendName);
      insertCols[friendIdx] = "character_b_id";
      insertValues[friendIdx] = friendId;

      placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
      query = `INSERT INTO "${tableName}"
                (${insertCols.join(", ")})
                VALUES (${placeholders})
                RETURNING *`;
      values = insertValues;
    } else if(tableName === "PARTY") {
      const insertCols = [...columns];
      const insertValues = [...values];
      
      const leaderIdx = columns.indexOf("party_leader");
      if(leaderIdx === -1) {
        throw new Error("Character could not be found");
      }
      const leader = values[leaderIdx];
      const leaderId = await getLeaderId(leader, tableName);
      insertValues[leaderIdx] = leaderId;

      placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
      query = `INSERT INTO "${tableName}"
                (${insertCols.join(", ")})
                VALUES (${placeholders})
                RETURNING *`;
      values = insertValues; 
    } else if(tableName === "ITEM") {
      const insertCols = [...columns];
      const insertValues = [...values];

      const classesIdx = columns.indexOf("allowed_classes");
      if(classesIdx === -1) {
        throw new Error("Allowed classes could not be found");
      }
      const classes = values[classesIdx];

      const retrieve = classes.map(async (className) => {
        const classId = await getClassId(className);
        return classId;
      });

      const classIds = await Promise.all(retrieve);
      console.log(`Is array? ${Array.isArray(classIds)}`);
      insertValues[classesIdx] = classIds;

      placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
      query = `INSERT INTO "${tableName}"
                (${insertCols.join(", ")})
                VALUES (${placeholders})
                RETURNING *`;
      values = insertValues;

      console.log(`Column: ${insertCols}`);
      console.log(`Values: ${insertValues}`);
    } else if(["IN_INVENTORY", "LISTING"].includes(tableName)) {
      const insertCols = [...columns];
      const insertValues = [...values];

      const characterIdx = columns.indexOf("character");
      if(characterIdx === -1) {
        throw new Error("Character could not be found");
      }
      const characterName = values[characterIdx];
      const characterId = await getCharacterId(characterName);
      insertCols[characterIdx] = "character_id";
      insertValues[characterIdx] = characterId;

      const itemIdx = columns.indexOf("item");
      if(itemIdx === -1) {
        throw new Error("Item could not be found");
      }
      const itemName = values[itemIdx];
      const itemId = await getItemId(itemName);
      insertCols[itemIdx] = "item_id";
      insertValues[itemIdx] = itemId;

      placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
      query = `INSERT INTO "${tableName}"
                (${insertCols.join(", ")})
                VALUES (${placeholders})
                RETURNING *`;
      values = insertValues;
    } else if(tableName === "TRANSACTION") {
      const insertCols = [...columns];
      const insertValues = [...values];

      const sellerIdx = columns.indexOf("seller");
      if(sellerIdx === -1) {
        throw new Error("Seller could not be found");
      }
      const sellerName = values[sellerIdx];
      const sellerId = await getCharacterId(sellerName);
      insertCols[sellerIdx] = "seller_id";
      insertValues[sellerIdx] = sellerId;

      const buyerIdx = columns.indexOf("buyer");
      if(sellerIdx === -1) {
        throw new Error("Buyer could not be found");
      }
      const buyerName = values[buyerIdx];
      const buyerId = await getCharacterId(buyerName);
      insertCols[buyerIdx] = "buyer_id";
      insertValues[buyerIdx] = buyerId;

      // Check if the seller is on the LISTING table
      const listCheck = `SELECT 1 FROM "LISTING" WHERE character_id = $1`
      const listRes = await pool.query(listCheck, [sellerId]);
      if(listRes.rowCount === 0) {
        throw new Error(`Seller ${sellerName} is not listed in the LISTING table`);
      }

      placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
      query = `INSERT INTO "${tableName}"
                (${insertCols.join(", ")})
                VALUES (${placeholders})
                RETURNING *`;
      values = insertValues;
    }

    return await new Promise(function (resolve, reject) {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject("TEST");
          return;
        }

        if (results && results.rows) {
          resolve(`Added ${JSON.stringify(results.rows[0])} to ${tableName}`);
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
