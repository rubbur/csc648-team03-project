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
    const results = await db.query(q, [username]);
    //check if the hashed password matches the passwordhash in the row from the first query.
    bcrypt.compare(password, results[0][0].hashed_password, function (err, result) {
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
          if(results[0]){
            //the user is verified
            //add to the session that the user is loggedIn
            req.session.isLoggedIn = true;
            req.session.isAuthenticated = true;
            console.log(req.session);
            req.session.isAdmin = results[0][0].isAdmin;
            res.send({ success: true, username: results[0][0].username, isTutor: results[0][0].istutor  });
          }
        }
      }
    );
  } catch (err) {
    console.log("error occurred in the try block" + err);
    
    res.send({ success: false, error:  "" +err });
  }
};

const register = async (req, res) =>{  
    //get the username and password out of the request
    const username = req.body.username;
    const password = req.body.password;
    const isTutor = req.body.isTutor;
    console.log(username, password, isTutor);
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
                q = "INSERT INTO users (username, hashed_password, istutor) VALUES (?, ?, ?)";
                const result = await db.query(q, [username, hash, isTutor]);
                console.log("User inserted successfully!");
                res.send({success: true, username: username, isTutor: isTutor});
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

const logout = async (req, res) =>{
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.send({success: false});
    }
    else {
      console.log("logged out successfully");
      //TODO: clear cookies
      //for example 
      res.clearCookie("sfsuCookies");
      res.send({success: true});
    }
  });
}


//given a name or a fragment of a name, if nothing goes wrong returns object that looks like: 
/*{
    "success": true,
    "searchResults": [
        {
            "id": 1,
            "isadmin": 0,
            "istutor": 0,
            "username": "Cleveland"
        },
        {
            "id": 6,
            "isadmin": 0,
            "istutor": 0,
            "username": "Flea"
        }
    ]
}*/
//if something does go wrong, then will return {success: false, error: err}
const searchByName = async (req, res) =>{
  //get the name to search by
  const searchName = `%${req.body.name}%`;
  //create the query string. The % wildcard matches to 0 or more characters.
  const q = "SELECT * FROM users WHERE username LIKE ?";

  try{
    const result = await db.query(q, [searchName]);
    let userList = result[0];
    //do not give the hashed_passwords of any of the users to the client
    for(let i =0; i< userList.length; i++){
     delete userList[i].hashed_password;
    }
    res.send({success: true, searchResults: userList});
  }catch(err){
    console.log(err);
    res.send({success: false, error: err});
  }
}



module.exports = {login, register, logout, searchByName};
