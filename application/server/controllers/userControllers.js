//Author: Cleveland Plonsey
//date: 9/3/2023
//controllers for user routes. These controllers are invoked when the client sends http requests
//and the endpoint starts with "/user/"

const db = require("../config/database/dbConnection");
const bcrypt = require("bcrypt"); //npm password hashing module
const fs = require("fs"); //for moving image and video files around.

const login = async (req, res) => {
  //get the email address and the password out of the request
  const username = req.body.username;
  const password = req.body.password;
  const q = "SELECT * FROM users WHERE username = ?";
  //find the user in the user table by email.
  if (!(username && password)) {
    res.send({
      success: false,
      error: "Username and/or password were not provided",
    });
    return;
  }
  try {
    const results = await db.query(q, [username]);
    if (results[0].length == 0) {
      res.send({
        success: false,
        error: "Your username or password are incorrect",
      });
      return;
    }
    //check if the hashed password matches the passwordhash in the row from the first query.
    bcrypt.compare(
      password,
      results[0][0].hashed_password,
      function (err, result) {
        if (err) {
          console.log("error occurred during bcrypt comparing " + err);
          res.send({ success: false, error: err });
        }
        if (!result) {
          //password does not match
          res.send({
            success: false,
            error: "Your username or password are incorrect",
          });
        } else {
          if (results[0]) {
            //the user is verified
            //add to the session that the user is loggedIn
            req.session.isLoggedIn = true;
            req.session.isAuthenticated = true;
            console.log(req.session);
            req.session.isAdmin = results[0][0].isadmin;
            console.log("the id we found was: " + results[0][0].id);
            res.send({
              success: true,
              username: results[0][0].username,
              isTutor: results[0][0].istutor,
              userId: results[0][0].id,
            });
          }
        }
      },
    );
  } catch (err) {
    console.log("error occurred in the try block" + err);

    res.send({ success: false, error: "" + err });
  }
};

const register = async (req, res) => {
  // Get the username and password out of the request
  const username = req.body.username;
  const password = req.body.password;
  if (!(username && password)) {
    res.send({
      success: false,
      error: "username and/or password were not provided",
    });
  }
  const isTutor = 0;
  const saltRounds = 10; // for password hashing

  // Verify that the username is available
  try {
    const usernameQuery = await db.query(
      "SELECT * FROM users WHERE username = ?",
      [username],
    );

    // If there already exists a user in the table, then this username is not available
    if (usernameQuery[0].length !== 0) {
      res.send({
        success: false,
        error: "This email address is already in use",
      });
      return;
    }

    // Hash the password before putting it in the database
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      if (err) {
        console.log("error when trying to hash the password: " + password);
        res.send({ success: false, error: "internal server error" });
      }

      try {
        // Store the new user in the database
        const result = await db.query(
          "INSERT INTO users (username, hashed_password, istutor) VALUES (?, ?, ?)",
          [username, hash, isTutor],
        );
        console.log("User inserted successfully!");

        // Query the user's id from the database
        const userQuery = await db.query(
          "SELECT id FROM users WHERE username = ?",
          [username],
        );
        const userId = userQuery[0][0].id;

        // Set the user's id in the cookie
        req.session.isLoggedIn = true;
        res.send({
          success: true,
          username: username,
          isTutor: isTutor,
          userId: userId,
        });
      } catch (err) {
        console.log("error inserting user");
        res.send({ success: false, error: "internal server error" });
      }
    });
  } catch (error) {
    console.log(error);
    res.send({ success: false, error: "internal server error" });
  }
};

