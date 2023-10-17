
const { getTutorReviews, getPostById } = require("../controllers/tutorController");
const express = require("express");
const tutorRouter = express.Router();


tutorRouter.post("/getTutorReviews", getTutorReviews);

tutorRouter.post("/getPostById", getPostById);

module.exports = tutorRouter;