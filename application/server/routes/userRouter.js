//Author: Cleveland Plonsey
//date: 9/27/2023
//purpose: This file contains the routes for the user controller.
//This router is used to route the requests to the correct controller function.
//where the routes and controllers have to do with a user.

const express = require("express");
const {
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
  getLiked,
  likeMessage,
  createNotification,
  getNotifications,
  deleteNotification
} = require("../controllers/userControllers");
const { isLoggedIn } = require("../middleware/authMiddleware");

const userRouter = express.Router();

userRouter.post("/login", login);

userRouter.post("/register", register);

userRouter.get("/Logout", logout);

userRouter.post("/searchByName", isLoggedIn, searchByName);

userRouter.post("/uploadImage", isLoggedIn, uploadImage);

//takes in the username from body
userRouter.post("/getUserData", isLoggedIn, getUserData);

userRouter.post("/editUsername", isLoggedIn, editUsername);

userRouter.post("/editPassword", isLoggedIn, editPassword);

userRouter.post("/editTutorAbilities", isLoggedIn, editTutorAbilities);

userRouter.post("/getTutorSubjects", isLoggedIn, getTutorSubjects);

userRouter.post("/searchTutors", searchTutors);

userRouter.post("/deleteAccount", isLoggedIn, deleteAccount);

userRouter.post("/submitReview", isLoggedIn, submitReview);

userRouter.post("/CreatePost", isLoggedIn, createPost);

userRouter.post("/searchPosts", searchPosts);

userRouter.post("/sendMessage", isLoggedIn, sendMessage);

userRouter.post("/setIsTutor", isLoggedIn, setIsTutor);

userRouter.post("/getConversations", isLoggedIn, getConversations);

userRouter.post("/getUserDataById", isLoggedIn, getUserDataById);

userRouter.post("/getLiked", getLiked);

userRouter.post("/likeMessage", likeMessage);

userRouter.post("/createNotification", createNotification);

userRouter.post("/getNotifications", getNotifications);

userRouter.post("/deleteNotification", deleteNotification);

module.exports = userRouter;
