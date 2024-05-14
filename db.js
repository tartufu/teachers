const dotenv = require("dotenv");
dotenv.config();

const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT, // default Postgres port
  database: process.env.DB_NAME,
  ssl: process.env.DEV ? false : { rejectUnauthorized: false },
});

module.exports = {
  query: (text, params) => pool.query(text, params),
};
