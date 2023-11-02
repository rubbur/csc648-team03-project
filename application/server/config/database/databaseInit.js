//Author: Cleveland Plonsey
//date: 9/3/2023
//purpose: script that initializes the database and creates the tables if they do not exist
//This file is out of date! Do not run this file. It is only here for reference.

const mysql = require("mysql2/promise");

const DATABASE_NAME = "SFSUtutors";

// Create a connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "CleveM3bby!",
  database: "mysql", // This is the default database used for administrative tasks
  waitForConnections: true,
  connectionLimit: 100,
  queueLimit: 0,
});

//creates the database if it does not exist and creates the user table as well
const createDatabaseAndTable = async () => {
  try {
    // Create the database if it doesn't exist
    await pool.query(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);

    // Switch to the newly created/existing database
    await pool.query(`USE ${DATABASE_NAME}`);

    // Create the "users" table if it doesn't exist
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
          id INT AUTO_INCREMENT PRIMARY KEY,
          username VARCHAR(255) NOT NULL,
          email VARCHAR(255) NOT NULL,
          passwordhash BINARY(60) NOT NULL
        )
      `);

    console.log("Database and table created successfully!");
  } catch (error) {
    console.error("Error:", error);
  } finally {
    //This connection pool's only purpose was to setup the database schema. we are done with this pool.
    pool.end();
  }
};

createDatabaseAndTable();

module.exports = { createDatabaseAndTable };