const editPassword = async (req, res) => {
  const { password, newPassword, username } = req.body;
  console.log("updating password with newPassword: ", newPassword, username);
  const saltRounds = 10;
  //make sure that the user has the correct username and password
  let q = "SELECT * FROM users WHERE username = ?";

  try {
    const results = await db.query(q, [username]);
    if (results[0].length == 0) {
      res.send({
        success: false,
        errorMessage: "Your username or password are incorrect",
      });
    }
    //check if the hashed password matches the passwordhash in the row from the first query.
    bcrypt.compare(
      password,
      results[0][0].hashed_password,
      function (err, result) {
        if (err) {
          console.log("error occurred during bcrypt comparing " + err);
          res.send({ success: false, error: err });
        }
        if (!result) {
          //password does not match
          console.log("the password does not match our records");
          res.send({
            success: false,
            errorMessage: "The password for this user is incorrect!",
          });
        } else {
          if (results[0]) {
            //the user is verified
            //hash the new password
            bcrypt.hash(newPassword, saltRounds, async function (err, hash) {
              // Store hash in your password DB.
              if (err) {
                console.log("error when trying to hash the password" + err);
                res.send({ success: false, error: err });
              }
              q = "UPDATE users SET hashed_password = ? WHERE username = ?";

              try {
                db.query(q, [hash, username]);
                res.send({ success: true });
              } catch (e) {
                console.log("error updating password");
                res.send({ success: false, errorMessage: e + "" });
              }
            });
          }
        }
      },
    );
  } catch (err) {
    console.log("error occurred in the try block" + err);
    // res.send({ success: false, error:  "" +err });
  }
};

const logout = async (req, res) => {
  console.log("logging out");

  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.send({ success: false });
    } else {
      console.log("logged out successfully");

      res.clearCookie("isLoggedIn");
      res.clearCookie("isTutor");
      res.clearCookie("userId");
      res.clearCookie("userName");
      res.send({ success: true });
    }
  });
};

const createPost = async (req, res) => {
  const { tutor_id, subject, description, hourly_rate, name } = req.body;
  const isPending = 1;
  let date = new Date();
  let currentTime = date.toISOString().split(/[- :]/).join("").slice(0, 14);
  let q =
    "INSERT INTO tutor_posts (tutor_id, subject, description, hourly_rate, name, is_pending, creation_date) VALUES (?, ?, ?, ?, ?, ?, ?)";
  try {
    const result = await db.query(q, [
      tutor_id,
      subject,
      description,
      hourly_rate,
      name,
      isPending,
      currentTime,
    ]);
    const postId = result[0].insertId;
    console.log("Post inserted successfully. postid: " + postId);
    res.send({ success: true, postId }); // Include the postId in the response
  } catch (err) {
    console.log("Error inserting post: " + err);
    res.send({ success: false, error: err });
  }
};

const getUserData = async (req, res) => {
  const username = req.body.username;
  //get the user from the database
  try {
    const q = "SELECT * FROM users WHERE username = ?";
    const userData = await db.query(q, [username]);
    if (userData[0].length == 0) {
      res.send({ success: false, error: "user does not exist in database" });
      return;
    } else {
      res.send({ success: true, userData: userData[0] });
    }
  } catch (err) {
    console.log("error getting user data: " + err);
    res.send({ success: false, errorMessage: err });
  }
};

const getUserDataById = async (req, res) => {
  const userId = req.body.userId;
  //get the user from the database
  try {
    const q = "SELECT * FROM users WHERE id = ?";
    const userData = await db.query(q, [userId]);
    if (userData[0].length == 0) {
      res.send({ success: false, error: "user does not exist in database" });
      return;
    } else {
      res.send({ success: true, userData: userData[0] });
    }
  } catch (err) {
    console.log("error getting user data: " + err);
    res.send({ success: false, errorMessage: err });
  }
};

