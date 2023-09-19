//Author: Cleveland Plonsey
const {verifyAdmin, deleteUser} = require("../controllers/adminControllers");


const express = require("express");

const adminRouter = express.Router();


adminRouter.post("/verify", verifyAdmin);

adminRouter.post("/deleteUser", deleteUser);



module.exports = adminRouter;