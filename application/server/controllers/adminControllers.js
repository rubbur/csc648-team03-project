//Author: Cleveland Plonsey

const db = require("../config/database/dbConnection");


const verifyAdmin = async (req, res) =>{
    //check if the user has the admin authentication
    if(!req.session.isAdmin){
        res.send({success: false});
    }
    else {
        res.send({success:true});
    }
}

const deleteUser = async (req, res) =>{
    //get the userId
    const id = req.body.userId;
    const q = "DELETE FROM users WHERE id = ?";

    try{
        const deleteRes = await db.query(q, [id]);
        res.send({success: true});
    }
    catch(err){
        console.log("catch block err when trying to delete user: " + err);
        res.send({success: false, errorMessage: err});
    }
}

const editUser = async (req, res) =>{

   const {userId, newPassword, newUsername, newIsTutor} = req.body;
   const q = "UPDATE";

}

const getAllUsers = async (req, res) =>{
    console.log("inside all users");
    const q = "SELECT * FROM users";

    try{
        const result = await db.query(q);
        res.send({success: true, allUsers: result[0]});
    }
    catch(err){
        console.log("error in get All Users " + err);
        res.send({success: false, errorMessage: err});
    }
}


module.exports = {verifyAdmin, deleteUser, editUser, getAllUsers};