const getConversations = async (req, res) => {
  const { userId } = req.body;
  const q =
    "SELECT * FROM messages WHERE sender_id = ? OR recipient_id = ? ORDER BY date_stamp DESC";
  try {
    let messages = await db.query(q, [userId, userId]);
    messages = messages[0];
    let conversations = new Map();
    for (let i = 0; i < messages.length; i++) {
      if (!conversations.has(messages[i].thread_id)) {
        conversations.set(messages[i].thread_id, new Array());
      }
      conversations.get(messages[i].thread_id).push(messages[i]);
    }

    let senderData = [];
    for (let [_key, value] of conversations) {
      if (userId == value[0].sender_id) {
        senderId = value[0].recipient_id;
      } else {
        senderId = value[0].sender_id;
      }
      let dataObj = {};
      const q = "SELECT users.img_url, users.username FROM users WHERE id = ?";
      let data = await db.query(q, [senderId]);
      dataObj.img_url = data[0][0].img_url;
      dataObj.username = data[0][0].username;
      let q2 = "SELECT subject FROM tutor_posts WHERE post_id = ?";
      data = await db.query(q2, value[0].post_id);
      dataObj.subject = data[0][0].subject;
      dataObj.thread_id = value[0].thread_id;
      dataObj.date_stamp = value[0].date_stamp;

      senderData.push(dataObj);
    }

    let mapObj = {};
    for (let [key, value] of conversations) {
      mapObj[key] = value;
    }

    res.send({
      success: true,
      messages: messages,
      conversations: mapObj,
      senderData: senderData,
    });
  } catch (err) {
    console.log("error getting messages: " + err);
    res.send({ success: false, errorMessage: err });
  }
};

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
const searchByName = async (req, res) => {
  //get the name to search by
  const searchName = `%${req.body.name}%`;
  //create the query string. The % wildcard matches to 0 or more characters.
  const q = "SELECT * FROM users WHERE username LIKE ? AND ispending = 0";

  try {
    const result = await db.query(q, [searchName]);
    let userList = result[0];
    //do not give the hashed_passwords of any of the users to the client
    for (let i = 0; i < userList.length; i++) {
      delete userList[i].hashed_password;
    }
    res.send({ success: true, searchResults: userList });
  } catch (err) {
    console.log(err);
    res.send({ success: false, error: err });
  }
};

const editUsername = async (req, res) => {
  const username = req.body.username;
  const newName = req.body.newUserName;
  console.log("editing user: " + username);
  //check to see if the new username is available
  let q = "SELECT * FROM users WHERE username = ?";
  //verify that the username is available
  try {
    const usernameQuery = await db.query(q, [newName]);
    //if there already exists a user in the table then this username is not available
    if (usernameQuery[0].length !== 0) {
      res.send({
        success: false,
        error: "This email address is already in use",
      });
      console.log("got here");
      return;
    }
  } catch (error) {
    console.log("error trying to check the username for uniqueness: " + error);
    res.send({ success: false, errorMessage: error + "" });
  }

  q = "UPDATE users SET username = ? WHERE username = ?";

  try {
    await db.query(q, [newName, username]);
    res.send({ success: true });
  } catch (error) {
    console.log("error trying to update username: " + error);
    res.send({ success: false, errorMessage: error + "" });
  }
};

const uploadImage = async (req, res) => {
  const { file } = req.files;
  const userId = req.body.id;
  if (file.mimetype.substring(0, 5) !== "image") {
    //should be ex: image/jpg or image/png
    res.send({
      success: false,
      errorMessage: "cannot upload a non image file here.",
    });
  }
  // const newFileName = username + "." + file.mimetype.substring(6);
  const newFileName = userId + ".png";

  //move the file into the userImages folder and copy to build folder

  file.mv(`../tutor-app/public/userImages/${newFileName}`, async (err) => {
    console.log(err);
    if (err) {
      res.send({ success: false, errorMessage: err });
    }

    const sourceFilePath = `../tutor-app/public/userImages/${newFileName}`;
    const destinationFilePath = `../tutor-app/build/userImages/${newFileName}`;
    fs.copyFile(sourceFilePath, destinationFilePath, async (err) => {
      if (err) {
        console.error(err);
        res.send({ success: false, errorMessage: err });
        return;
      }
    });

    //update the user table so that the relative path of the image is stored in the database
    const q = "UPDATE users SET img_url = ?, ispending = 1 WHERE id = ?";
    try {
      const updateRes = await db.query(q, [
        `/userImages/${newFileName}`,
        userId,
      ]);
      res.send({ success: true });
    } catch (err) {
      console.log("error doing insert query" + err);
      // res.send({success: false, errorMessage: err});
    }
  });
};

