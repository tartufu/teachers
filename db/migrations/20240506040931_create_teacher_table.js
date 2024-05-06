const tableName = "teacher";

exports.up = async function (knex) {
  const exists = await knex.schema.hasTable(tableName);

  if (!exists) {
    return await knex.schema.createTable(tableName, function (table) {
      table.uuid("id").primary().defaultTo(knex.raw("uuid_generate_v4()")); // Generates a UUID using PostgreSQL's uuid_generate_v4() function
      table.string("username");
      table.string("email");
      table.boolean("is_deleted").defaultTo(false);
      table.timestamps(true, true);
    });
  }
};

exports.down = function (knex) {
  return knex(tableName).del();
};
