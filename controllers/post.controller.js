const PostModel = require('../models/post.model');

module.exports = {
    create: async (req, res) => {
        try {
            postData = req.body;
            if (!postData)
                return res.status(404).json({
                    success: false,
                    message: 'no info post.'
                });
            var postCreated = await PostModel.create(postData);
            return res.status(200).json({
                success: true,
                message: 'post created successfully.',
                post: postCreated
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
                post: postsArray
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