const editTutorAbilities = async (req, res) => {
  const { id, courses, subjects } = req.body;
  if (!id || !courses || !subjects) {
    console.log(
      "tutorID: " + id + " courses: " + courses + " subjects: " + subjects,
    );
    res.send({
      success: false,
      errorMessage: "username or courses or subjects was undefined",
    });
  }
  //convert the subjects object that looks like [{subject: "art", isChecked: true}, {subject: "math", isChecked: false}, {...}]
  //into a list of subjects that they know (toAdd) and a list that they do not know (toDelete)
  let toAdd = [];
  let toDelete = [];
  //place all the subjects into their correct arrays
  let q = "";
  for (const sub of subjects) {
    if (sub.isChecked) toAdd.push(sub.subject);
    else toDelete.push(sub.subject);
  }
  if (toAdd.length > 0) {
    //set up the insert query to add all the subjects that the tutor knows into the tutor_subjects table
    const placeholders = toAdd.map((subject) => "(?, ?)").join(",");
    const values = toAdd.flatMap((subject) => [id, subject]);
    console.log(values);
    q = `INSERT INTO tutor_subjects (tutor_id, subject_name) VALUES ${placeholders} ON DUPLICATE KEY UPDATE subject_name = VALUES(subject_name)`;
    //execute the query
    try {
      await db.query(q, values);
    } catch (err) {
      console.log("error when trying to insert to tutor_subjects table " + err);
      res.send({ success: false, errorMessage: err + "" });
      return;
    }
  }
  if (toDelete.length > 0) {
    //prepare the delete query to delete every value that the tutor says they do not know.
    const placeholders = toDelete.map((subject) => "(?, ?)").join(",");
    const values = toDelete.flatMap((subject) => [id, subject]);
    console.log(placeholders);
    console.log(values);
    q = `DELETE FROM tutor_subjects WHERE (tutor_id, subject_name) IN (${placeholders})`;
    //execute the query
    try {
      await db.query(q, values);
    } catch (err) {
      console.log("error when trying to DELETE to tutor_subjects table " + err);
      res.send({ success: false, errorMessage: err + "" });
    }
  }
  //update the courseNumbers
  q = "UPDATE users SET courses = ? WHERE id = ?";
  let coursesString = courses.join(" ");
  try {
    await db.query(q, [coursesString, id]);
    res.send({ success: true });
  } catch (err) {
    console.log("error updating the courses of the user " + err);
    res.send({ success: false, errorMessage: err + "" });
  }
};

const getTutorSubjects = async (req, res) => {
  const { id } = req.body;
  console.log("id is: " + id);
  const q = "SELECT subject_name FROM tutor_subjects WHERE tutor_id = ?";

  try {
    const results = await db.query(q, [id]);
    if (results.length == 0) {
      console.log("no user with that id: " + id);
    }
    console.log("this is the shit:");
    console.log(results[0]);
    res.send({ success: true, subjectList: results[0] });
  } catch (err) {
    res.send({ success: false, errorMessage: err + "" });
  }
};

const searchTutors = async (req, res) => {
  //get the name/course number to search by
  const searchTerm = `%${req.body.searchTerm}%`;
  //get the subject to filter by
  const subject = req.body.subject;
  console.log("search term is: " + searchTerm + " and subject is: " + subject);
  let q;
  let values;
  if (subject == "All") {
    q =
      "SELECT * FROM users WHERE (username LIKE ? OR courses LIKE ? ) AND ispending = 0 AND istutor = 1";
    values = [searchTerm, searchTerm];
  } else {
    if (searchTerm == "") {
      q =
        "SELECT users.* FROM users JOIN tutor_subjects ON users.id = tutor_subjects.tutor_id WHERE tutor_subjects.subject_name = ? AND users.istutor = 1 AND ispending = 0";
      values = [subject];
    } else {
      q =
        "SELECT users.* FROM users JOIN tutor_subjects ON users.id = tutor_subjects.tutor_id WHERE tutor_subjects.subject_name = ? AND users.istutor = 1 AND ispending = 0 AND (users.username LIKE ? OR users.courses LIKE ?)";
      values = [subject, searchTerm, searchTerm];
    }
  }

  try {
    const result = await db.query(q, values);
    let userList = result[0];
    //do not give the hashed_passwords of any of the users to the client
    for (let i = 0; i < userList.length; i++) {
      delete userList[i].hashed_password;
    }
    console.log("userlist is: " + userList);
    res.send({ success: true, searchResults: userList });
  } catch (err) {
    console.log("error in query! : " + err);
    res.send({ success: false, error: err });
  }
};

