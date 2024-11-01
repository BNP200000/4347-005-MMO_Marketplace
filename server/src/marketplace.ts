import pool from "./dbConfig";

const getTable = async (tableName: string) => {
  try {
    let query = `SELECT * FROM "${tableName}";`;

    if (tableName === "ITEM") {
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
    }

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

  const placeholders = columns.map((_, i) => `$${i + 1}`).join(", ");
  const query = `INSERT INTO "${tableName}" (${columns.join(
    ", "
  )}) VALUES (${placeholders}) RETURNING *`;

  try {
    return await new Promise(function (resolve, reject) {
      pool.query(query, values, (error, results) => {
        if (error) {
          reject(error);
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
