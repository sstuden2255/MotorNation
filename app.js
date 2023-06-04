/**
 * Names: Simon Studen, Vincent Kao
 * Date: May 1, 2023
 * Section: CSE 154
 *
 * this is the node file for our final project and will provide information based on
 * user requests
 */
"use strict";

const express = require("express");
const app = express();

const multer = require("multer");

const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");

const cookieParser = require("cookie-parser");

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

// for cookies
app.use(cookieParser());

// gets a list of vehicles matching filter parameters
app.get("/vehicles", async function(req, res) {
  let maxPrice = req.query["maxPrice"];
  let type = req.query["type"];
  try {
    if (maxPrice && type) {
      let query = "SELECT name FROM vehicles WHERE price <= ?";
      let db = await getDBConnection();
      let results;
      if (maxPrice === "none") {
        maxPrice = "binary-double-infinity"; // infinity for SQL
      } else {
        maxPrice = parseFloat(maxPrice);
      }
      if (type === "all") {
        query += " ORDER BY name;";
        results = await db.all(query, maxPrice);
      } else {
        query += " AND type LIKE ? ORDER BY name;";
        results = await db.all(query, maxPrice, type);
      }
      let cars = "";
      for (let i = 0; i < results.length; i++) {
        cars += results[i]["name"] + "\n";
      }
      await db.close();
      res.type("text").send(cars);
    } else {
      res.type("text").status(400).send("Missing a Filter Parameter");
    }
  } catch (err) {
    res.type("text").status(500).send("Something on the server went wrong!");
  }
});

// gets information of a specific vehicle
app.get("/vehicles/:vehicle_name", async function(req, res) {
  const name = req.params["vehicle_name"];
  try {
    let query = "SELECT * FROM vehicles WHERE name = ?";
    let db = await getDBConnection();
    let results = await db.get(query, name);
    res.type("json").send(results);
  } catch (err) {
    res.type("text").status(500).send("Something on the server went wrong!");
  }
});

// gets a lists of reviews of a vehicle
app.get("/reviews/:vehicle_name", async function(req, res) {
  const name = req.params["vehicle_name"];
  try {
    let query = "SELECT user, rating, comment, date FROM reviews WHERE vehicle = ? ORDER BY date DESC";
    let db = await getDBConnection();
    let results = await db.all(query, name);
    await db.close();
    res.type("json").send(results);
  } catch (err) {
    res.type("text").status(500).send("Something on the server went wrong!");
  }
});

// posts a new review for a vehicle
app.post("/reviews/new", async function(req, res) {
  const name = req.body["vehicle"];
  const user = req.body["user"];
  const rating = parseInt(req.body["rating"]);
  const comment = req.body["comment"];
  try {
    if (name && user && rating && comment) {
      let query = "SELECT user FROM transactions WHERE user = ? AND vehicle = ?;";
      let db = await getDBConnection();
      let results = await db.get(query, [user, name]);
      if (results) {
        query = "INSERT INTO reviews (vehicle, user, rating, comment) VALUES (?, ?, ?, ?);";
        results = await db.run(query, [name, user, rating, comment]);
        query = "SELECT user, rating, comment, date FROM reviews WHERE id = ?"
        results = await db.get(query, results["lastID"]);
        await db.close();
        res.type("json").send(results);
      } else {
        await db.close();
        res.type("text").status(400).send("You have not purchased this vehicle.");
      }
    } else {
      res.type("text").status(400).send("Not enough information provided to leave review.");
    }
  } catch (err) {
    res.type("text").status(500).send("Something on the server went wrong!");
  }
});

