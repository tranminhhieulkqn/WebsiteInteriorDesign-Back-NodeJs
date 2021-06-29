const PostModel = require('../models/post.model');
const CommentDetailsModel = require('../models/commentDetails.model');


module.exports = {
    create: async (req, res) => {
        try {
            commentData = req.body;
            if (!commentData)
                throw new Error('The data of comment required.');
            // create comment
            var commentCreated = await CommentDetailsModel.create(commentData);
            // check update rate for post
            let allCommentsOfPost = await CommentDetailsModel.getAllBy('postID', commentData.postID)
            let sum = 0;
            allCommentsOfPost.forEach(post => {
                sum += post._data.rated;
            });
            let averageRating = Math.round((sum / allCommentsOfPost.length) * 10) / 10;
            // update rating for post
            let postUpdate = await PostModel.getById(commentData.postID);
            postUpdate._data = Object.assign(postUpdate._data, { "averageRating": averageRating });
            await postUpdate.save()
            // return result
            return res.status(200).json({
                success: true,
                message: 'comment created successfully.',
            })
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getAllCommentOfPost_: async (req, res) => {
        try {
            let postID = req.query.id;
            if (!postID)
                throw new Error('Post ID required in query param.');
            // get all comment of post
            var commentsArray = await CommentDetailsModel.getAllBy('postID', postID);
            // return result
            return res.status(200).json({
                success: true,
                message: "list of post.",
                posts: commentsArray
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    getAllCommentOfPost: async (req, res) => {
        try {
            let postID = req.query.id;
            if (!postID)
                throw new Error('Post ID required in query param.');
            // get all comment of post
            var commentsArray = await CommentDetailsModel.getAllBy('postID', postID);
            // return result
            return res.status(200).json({
                success: true,
                message: "list comments of post.",
                comments: commentsArray
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    update: async (req, res) => {
        try {
            // get post data from firestore
            let commentData = await CommentDetailsModel.getById(`${req.query.id}`);
            // if not exist
            if (!commentData)
                throw new Error('Post ID required in query param.');

            // if exist, change post data
            commentData._data = Object.assign(commentData._data, req.body);
            delete commentData._data.id;
            // update to firestore
            await commentData.save();


            // update rating for post
            let postID = commentData._data.postID;


            // return result
            return res.status(200).json({
                success: true,
                message: `post '${commentData._data.content}' updated successfully.`
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },

    delete: async (req, res) => {
        try {
            let commentID = req.query.id
            if (!commentID)
                throw new Error('Comment ID required in query param.')
            // get post data from firestore
            let commentDelete = await CommentDetailsModel.getById(`${commentID}`);
            // get post id to update
            let postID = commentDelete._data.postID;
            // delete post data on firestore
            await commentDelete.delete();

            // check update rate for post
            let allCommentsOfPost = await CommentDetailsModel.getAllBy('postID', postID)
            let sum = 0;
            allCommentsOfPost.forEach(post => {
                sum += post._data.rated;
            });
            let averageRating = (allCommentsOfPost.length > 0)
                ? Math.round((sum / allCommentsOfPost.length) * 10) / 10
                : 0;
            // update rating for post
            let postUpdate = await PostModel.getById(postID);
            postUpdate._data = Object.assign(postUpdate._data, { "averageRating": averageRating });
            await postUpdate.save()

            // return result
            return res.status(200).json({
                success: true,
                message: `comment deleted successfully.`,
            })
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    },
}