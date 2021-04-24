var Post = require('../models/postModel');

module.exports = {
    createPost: function (req, res) {
        // Get infor new user from req
        infoPost = req.body;
        var post = new Post({
            authorID: infoPost.authorID,
            tittle: infoPost.tittle,
            imageURL: infoPost.imageURL,
            sumary: infoPost.sumary,
            content: infoPost.content,
            likesID: infoPost.likesID,
            numOfLikes: infoPost.numOfLikes,
            commentsID: infoPost.commentsID
        });
        post.save(function (err) {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            //If execution is success then send response as user is registered successfully.
            return res.json({ success: true, statusCode: 200, message: "Post has been created successfully!" });
        });
    },

    getPost: function (req, res) {
        // Get infor post from req
        infoPost = req.body;
        Post.find(((infoPost.if) ? {_id: infoPost.id} : {}), function (err, posts) {
            if (err) {
                res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            //If able to fetch all posts then send them in response in posts key.
            res.json({ success: true, statusCode: 200, posts: posts });
        })

    }
}