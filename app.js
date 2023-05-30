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

// for application/x-www-form-urlencoded
app.use(express.urlencoded({extended: true})); // built-in middleware
// for application/json
app.use(express.json()); // built-in middleware
// for multipart/form-data (required with FormData)
app.use(multer().none()); // requires the "multer" module

// gets a list of vehicles matching filter parameters
app.get("/vehicles", async function(req, res) {
  let maxPrice = req.query["maxPrice"];
  let type = req.query["type"];
  try {
    if (maxPrice && type) {
      let query = "SELECT name FROM vehicles WHERE price <= ?"
      let db = await getDBConnection();
      let results;
      if (maxPrice === "none") {
        maxPrice = Infinity;
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
      await db.close();
      console.log(results);
      res.type("text").send(results);
    } else {
      res.type("text").status(400).send("Missing a Filter Parameter");
    }
  } catch (err) {
    res.type("text").status(500).send("Something on the server went wrong!");
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