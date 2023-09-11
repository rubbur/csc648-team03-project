//Author: Cleveland Plonsey

const express = require("express");
const {login, register} = require("../controllers/userControllers");

const userRouter = express.Router();

userRouter.post("/login", login);

userRouter.post("/register", register);

// userRouter.get("/logout", logout);




module.exports = userRouter;