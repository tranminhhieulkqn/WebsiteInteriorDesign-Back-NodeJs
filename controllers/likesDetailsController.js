var User = require('../models/userModel')
var Post = require('../models/postModel')
var LikesDetails = require('../models/likesDetailsModel')

module.exports = {
    checkExist: (authorID, postID) => {
        if (!authorID) {
            return res.json({ success: false, statusCode: 500, errorMessage: "Lack of authorID information" });
        }
        User.findById(authorID, (err, user) => {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            if (!user) {
                return res.json({ success: false, statusCode: 404, errorMessage: 'User does not exist on the system!' });
            }
        });
        if (!postID) {
            return res.json({ success: false, statusCode: 500, errorMessage: "Lack of postID information" });
        }
        Post.findById(postID, (err, post) => {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            if (!post) {
                return res.json({ success: false, statusCode: 404, errorMessage: 'Post does not exist on the system!' });
            }
        });
    },

    createLike: (req, res) => {
        infoLike = req.body;
        this.checkExist(infoLike.authorID, infoLike.postID);
        var newLike = new LikesDetails(infoLike);
        newLike.save((err) => {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            //If execution is success then send response as new like is created successfully.
            return res.json({ success: true, statusCode: 200, message: "Like has been created successfully!" });
        });
    },

    deleteLike: (req, res) => {
        infoLike = req.body;
        this.checkExist(infoLike.authorID, infoLike.postID);
        LikesDetails.findOneAndDelete({
            authorID: infoLike.authorID,
            postID: infoLike.postID
        }, (err, like) => {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            //If execution is success then send response as new like is created successfully.
            return res.json({ success: true, statusCode: 200, message: "Like has been deteled successfully!" });           
        })
    }
}