// creates a new user
app.post("/account/create", async function(req, res) {
  const username = req.body["username"], email = req.body["email"], password = req.body["password"];
  try {
    if (username && email && password) {
      let db = await getDBConnection();
      let results = await db.get("SELECT * FROM users WHERE email = ?;", email);
      if (results) {
        await db.close();
        res.type("text").status(400).send("An account with that email address already exists.");
      } else {
        let userNameExist = await checkUserName(username);
        if (userNameExist) {
          await db.close();
          res.type("text").status(400).send("Username already taken");
        } else {
          let query = "INSERT INTO users (username, email, password, balance) VALUES (?, ?, ?, ?);";
          results = await db.run(query, [username, email, password, 0]);
          query = "SELECT username, password FROM users WHERE id = ?;";
          results = await db.get(query, results["lastID"]);
          await db.close();
          res.type("json").send(results);
        }
      }
    } else {
      res.type("text").status(400).send("A field is missing!");
    }
  } catch (err) {
    res.type("text").status(500).send("Something on the server went wrong!");
  }
});

// user log in
app.post("/login", async function(req, res) {
  const username = req.body["username"];
  const password = req.body["password"];
  try {
    if (username && password) {
      let query = "SELECT * FROM users WHERE username = ? AND password = ?;";
      let db = await getDBConnection();
      let results = await db.get(query, [username, password]);
      await db.close();
      if (results) {
        const expirationDate = "Fri, 31 Dec 9999 23:59:59 GMT";
        res.cookie("username", username , { expires: new Date(expirationDate) });
        res.type("text").send("Logged In Seccussfully");
      } else {
        res.type("text").status(400).send("The username/password is incorrect");
      }
    } else {
      res.type("text").status(400).send("A field is missing!");
    }
  } catch (err) {
    res.type("text").status(500).send("Something on the server went wrong!");
  }
});

// returns a user's balance
app.post("/balance", async function(req, res) {
  const user = req.body["user"];
  res.type("text");
  try {
    if (user) {
      let query = "SELECT balance FROM users WHERE username = ?;";
      let db = await getDBConnection();
      let results = await db.get(query, user);
      await db.close();
      if (results) {
        res.send("" + results["balance"]);
      } else {
        res.status(400).send("Username does not exist.");
      }
    } else {
      res.status(400).send("Not logged In");
    }
  } catch (err) {
    res.status(500).send("Something on the server went wrong!");
  }
});

// deposit into a user's account
app.post("/deposit", async function(req, res) {
  const user = req.body["user"];
  const amount = parseInt(req.body["amount"]);
  res.type("text");
  try {
    if (!user) {
      res.status(400).send("Not logged in");
    } else if (!amount) {
      res.status(400).send("Insert deposit amount");
    } else {
      let query = "UPDATE users SET balance = balance + ? WHERE username LIKE ?;";
      let db = await getDBConnection();
      await db.run(query, [amount, user]);
      await db.close();
      res.send("Deposit Successful");
    }
  } catch (err) {
    res.status(500).send("Something on the server went wrong!");
  }
});

// returns the transaction history of a user
app.post("/account/history", async function(req, res) {
  const user = req.body["user"];
  try {
    if (user) {
      let query = "SELECT vehicle, date, code FROM transactions WHERE user = ? ORDER BY date DESC;";
      let db = await getDBConnection();
      let results = await db.all(query, user);
      await db.close();
      res.type("json").send(results);
    } else {
      res.type("text").status(400).send("Not Logged In");
    }
  } catch (err) {
    res.status(500).send("Something on the server went wrong!");
  }
});

/**
 * Checks if a user exist in the database
 * @param {string} username - provided username
 * @returns {boolean} whether a username exists in the database
*/
async function checkUserName(username) {
  try {
    let query = "SELECT username FROM users WHERE username = ?";
    let db = await getDBConnection();
    let results = await db.get(query, username);
    return results;
  } catch (err) {
    return false;
  }
}

/**
 * Establishes a database connection to the database and returns the database object.
 * Any errors that occur should be caught in the function that calls this one.
 * @returns {sqlite3.Database} - The database object for the connection.
 */
async function getDBConnection() {
  const db = await sqlite.open({
    filename: "vehicles.db",
    driver: sqlite3.Database
  });
  return db;
}

app.use(express.static("public"));
const PORT = process.env.PORT || 8000;
app.listen(PORT);