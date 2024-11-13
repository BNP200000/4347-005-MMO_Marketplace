import pool from "./dbConfig";
import * as insert from "./handleInsert";
import { v4 as uuidv4 } from "uuid";
import { formatQuery } from "./handleQuery";
import * as update from "./handleUpdate";

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

  if(columns.length === 0 || values.length === 0) {
    throw new Error("No columns or values provided");
  }

  // Generate UUID values for the primary key of the tables
  if(!["ITEM", "LISTING", "ITEM_CATEGORY", "ITEM_RARITY"].includes(tableName) && columns[0].endsWith("_id")) {
    values[0] = uuidv4();
  }

  try {
    let handler;
    switch(tableName) {
      case "CHARACTER":
        handler = insert.handleCharacterInsert;
        break;
      case "CHARACTER_FRIEND":
        handler = insert.handleFriendInsert;
        break;
      case "PARTY":
        handler = insert.handlePartyInsert;
        break;
      case "ITEM":
        handler = insert.handleItemInsert;
        break;
      case "IN_INVENTORY":
      case "LISTING":
        handler = insert.handleInventoryOrListingInsert;
        break;
      case "TRANSACTION":
        handler = insert.handleTransactionInsert;
        break;
    }

    let query, insertValues;

    if(handler) {
      ({query, value: insertValues} = await handler(columns, values));
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
          await insert.handleItemClassInsert(tableName, columns, values, row);
        } else {
          reject(new Error("No results found"));
        }
      });
    });
  } catch(error) {
    console.log(`ERROR: ${error}`);
    throw new Error("Internal server error");
  }
};

const deleteRecord = async (tableName: string, data: Record<string, any>) => {
  const columns = Object.keys(data);
  const values = Object.values(data);

  const conditions = columns.map((col, index) => 
    `"${col}" = $${index + 1}`
  ).join(" AND ");

  const query = `DELETE FROM "${tableName}" 
                  WHERE ${conditions};`
  
  return await new Promise((resolve, reject) => {
    pool.query(query, values, async (error, results) => {
      if (error) {
        reject(error);
        return;
      }

      if(results && results.rowCount > 0) {
        resolve(`Deleted ${results.rowCount} record(s) from ${tableName}`);
      } else {
        reject(new Error("No records were deleted"));
      }
    })
  });
};

const updateRecord = async (tableName: string, data: Record<string, any>) => {
  const columns = Object.keys(data);
  const values = Object.values(data);

  try {
    let handler;
    switch(tableName) {
      case "LISTING":
        handler = update.handleListingUpdate;
        break;
      default:
        throw new Error(`Handler has not been made for "${tableName}" yet`);
    }

    let query, insertValues;
    ({query, value: insertValues} = await handler(columns, values));

    return await new Promise(function (resolve, reject) {
      pool.query(query, insertValues, async (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        if (results && results.rowCount > 0) {
          resolve(`Updated ${results.rowCount} record(s) in ${tableName}`);
        } else {
          reject(new Error("No results found"));
        }
      })
    });
  } catch(error) {
    console.log(`ERROR: ${error}`);
    throw new Error("Internal server error");
  }
}; 




module.exports = {
  getTable,
  createRecord,
  deleteRecord,
  updateRecord
};
