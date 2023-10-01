//Author: Cleveland Plonsey

const express = require("express");
const {login, register, logout, searchByName, uploadImage, getUserData, editUsername} = require("../controllers/userControllers");
const {isLoggedIn} = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.post("/login", login);

userRouter.post("/register", register);

userRouter.get("/logout", logout);

userRouter.post("/searchByName", isLoggedIn, searchByName);

userRouter.post("/uploadImage", isLoggedIn, uploadImage);

//takes in the username from body
userRouter.post("/getUserData", isLoggedIn, getUserData);

userRouter.post("/editUsername", isLoggedIn, editUsername)

module.exports = userRouter;