const deleteAccount = async (req, res) => {
  const { username } = req.body;
  const q = "DELETE FROM users WHERE username = ?";
  try {
    await db.query(q, [username]);
    res.send({ success: true });
  } catch (err) {
    console.log("error deleting account: " + err);
    res.send({ success: false, errorMessage: err });
  }
};

/*const becomeTutor = async (req, res) => {
  const { userId } = req.body;
  let q = `UPDATE users SET istutor = 1 WHERE id = ?`;
  try {
    await db.query(q, [userId]);
  } catch (err) {
    console.log("error updating user to be a tutor: " + err);
    res.send({ success: false, errorMessage: err });
  }
  //get the username, hashed_password, img_url, from the users table of the user that wants to become a tutor
  q = "SELECT username, hashed_password, img_url, ispending FROM users WHERE id = ?";
  try {
    const userResult = await db.query(q, [userId]);
    const username = userResult[0][0].username;
    const hashed_password = userResult[0][0].hashed_password;
    const ispending = userResult[0][0].ispending;
    const img_url = userResult[0][0].img_url;
    console.log("username: " + username + " hashed_password: " + hashed_password + " img_url: " + img_url);
    //insert the user into the tutors table
    q = "INSERT INTO tutors (id, username, hashed_password, img_url, ispending) VALUES (?, ?, ?, ?, ?)";
    try {
      await db.query(q, [userId, username, hashed_password, img_url, ispending]);
      console.log("inserted user as tutor succesfully");
      res.send({ success: true });
    } catch (err) {
      console.log("error inserting into tutors table: " + err);
    }
  } catch (err) {
    console.log("error getting user data: " + err);
  }
}*/

const submitReview = async (req, res) => {
  let date = new Date();
  let currentTime = date.toISOString().split(/[- :]/).join("").slice(0, 14);
  const { reviewerId, tutorId, reviewText, rating, reviewerName } = req.body;
  console.log(
    "reviewerId: " +
      reviewerId +
      " revieweeId: " +
      tutorId +
      " reviewText: " +
      reviewText +
      " rating: " +
      rating +
      " currentTime: " +
      currentTime,
  );
  //insert the review into the reviews table
  const q =
    "INSERT INTO tutor_reviews (reviewer_id, tutor_id, review, rating, reviewer_name, time_stamp) VALUES (?, ?, ?, ?, ?, ?)";
  try {
    await db.query(q, [
      reviewerId,
      tutorId,
      reviewText,
      rating,
      reviewerName,
      currentTime,
    ]);
    //update the avg_review of the tutor in the users table
    const q2 = `UPDATE users
    SET avg_rating = (
        SELECT AVG(tutor_reviews.rating)
        FROM tutor_reviews
        WHERE tutor_reviews.tutor_id = ?
    )
    WHERE id = ?;`;
    await db.query(q2, [tutorId, tutorId]);
    res.send({ success: true });
  } catch (err) {
    console.log("error inserting review into reviews table: " + err);
    res.send({ success: false, errorMessage: err });
  }
};

