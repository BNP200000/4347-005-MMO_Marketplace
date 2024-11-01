const { Pool } = require("pg");

// TO RUN LOCALLY, CHANGE DATABASE AND PASSWORD FIELDS.
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "<DATABASE>",
  password: "<PASSWORD>",
  port: 5432,
});

export default pool;
