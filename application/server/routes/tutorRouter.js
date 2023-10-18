
const { getTutorReviews, getPostById, getPostByTutorId } = require("../controllers/tutorController");
const express = require("express");
const tutorRouter = express.Router();


tutorRouter.post("/getTutorReviews", getTutorReviews);

tutorRouter.post("/getPostById", getPostById);

tutorRouter.post("/getPostByTutorId", getPostByTutorId);

module.exports = tutorRouter;