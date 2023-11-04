//Author: Cleveland Plonsey
//date: 9/14/2023
//router for routes that have to do with admin

const {
  verifyAdmin,
  deleteUser,
  getAllUsers,
  editUser,
} = require("../controllers/adminControllers");

const express = require("express");

const adminRouter = express.Router();

adminRouter.post("/verify", verifyAdmin);

adminRouter.post("/deleteUser", deleteUser);

adminRouter.post("/getAllUsers", getAllUsers);

adminRouter.post("/editUser", editUser);

module.exports = adminRouter;
