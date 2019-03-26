const settings = require("./settings");
const knex = require("knex")({
  client: "pg",
  connection: {
    user: settings.user,
    password: settings.password,
    database: settings.database,
    host: settings.hostname,
    port: settings.port,
    ssl: settings.ssl
  }
});

// Extracting command line arguments
const newFirst = process.argv[2];
const newLast = process.argv[3];
const newDate = process.argv[4];

// Insert method with a callback function that outputs the db
knex("famous_people")
  .insert({ first_name: newFirst, last_name: newLast, birthdate: newDate })
  .asCallback(function(err, rows) {
    if (err) return console.error(err);
    console.log(rows);
    knex.destroy();
  });
