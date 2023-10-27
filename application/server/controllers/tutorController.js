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
    const q = "SELECT tutor_posts.*, users.img_url, users.username FROM tutor_posts JOIN users ON tutor_posts.tutor_id = users.id WHERE tutor_posts.post_id = ?";
    try {
        const posts = await db.query(q, [postId]);
        if (posts[0].length > 0) {
            res.send({ success: true, postData: posts[0] });
        } else {
            res.send({ success: false, error: "Post not found" });
            console.log("Post not found.");
        }
    } catch (err) {
        console.log("Error retrieving posts for tutor with id: " + postId + " error: " + err);
        res.send({ success: false, error: err });
    }
}


const getPostByTutorId = async (req, res) => {
    const { tutorId } = req.body;
    const q = "SELECT subject, post_id, hourly_rate FROM tutor_posts WHERE tutor_posts.tutor_id = ?";
    try {
        const posts = await db.query(q, [tutorId]);
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
    const subject = req.body.subject;
    let newFileName;
    let destinationFolder = "";
    const updateColumn = req.body.update_column;
    if (file.mimetype === "application/pdf" && updateColumn === "flier_url") {
        // Handle flier file
        newFileName = postId + ".pdf";
        destinationFolder = "fliers";
    } else if (file.mimetype === "application/pdf" && updateColumn === "cv_url") {
        // Handle PDF file
        newFileName = postId + ".pdf";
        destinationFolder = "cvs";
    } else if (file.mimetype.substring(0, 5) === "video" && updateColumn === "video_url") {
        // Handle video file
        newFileName = postId + ".mp4";
        destinationFolder = "videos";
    } else {
        res.send({ success: false, errorMessage: "Unsupported file type" });
        return;
    }

    console.log("The tutorId is: " + tutorId + ", the postId is: " + postId + " and the new file name is: " + newFileName);

    // Move the file into the appropriate folder
    file.mv(`../tutor-app/public/${destinationFolder}/${newFileName}`, async (err) => {
        if (err) {
            console.error(err);
            res.send({ success: false, errorMessage: err });
            return;
        }


        const q = `UPDATE tutor_posts SET ${updateColumn} = '/${destinationFolder}/${newFileName}' WHERE post_id = ${postId} AND tutor_id = ${tutorId}`;

        try {
            const updateRes = await db.query(q, [`/${destinationFolder}/${newFileName}`]);
            res.send({ success: true });
        } catch (err) {
            console.error("Error updating the database: " + err);
            res.send({ success: false, errorMessage: err });
        }
    });
};

//most recently added tutors NOT top three rated tutors
const topThreeTutors = async (req, res) => {
    const q = `SELECT tutor_posts.*, users.img_url
    FROM tutor_posts
    JOIN users ON tutor_posts.tutor_id = users.id
    WHERE tutor_posts.is_pending = 0
    ORDER BY users.id DESC LIMIT 3;`;
    
    
    
    
    try {
        const results = await db.query(q);
        res.send({ success: true, data: results[0] });
    } catch (err) {
        console.log("error retrieving top three tutors: " + err);
    }
}

module.exports = { getTutorReviews, getPostById, getPostByTutorId, deletePost, uploadFile, topThreeTutors };