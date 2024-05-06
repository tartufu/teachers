const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./db/migrations", // Directory to store migration files
  },
  // Specify UUID data type for PostgreSQL
  typeCast: function (field, next) {
    if (field.type === "uuid") {
      return field.string();
    }
    return next();
  },
};
