
const { getTutorReviews } = require("../controllers/tutorController");
const express = require("express");
const tutorRouter = express.Router();


tutorRouter.post("/getTutorReviews", getTutorReviews);




module.exports = tutorRouter;