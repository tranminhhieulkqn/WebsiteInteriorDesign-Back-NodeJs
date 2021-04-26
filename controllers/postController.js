var Post = require('../models/postModel');

module.exports = {
    createPost: function (req, res) {
        // Get infor new post from req
        infoPost = req.body;
        infoPost.createdDate = new Date();
        infoPost.updatedDate = new Date();
        var post = new Post(infoPost);
        post.save(function (err) {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            //If execution is success then send response as post is created successfully.
            return res.json({ success: true, statusCode: 200, message: "Post has been created successfully!" });
        });
    },

    getPost: function (req, res) {
        // Get infor post from req
        infoPost = req.body;
        maxGet = infoPost.maxGet ? infoPost.maxGet : 20;
        // If exists id, find post by ID or get all
        queryCommand = infoPost.id ? { _id: infoPost.id } : {};
        Post.find(queryCommand, function (err, posts) {
            if (err) {
                res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            //If able to fetch all posts then send them in response in posts key.
            res.json({ success: true, statusCode: 200, posts: posts });
        });
    },

    updatePost: function(req, res){
        // Get infor new user from req
        infoNewPost = req.body;
        infoNewPost.updatedDate = new Date();
        console.log(infoNewPost)
        Post.findByIdAndUpdate(infoNewPost.id, infoNewPost, { new: true }, function (err, updatedPost) {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            if (updatedPost === null) {
                return res.json({ success: false, statusCode: 404, errorMessage: 'Post does not exist on the system!' })
            }
            return res.json({ success: true, statusCode: 200, updatedPost: updatedPost });
        });
    },

    deletePost: (req, res) => {
        // Get infor new post from req
        infoPost = req.body;
        Post.findByIdAndDelete(infoPost.id, (err, deletedPost) => {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            if (deletedPost === null) {
                return res.json({ success: false, statusCode: 404, errorMessage: 'User does not exist on the system!' })
            }
            return res.json({ success: true, statusCode: 200, deletedPost: deletedPost });
        });
    }
}