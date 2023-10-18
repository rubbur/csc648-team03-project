
const { getTutorReviews, getPostById, getPostByTutorId, deletePost } = require("../controllers/tutorController");
const express = require("express");
const tutorRouter = express.Router();


tutorRouter.post("/getTutorReviews", getTutorReviews);

tutorRouter.post("/getPostById", getPostById);

tutorRouter.post("/getPostByTutorId", getPostByTutorId);

tutorRouter.post("/deletePost", deletePost);

module.exports = tutorRouter;