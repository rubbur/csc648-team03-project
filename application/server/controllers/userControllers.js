//Author: Cleveland Plonsey
//controllers for user routes. These controllers are invoked when the client sends http requests
//and the endpoint starts with "/user/"

const db = require("../config/database/dbConnection");
const bcrypt = require("bcrypt"); //npm password hashing module
const fs = require('fs'); //for moving image and video files around.


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
            req.session.isAdmin = results[0][0].isadmin;
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


const editPassword = async (req, res) =>{
  
  const {password, newPassword, username} = req.body;
  console.log("updating password with newPassword: ", newPassword, username);
  const saltRounds = 10;
  //make sure that the user has the correct username and password
  let q = "SELECT * FROM users WHERE username = ?";
  
  try {
    const results = await db.query(q, [username]);
    if(results[0].length == 0){
      res.send({success: false, errorMessage: "Your username or password are incorrect"});
    }
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
            errorMessage: "The password for this user is incorrect!",
          });
        } else {
          if(results[0]){
            //the user is verified
            //hash the new password
            bcrypt.hash(newPassword, saltRounds, async function(err, hash) {
              // Store hash in your password DB.
              if(err){
                  console.log("error when trying to hash the password" + err);
                  res.send({success: false, error: err});
              }
              q = "UPDATE users SET hashed_password = ? WHERE username = ?";

              try{
                db.query(q, [hash, username]);
                res.send({success: true});
              } catch (e) {
                console.log("error updating password");
                res.send({success: false, errorMessage: e+""});
              }
          });
        }
      }
    });
  } catch (err) {
    console.log("error occurred in the try block" + err);
   // res.send({ success: false, error:  "" +err });
  }
}

const logout = async (req, res) =>{
  console.log("logging out");
  
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


const getUserData = async (req, res) =>{
  const username = req.body.username;
  console.log("in get user data");
  //get the user from the database
  try{
    const q = "SELECT * FROM users WHERE username = ?";
    const userData = await db.query(q, [username]);
    if(userData[0].length == 0){
      res.send({success: false, error: "user does not exist in database"});
      return;
  }
  else{
    res.send({success: true, userData: userData[0]});
  }
  
  } catch(err){
    console.log("error getting user data: " + err);
    res.send({success:false, errorMessage: err});
  }
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
  const q = "SELECT * FROM users WHERE username LIKE ? AND ispending = 0";

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

const editUsername = async (req, res) =>{
  
  const username = req.body.username;
  const newName = req.body.newUserName;
  console.log("editing user: " + username)
  //check to see if the new username is available
  let q = "SELECT * FROM users WHERE username = ?";
  //verify that the username is available
  try{
      const usernameQuery = await db.query(q, [newName]);
      //if there already exists a user in the table then this username is not available
      if(usernameQuery[0].length !== 0){
          res.send({success: false, error: "username is taken already"});
          console.log("got here");
          return;
      }
    } catch(error){
      console.log("error trying to check the username for uniqueness: " + error);
      res.send({success:false, errorMessage: error + ""});
    }
   

  q = "UPDATE users SET username = ? WHERE username = ?";

  try{
    await db.query(q, [newName, username]);
    res.send({success:true});
  } catch(error) {
    console.log("error trying to update username: " + error);
    res.send({success: false, errorMessage: error + ""});
  }
}


const uploadImage = async (req, res) =>{
  const {file}  = req.files;
  const username = req.body.username;
  if(file.mimetype.substring(0, 5) !== "image"){ //should be ex: image/jpg or image/png 
    res.send({success: false, errorMessage: "cannot upload a non image file here."})
  }
  // const newFileName = username + "." + file.mimetype.substring(6); 
  const newFileName = username + ".png" ; 
  //move the file into the userImages folder
  file.mv( `../tutor-app/public/userImages/${newFileName}`, async (err) => {
    console.log(err);
    if (err){ 
      res.send({success: false, errorMessage: err})
    }

    //update the user table so that the relative path of the image is stored in the database
    const q = "UPDATE users SET img_url = ?, ispending = 1 WHERE username = ?";
    try{
      const updateRes =  await db.query(q, [`/userImages/${newFileName}`, username]);
      res.send({ success: true});
    }
    catch(err){
      console.log("error doing insert query" + err);
     // res.send({success: false, errorMessage: err});
    }

   
  });
}



module.exports = {login, register, logout, searchByName, uploadImage, getUserData, editUsername, editPassword};