const searchPosts = async (req, res) => {
  let { searchTerm, subject } = req.body;

  searchTerm = `%${searchTerm}%`;

  const params = [searchTerm, searchTerm, searchTerm]; // Common parameters

  let query =
    "SELECT tutor_posts.*, users.img_url, users.username, users.avg_rating " +
    "FROM tutor_posts " +
    "JOIN users ON tutor_posts.tutor_id = users.id " +
    "WHERE (tutor_posts.description LIKE ? OR users.username LIKE ? OR tutor_posts.name LIKE ?) " +
    "AND tutor_posts.is_pending = 0";

  if (subject !== "All") {
    query += " AND tutor_posts.subject = ?";
    params.push(subject); // Add the subject parameter if it's not "All"
  }

  try {
    const result = await db.query(query, params);
    res.send({ success: true, searchResults: result[0] });
    console.log("search results: " + JSON.stringify(result[0]));
  } catch (e) {
    console.log("error in search query! : " + e);
  }
};

const setIsTutor = async (req, res) => {
  const { userId } = req.body;
  const q = "UPDATE users SET istutor = 1, ispending = 1 WHERE id = ?";
  console.log("Updating user to be a tutor: " + userId);
  try {
    await db.query(q, [userId]);
    res.send({ success: true });
  } catch (err) {
    console.log("Error updating user to be a tutor: " + err);
    res.send({ success: false, errorMessage: err });
  }
};

const sendMessage = async (req, res) => {
  //get the current date and time
  let date = new Date();
  let currentTime = date.toISOString().split(/[- :]/).join("").slice(0, 14);
  const { recipientId, senderId, message, postId } = req.body;
  console.log(recipientId, senderId, message, postId);
  //threadId is the smaller of the two ids concatenated with the larger of the two ids concatenated with the postId
  const threadId =
    senderId < recipientId
      ? senderId + "_" + recipientId + "_" + postId
      : recipientId + "_" + senderId + "_" + postId;
  const q =
    "INSERT INTO messages (sender_id, recipient_id, message_text, date_stamp, post_id, thread_id) VALUES (?, ?, ?, ?, ?, ?)";
  try {
    await db.query(q, [
      senderId,
      recipientId,
      message,
      currentTime,
      postId,
      threadId,
    ]);
    res.send({ success: true });
  } catch (err) {
    console.log("error inserting message into messages table: " + err);
    res.send({ success: false, errorMessage: err });
  }
};

const getNotifications = async (req, res) =>{
  const {userId } = req.body;
  const q = "SELECT * FROM notifications WHERE recipient_id = ?";
  try{
    const result = await db.query(q, [userId]);
    res.send({success: true, notifications: result[0]});
  } catch (err) {
    console.log("error getting notifications: " + err);
    res.send({ success: false, errorMessage: err });
  }
}

const createNotification = async (req, res) =>{
  const {userId, notificationName, recipientId, type, postId} = req.body;
  if(notificationName.length > 100){
    res.send({success: false, errorMessage: "Notification name is too long"});
    return;
  }
  const q = "INSERT INTO notifications (sender_id, name, recipient_id, type, post_id) VALUES (?, ?, ?, ?, ?)";
  try{
    await db.query(q, [userId, notificationName, recipientId, type, postId]);
    res.send({success: true});
  } catch (err) {
    console.log("error creating notification: " + err);
    res.send({ success: false, errorMessage: err });
  }
}

const deleteNotification = async (req, res) =>{
  const {notificationId} = req.body;
  console.log("deleteing wih notificationId: " + notificationId + "");
  const q = "DELETE FROM notifications WHERE id = ?";
  try{
    await db.query(q, [notificationId]);
    res.send({success: true});
  } catch (err) {
    console.log("error deleting notification: " + err);
    res.send({ success: false, errorMessage: err });
  }
}

module.exports = {
  login,
  register,
  logout,
  searchByName,
  uploadImage,
  getUserData,
  getUserDataById,
  editUsername,
  editPassword,
  editTutorAbilities,
  getTutorSubjects,
  searchTutors,
  deleteAccount,
  submitReview,
  createPost,
  searchPosts,
  sendMessage,
  setIsTutor,
  getConversations,
  createNotification, 
  getNotifications,
  deleteNotification
};
