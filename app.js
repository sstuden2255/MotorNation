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

//
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
        query += ";";
        results = await db.all(query, maxPrice);
      } else {
        query += " AND type LIKE ?;";
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
    let results = await db.all(query, "test");
    await db.close();
    res.type("json").send(results);
  } catch (err) {
    res.type("text").status(500).send("Something on the server went wrong!");
  }
});

// posts a new review for a vehicle
app.post("/reviews/new/:vehicle_name", async function(req, res) {
  const name = req.params["vehicle_name"];
  console.log(name);
  try {
    const login = req.cookies["loggedIn"];
    await reviewEligibilityCheck();
    res.type("text").send("ok");
  } catch (err) {
    console.log(err);
  }

});


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