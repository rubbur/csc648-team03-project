//Author: Cleveland Plonsey
//date: 9/3/2023
//controllers for user routes. These controllers are invoked when the client sends http requests
//and the endpoint starts with "/admin/"
//these controllers are for priviledged users only

const db = require("../config/database/dbConnection");
const bcrypt = require("bcrypt");

const verifyAdmin = async (req, res) => {
  //check if the user has the admin authentication
  if (!req.session.isAdmin) res.send({ success: false });
  else res.send({ success: true });
};

//delete a user by their id
const deleteUser = async (req, res) => {
  //get the userId
  const id = req.body.userId;
  const q = "DELETE FROM users WHERE id = ?";

  try {
    const deleteRes = await db.query(q, [id]);
    res.send({ success: true });
  } catch (err) {
    console.log("catch block err when trying to delete user: " + err);
    res.send({ success: false, errorMessage: err });
  }
};

//edit a user. If the username is going to be edited, checks if the new username is available and rejects if it isn't
//if the password is to be updated, hashes the password first
//TODO: once image urls are implemented, update this function to allow updating of this new column
const editUser = async (req, res) => {
  const {
    userId,
    newPassword,
    newUsername,
    oldUsername,
    newIsTutor,
    newImgUrl,
    newIsPending,
  } = req.body;
  console.log(newIsTutor);
  console.log(newImgUrl);
  console.log(req.body);
  let updateResult;
  const saltRounds = 10;

  //if the admin is trying to update the username
  if (oldUsername != newUsername) {
    //make sure that the new username is available
    let q = "SELECT * FROM users WHERE username = ?";
    try {
      const usernameQuery = await db.query(q, [newUsername]);
      //if there already exists a user in the table then this username is not available
      if (usernameQuery[0].length != 0) {
        res.send({
          success: false,
          errorMessage: "This email address is already in use",
        });
        return;
      }
    } catch (err) {
      console.log(
        "error when trying to execute find user by username query: " + err,
      );
    }
  }
  //if the admin is trying to change the password:
  if (newPassword != undefined) {
    //hash the new password
    bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
      // Store hash in your password DB.
      if (err) {
        console.log("error when trying to hash the password" + password);
        res.send({ success: false, error: err });
      }
      try {
        //update the user
        q =
          "UPDATE users SET username = ?, hashed_password = ?, isTutor = ?, img_url = ?, ispending = ? WHERE id = ?";
        updateResult = await db.query(q, [
          newUsername,
          hash,
          newIsTutor,
          newImgUrl,
          newIsPending,
          userId,
        ]);
        res.send({ success: true });
      } catch (err) {
        console.log("error updating user:" + err);
      }
    });
  } else {
    q =
      "UPDATE users SET username = ?, isTutor = ?, img_url = ?, ispending = ? WHERE id = ?";
    try {
      updateResult = await db.query(q, [
        newUsername,
        newIsTutor,
        newImgUrl,
        newIsPending,
        userId,
      ]);
      res.send({ success: true });
    } catch (err) {
      console.log("error updating user:" + err);
      res.send({ success: false });
    }
  }
};

//returns all users in the database (including BOTH tutors and students and the admin)
const getAllUsers = async (req, res) => {
  const q = "SELECT * FROM users";

  try {
    const result = await db.query(q);
    res.send({ success: true, allUsers: result[0] });
  } catch (err) {
    console.log("error in get All Users " + err);
    res.send({ success: false, errorMessage: err });
  }
};

module.exports = { verifyAdmin, deleteUser, editUser, getAllUsers };
