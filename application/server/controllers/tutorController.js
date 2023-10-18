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
        res.send({ success: true, reviews: results })
    } catch (err) {
        console.log("error retrieving reviews for tutor with id: " + id + " error: " + err);
    }
}

const getPostById = async (req, res) => {
    const { postId } = req.body;
    console.log("the tutorId is " + postId);
    const q = "SELECT tutor_posts.*, users.img_url, users.username FROM tutor_posts JOIN users ON tutor_posts.tutor_id = users.id WHERE tutor_posts.post_id = ?";
    try {
        const posts = await db.query(q, [postId]);
        res.send({ success: true, postData: posts[0][0] });
    } catch (err) {
        console.log("error retrieving posts for tutor with id: " + postId + " error: " + err);
    }
}

const getPostByTutorId = async (req, res) => {
    const { tutorId } = req.body;
    console.log("the tutorId is " + tutorId);
    const q = "SELECT subject, post_id, hourly_rate FROM tutor_posts WHERE tutor_posts.tutor_id = ?";
    try {
        const posts = await db.query(q, [tutorId]);
        console.log(posts[0]);
        res.send({ success: true, postData: posts[0] });
    } catch (err) {
        console.log("error retrieving posts for tutor with id: " + tutorId + " error: " + err);
    }
}

const deletePost = async (req, res) => {
    const { postId } = req.body;
    console.log("the postId is " + postId);
    const q = "DELETE FROM tutor_posts WHERE post_id = ?";
    try {
        const posts = await db.query(q, [postId]);
        res.send({ success: true });
    } catch (err) {
        console.log("error deleting post with id: " + postId + " error: " + err);
    }
}

const uploadFile = async (req, res) => {
    const { file } = req.files;
    const username = req.body.username;
    const tutorId = req.body.tutor_id;
    const postId = req.body.post_id;
    let newFileName;
    let destinationFolder = "postFiles"; // Use "postFiles" for all file types
    let updateColumn = "";
    if (file.mimetype.substring(0, 5) === "image") {
        // Handle image file
        newFileName = username + "_" + postId + ".png";
        updateColumn = "img_url";
    } else if (file.mimetype === "application/pdf") {
        // Handle PDF file
        newFileName = username + "_" + postId + ".pdf";
        updateColumn = "pdf_url";
    } else if (file.mimetype.substring(0, 5) === "video") {
        // Handle video file
        newFileName = username + "_" + postId + ".mp4";
        updateColumn = "video_url";
    } else {
        res.send({ success: false, errorMessage: "Unsupported file type" });
        return;
    }

    console.log("The file is: " + file + " and the tutorId is: " + tutorId + " and the new file name is: " + newFileName);

    // Move the file into the appropriate folder
    file.mv(`../tutor-app/public/${destinationFolder}/${newFileName}`, async (err) => {
        if (err) {
            console.error(err);
            res.send({ success: false, errorMessage: err });
            return;
        }

        const q = `UPDATE tutor_posts SET ${updateColumn} = ?, ispending = 1 WHERE tutor_id = ?`;

        try {
            const updateRes = await db.query(q, [`/${destinationFolder}/${newFileName}`, tutorId]);
            res.send({ success: true });
        } catch (err) {
            console.error("Error updating the database: " + err);
            res.send({ success: false, errorMessage: err });
        }
    });
};

module.exports = { getTutorReviews, getPostById, getPostByTutorId, deletePost, uploadFile };