//Author: Cleveland Plonsey
//date: 10/15/2023
//purpose: This file contains the routes for the user controller.
//This router is used to route the requests to the correct controller function.
//where the routes and controllers have to do with a tutor.

const {
  getTutorReviews,
  getPostById,
  getPostByTutorId,
  deletePost,
  uploadFile,
  topThreeTutors,
} = require("../controllers/tutorController");
const express = require("express");
const tutorRouter = express.Router();

tutorRouter.post("/getTutorReviews", getTutorReviews);

tutorRouter.post("/getPostById", getPostById);

tutorRouter.post("/getPostByTutorId", getPostByTutorId);

tutorRouter.post("/deletePost", deletePost);

tutorRouter.post("/uploadFile", uploadFile);

tutorRouter.get("/topThreeTutors", topThreeTutors);

module.exports = tutorRouter;
