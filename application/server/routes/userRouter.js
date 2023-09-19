//Author: Cleveland Plonsey

const express = require("express");
const {login, register, logout, searchByName} = require("../controllers/userControllers");
const {isLoggedIn} = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.post("/login", login);

userRouter.post("/register", register);

userRouter.get("/logout", logout);

userRouter.post("/searchByName", searchByName);


module.exports = userRouter;