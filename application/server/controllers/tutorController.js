const db = require("../config/database/dbConnection");

const getTutorReviews = async (req, res) => {
    const { id } = req.body;
    try {
        let q = "SELECT * FROM reviews WHERE tutor_id = ?";
        const reviews = await db.query(q, [id]);
        res.send({success: true, reviews: reviews[0]})
        } catch (err) {
        console.log("error retrieving reviews for tutor with id: " + id + " error: " + err);
    }
}


module.exports = {getTutorReviews};