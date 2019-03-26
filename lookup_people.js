const pg = require("pg");
const settings = require("./settings"); // settings.json

const client = new pg.Client({
  user: settings.user,
  password: settings.password,
  database: settings.database,
  host: settings.hostname,
  port: settings.port,
  ssl: settings.ssl
});

const searchPar = process.argv.slice(2);

// Formats the date back to what example shows

function formatDate(date) {
  let formattedDate = new Date(date),
    month = formattedDate.getMonth() + 1,
    day = formattedDate.getDate(),
    year = formattedDate.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("-");
}

// Outputs the number of matches and lists the matches

function resultPresenter(result) {
  console.log(
    "Found " +
      result.length +
      " person(s)" +
      " by the name " +
      "'" +
      searchPar +
      "':"
  );
  for (const instance of result) {
    console.log(
      result.indexOf(instance) +
        1 +
        "- " +
        instance.first_name +
        " " +
        instance.last_name +
        ", " +
        "born " +
        formatDate(instance.birthdate)
    );
  }
}

const myQuery = {
  text: "SELECT * FROM famous_people WHERE first_name=$1",
  values: searchPar
};

client.connect(err => {
  if (err) {
    return console.error("Connection Error", err);
  }
  client.query(myQuery, (err, result) => {
    if (err) {
      return console.error("error running query", err);
    }
    resultPresenter(result.rows);
    client.end();
  });
});
