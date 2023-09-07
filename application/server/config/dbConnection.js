const mysql = require('mysql2');

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "CleveM3bby!",
  port: 3306
});


//do this in any file to connect to the database.  
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

//and call db.close when work is done.
//db.close()

module.exports = {db};