const { Pool } = require("pg");

// TO RUN LOCALLY, CHANGE DATABASE AND PASSWORD FIELDS.
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "<DATABASE>",
  password: "<PASSWORD>",
  port: 5432,
});

// Get the user id from the username
export const getUserId = async (username: string) => {
  const res = await pool.query(
      `SELECT user_id FROM "USER" WHERE username = $1`, 
      [username]
  );
  if(res.rows.length === 0) {
    throw new Error(`User ${username} does not exist`);
  }
  return res.rows[0].user_id;
};

export const getCharacterId = async (character_name: string) => {
  const res = await pool.query(
    `SELECT character_id FROM "CHARACTER" WHERE character_name = $1`, 
    [character_name]
);
if(res.rows.length === 0) {
  throw new Error(`Character ${character_name} does not exist`);
}
return res.rows[0].character_id;
};

// Get the class id from the class name
export const getClassId = async (classname: string) => {
  const res = await pool.query(
      `SELECT class_id FROM "CLASS" WHERE class_name = $1`, 
      [classname]
  );
  if(res.rows.length === 0) {
    throw new Error(`Class ${classname} does not exist`);
  }
  return res.rows[0].class_id;
};

// Get the party leader id from the leader name
export const getLeaderId = async (leader: string, tableName: string) => {
  if(tableName === "CHARACTER") {
    const char_res = await pool.query(
      `SELECT party_leader 
      FROM "PARTY" AS P 
      JOIN "CHARACTER" AS C ON P.party_leader = C.character_id
      WHERE C.character_name = $1`,
      [leader]
    );
    if(char_res.rows.length === 0) {
      throw new Error(`Party Leader ${leader} does not exist`);
    }
    return char_res.rows[0].party_leader;
  } else if(tableName === "PARTY") {
    const party_res = await pool.query(
      `SELECT character_id
      FROM "CHARACTER" AS C
      WHERE C.character_name = $1`,
      [leader]
    );
    if(party_res.rows.length === 0) {
      throw new Error(`Character ${leader} does not exist`);
    }
    return party_res.rows[0].character_id;
  } else {
    throw new Error("ERROR");
  }
};

export const getItemId = async (item_name: string) => {
  const res = await pool.query(
    `SELECT item_id FROM "ITEM" WHERE item_name = $1`, 
    [item_name]
  );
  if(res.rows.length === 0) {
    throw new Error(`Item ${item_name} does not exist`);
  }
  return res.rows[0].item_id;
};

export const getCategoryId = async (category_type: string) => {
  const res = await pool.query(
    `SELECT category_id FROM "ITEM_CATEGORY" WHERE category_type = $1`,
    [category_type]
  );
  if(res.rows.length === 0) {
    throw new Error(`Item Category ${category_type} does not exist`);
  }
  return res.rows[0].category_id
}

export const getRarityId = async (rarity_type: string) => {
  const res = await pool.query(
    `SELECT rarity_id FROM "ITEM_RARITY" WHERE rarity_type = $1`,
    [rarity_type]
  );
  if(res.rows.length === 0) {
    throw new Error(`Item Rarity ${rarity_type} does not exist`);
  }
  return res.rows[0].rarity_id
}

export default pool;
