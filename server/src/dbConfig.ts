const { Pool } = require("pg");

// TO RUN LOCALLY, CHANGE DATABASE AND PASSWORD FIELDS.
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "MMO_Marketplace",
  password: "Platinum32$",
  port: 5432,
});

export default pool;
