import pool from "./dbConfig";

// Format QUERY display for certain tables
const formatQuery = (tableName: string) => {
    let query = `SELECT * FROM "${tableName}";`;

    switch(tableName) {
        case "CHARACTER":
            query = `SELECT
                C.character_id,
                C.exp_level,
                C.character_name,
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

const getUserId = async (username: string) => {
  const res = await pool.query(
      `SELECT user_id FROM "USER" WHERE username = $1`, 
      [username]
  );
  if(res.rows.length === 0) {
    throw new Error(`User ${username} does not exist`);
  }
  return res.rows[0].user_id;
};

const getClassId = async (classname: string) => {
  const res = await pool.query(
      `SELECT class_id FROM "CLASS" WHERE class_name = $1`, 
      [classname]
  );
  if(res.rows.length === 0) {
    throw new Error(`Class ${classname} does not exist`);
  }
  return res.rows[0].class_id;
};

const createRecord = async (tableName: string, data: Record<string, any>) => {
  console.log(`INSERTING into ${tableName}`);
  
  let columns = Object.keys(data);
  let values = Object.values(data);

  if (columns.length === 0 || values.length === 0) {
    throw new Error("No columns or values provided");
  }

  try {
    let placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
    let query = `INSERT INTO "${tableName}"
                  (${columns.join(", ")}) 
                  VALUES (${placeholders}) 
                  RETURNING *`;

    if(tableName === "CHARACTER") {
      const insertCols = [...columns];
      const insertValues = [...values];

      const ownerIdx = columns.indexOf("owner");
      if(ownerIdx !== -1) {
        const ownerName = values[ownerIdx];
        const ownerId = await getUserId(ownerName);
        insertValues[ownerIdx] = ownerId;
      }

      const classIdx = columns.indexOf("class");
      if(classIdx !== -1) {
        const className = values[classIdx];
        const classId = await getClassId(className);
        insertValues[classIdx] = classId;
      }

      placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
      query = `INSERT INTO "${tableName}"
                (${insertCols.join(", ")})
                VALUES (${placeholders})
                RETURNING *`;
      values = insertValues;
    } else if(tableName === "PARTY") {
      const nameIdx = columns.indexOf("party_leader");
      if(nameIdx === -1) {
        throw new Error("party_leader must be specified");
      }

      const leaderName = values[nameIdx];
      const getLeaderIdQuery = `SELECT character_id 
                                FROM "CHARACTER" 
                                WHERE character_name = $1;`;
      const leaderRes = await pool.query(getLeaderIdQuery, [leaderName]);
      if(leaderRes.rowCount === 0) {
        throw new Error(`Character ${leaderName} does not exist in the "CHARACTER" table`);
      }

      const leaderId = leaderRes.rows[0].character_id;
      const insertCols = columns.filter((col) => col !== "party_leader");
      values = values.filter((_, i) => columns[i] !== "party_leader");
      values.unshift(leaderId);

      placeholders = insertCols.map((_, i) => `$${i + 1}`).join(", ");
      query = `INSERT INTO "${tableName}"
                (${insertCols.join(", ")})
                VALUES (${placeholders}) 
                RETURNING *`;
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
  //createUser,
  //deleteUser
};
