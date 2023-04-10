const mysql = require("mysql");

const db_config = mysql.createConnection({
  host: "localhost",
  port: 3308,
  user: "root",
  password: "",
  database: "crud_api",
});

module.exports = db_config;
