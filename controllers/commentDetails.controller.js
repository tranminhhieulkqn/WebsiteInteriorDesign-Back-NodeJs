const CommentDetailsModel = require('../models/commentDetails.model');


module.exports = {
    create: async (req, res) => {
        try {
            let postID = req.query.id;
            if (!postID)
                throw new Error('Post ID required in query param.');
            commentData = req.body;
            if (!commentData)
                throw new Error('The data of comment required.');
            
            var commentCreated = await CommentDetailsModel.create(commentData);
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

    getAllPost: async (req, res) => {
        try {
            // define posts array
            var postsArray = [];
            // get posts data from firestore
            var postsData = await PostModel._collectionRef.get();
            postsData.forEach(doc => {
                post = doc.data();
                post.id = doc.id;
                postsArray.push(post); // push to postsArray
            })
            // return result
            return res.status(200).json({
                success: true,
                message: "list of post.",
                posts: postsArray
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

    getPostByID: async (req, res) => {
        try {
            // get post data from firestore
            var postData = await PostModel.getById(`${req.query.id}`);
            // if not exist
            if (!postData)
                return res.status(404).json({
                    success: false,
                    message: `post not exist.`,
                });
            // if exist, return result
            return res.status(200).json({
                success: true,
                message: `data of post '${postData.tittle}.'`,
                post: postData
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

    getLastPost: async (req, res) => {
        try {
            // take by amount in query param or not default 1
            let amount = 1;
            if (req.query.amount) {
                amount = parseInt(req.query.amount);
            }
            // define posts array get
            var postsArray = [];
            // get post data from firestore
            var postsData = await PostModel._collectionRef.orderBy('dateCreated', 'desc').limit(amount).get();
            postsData.forEach(doc => {
                post = doc.data();
                post.id = doc.id;
                postsArray.push(post); // push to postsArray
            })
            return res.status(200).json({
                success: true,
                message: `data of post`,
                posts: postsArray
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
            var postData = await PostModel.getById(`${req.query.id}`);
            console.log(req.query.id);
            // if not exist
            if (!postData)
                return res.status(200).json({
                    success: false,
                    message: `post not exist.`,
                });
            // if exist, change post data
            postData._data = req.body;
            console.log(req.body);
            delete postData._data.pid;
            // update to firestore
            await postData.save();
            // return result
            return res.status(200).json({
                success: true,
                message: `post '${postData._data.tittle}' updated successfully.`
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
            // get post data from firestore
            var postData = await PostModel.getById(`${req.query.id}`);
            // if not exist
            if (!postData)
                return res.status(200).json({
                    success: false,
                    message: `post not exist.`,
                });
            // delete post data on firestore
            await postData.delete();
            return res.status(200).json({
                success: true,
                message: `post '${postData.tittle}' deleted successfully.`,
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
    }
}