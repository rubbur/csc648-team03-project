const mysql = require('mysql2/promise');
require('dotenv').config();
;


  // Create a connection pool after the database setup
   const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    connectionLimit: 100,
    waitForConnections: true,
    database: process.env.DB_DATABASE_NAME
   });

 

  module.exports = db;

  //to interact with our mysql database, require the above db object into the file that needs it.
  //then follow this syntax: 
  
  /*db.getConnection((err, connection) => {
     ... (perform database operations)
  
     Release the connection back to the pool
    connection.release();
  }); */


