const db = require("../config/database/dbConnection");

const getTutorReviews = async (req, res) => {
    const { id } = req.body;
    try {
        let q = "SELECT * FROM tutor_reviews WHERE tutor_id = ? ORDER BY time_stamp DESC";
        const reviews = await db.query(q, [id]);
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

const getPostById = async (req, res) => {
    const {postId} = req.body;
    console.log("the tutorId is " + postId);
    const q = "SELECT tutor_posts.*, users.img_url, users.username FROM tutor_posts JOIN users ON tutor_posts.tutor_id = users.id WHERE tutor_posts.post_id = ?";
    try {
        const posts = await db.query(q, [postId]);
        res.send({success: true, postData: posts[0][0]});
    } catch (err) {
        console.log("error retrieving posts for tutor with id: " + postId + " error: " + err);
    }
}


module.exports = {getTutorReviews, getPostById};