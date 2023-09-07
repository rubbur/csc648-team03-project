const mysql = require('mysql2/promise');

const DATABASE_NAME = "SFSUtutors";


  // Create a connection pool after the database setup
   const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'CleveM3bby!',
    port: 3306,
    connectionLimit: 100,
    waitForConnections: true,
    database: DATABASE_NAME
   });

 

  module.exports = {db};

  //to interact with our mysql database, require the above db object into the file that needs it.
  //then follow this syntax: 
  
  /*db.getConnection((err, connection) => {
     ... (perform database operations)
  
     Release the connection back to the pool
    connection.release();
  }); */


