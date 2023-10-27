
const { getTutorReviews, getPostById, getPostByTutorId, deletePost, uploadFile, topThreeTutors } = require("../controllers/tutorController");
const express = require("express");
const tutorRouter = express.Router();


tutorRouter.post("/getTutorReviews", getTutorReviews);

tutorRouter.post("/getPostById", getPostById);

tutorRouter.post("/getPostByTutorId", getPostByTutorId);

tutorRouter.post("/deletePost", deletePost);

tutorRouter.post("/uploadFile", uploadFile);

tutorRouter.get("/topThreeTutors", topThreeTutors);

module.exports = tutorRouter;