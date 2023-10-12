const db = require("../config/database/dbConnection");

const getTutorReviews = async (req, res) => {
    const { id } = req.body;
    try {
        let q = "SELECT * FROM tutor_reviews WHERE tutor_id = ?";
        const reviews = await db.query(q, [id]);
        console.log("reviews: " + JSON.stringify(reviews[0][0]["time_stamp"]));
        const results = reviews[0].map((review) => {
            let formattedDate = review.time_stamp.toISOString().slice(0, 10).split('-');
            review = {
                ...review,
                time_stamp: formattedDate[1] + "/" + formattedDate[2] + "/" + formattedDate[0]
            }
            return review;     
            });
        res.send({success: true, reviews: results})
        } catch (err) {
        console.log("error retrieving reviews for tutor with id: " + id + " error: " + err);
    }
}


module.exports = {getTutorReviews};