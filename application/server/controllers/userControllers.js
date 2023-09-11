//Author: Cleveland Plonsey
//controllers for user routes. These controllers are invoked when the client sends http requests
//and the endpoint starts with "/user/"

const db = require("../config/database/dbConnection");
const bcrypt = require("bcrypt"); //npm password hashing module



const login = async (req, res) => {
  //get the email address and the password out of the request
  const username = req.body.username;
  const password = req.body.password;
  const q = "SELECT * FROM users WHERE username = ?";
  //find the user in the user table by email.
  try {
    const result = await db.query(q, [username]);

    //check if the hashed password matches the passwordhash in the row from the first query.
    bcrypt.compare(password, result[0][0].hashed_password, function (err, result) {
        if (err) {
          console.log("error occurred during bcrypt comparing " + err );
          res.send({ success: false, error: err });
        }
        if (!result) { //password does not match
          console.log("the password does not match our records")
          res.send({
            success: false,
            error: "The password for this user is incorrect!",
          });
        } else {
          //the user is verified
          //add to the session that the user is loggedIn
          req.session.isLoggedIn = true;

          res.send({ success: true });
        }
      }
    );
  } catch (err) {
    res.send({ success: false, error: err });
  }
};

const register = async (req, res) =>{  
    //get the username and password out of the request
    const username = req.body.username;
    const password = req.body.password;
    console.log(username, password);
    const saltRounds = 10; //for password hashing
    let q = "SELECT * FROM users WHERE username = ?";
    //verify that the username is available
    try{
        const usernameQuery = await db.query(q, [username]);
        //if there already exists a user in the table then this username is not available
        if(usernameQuery[0].length != 0){
            res.send({success: false, error: "username is taken already"});
            return;
        }
        //hash the password before putting it in the database
        bcrypt.hash(password, saltRounds, async function(err, hash) {
            // Store hash in your password DB.
            if(err){
                console.log("error when trying to hash the password" + password);
                res.send({success: false, error: err});
            }
            try{
                //store the new user in the database
                q = "INSERT INTO users (username, hashed_password) VALUES (?, ?)";
                const result = await db.query(q, [username, hash]);
                console.log("User inserted successfully!");
                res.send({success: true});
            }
            catch(err){
                console.log("error inserting user");
            }
            
        });
    }
    catch(error){
        console.log(error);
        res.send({success: false, error: error});
    }
}




module.exports = {login, register};
