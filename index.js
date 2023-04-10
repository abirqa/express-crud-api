const express = require("express");
const port = 5001;
const db_connect = require("./database/db_config");
const cors = require("cors");
const bodyParser = require("body-parser");

//Initialize Express app//
const app = express();

//Initialize Middleware//
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  if (!db_connect) {
    throw err;
    console.log("DB Connection not successfull");
  } else {
    res.status(200).send("DB Connection Successfull");
  }
});

/****** INSERT USER API LOGIC *******/

app.post("/api/newUser", (req, res) => {
  //get the request body from user//
  const { name, email, password, phone } = req.body;

  db_connect.query(
    "INSERT INTO `users`(`name`, `email`, `password`, `phone`) VALUES (?, ?, ?, ?)",
    [name, email, password, phone],
    (err, results) => {
      if (err) {
        throw err;
        res.status(500).send({ message: "New User Creation Failed !!" });
      } else {
        res.status(200).send({ message: "User Account Creation Successfull" });
      }
    }
  );
});

/****** GET ALL USERS LOGIC  *******/

app.get("/api/allUsers", (req, res) => {
  db_connect.query("SELECT * FROM `users`", (err, result) => {
    try {
      res
        .status(200)
        .send({ message: "Users Data Fetched Successfully", data: result });
    } catch {
      throw err;
      console.log(err);
      res.status(500).send({ message: "Users Data Can't Fetch from Server" });
    }
  });
});

/********** GET USER BY ID **********/

app.get("/api/getUser/:id", (req, res) => {
  // GET THE ID FROM USER //
  const id = req.params.id;

  db_connect.query(
    "SELECT * FROM `users` WHERE `id` = ?",
    id,
    (error, results) => {
      try {
        if (results.length === 0) {
          res.status(404).send({ message: "User ID Not Found!!!" });
        } else {
          res.status(200).send({ message: "User Data Found", data: results });
        }
      } catch {
        throw err;
        res.status(500).send({ message: "User Data Not Found" });
      }
    }
  );
});

/*************** GET USER BY NAME ******************/

app.get("/api/getUserByName/:name", (req, res) => {
  const name = req.params.name;

  db_connect.query(
    "SELECT * FROM `users` WHERE `name` = ? ",
    name,
    (err, results) => {
      try {
        if (results.length === 0) {
          res.status(400).send({ message: `User Not Found with name ${name}` });
        } else {
          res
            .status(200)
            .send({ message: "User Data Found with name", data: results });
        }
      } catch {
        throw err;
        res.status(500).send({ message: "User Data Cannot Found with Name" });
      }
    }
  );
});

/*************** GET USER DATA BY MULTIPLE NAMES ******************/

app.get("/api/getUserByNames/", (req, res) => {
  const names = req.query.name.split(",");
  console.log(names);

  db_connect.query(
    "SELECT * FROM `users` WHERE `name` IN (?) ",
    [names],
    (err, results) => {
      try {
        if (results.length === 0) {
          res.status(400).send({ message: `No User Found with name ${names}` });
        } else {
          res
            .status(200)
            .send({ message: "User Data Found with name", data: results });
        }
      } catch {
        throw err;
        res.status(500).send({ message: "User Data Cannot Found with Name" });
      }
    }
  );
});

//Listen to port number//
app.listen(port, () => {
  console.log(`Server Listenning on Port ${port}`);
});
