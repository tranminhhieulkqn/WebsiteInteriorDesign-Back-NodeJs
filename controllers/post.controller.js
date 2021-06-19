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

    getLastPosts: async (req, res) => {
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

    getFeaturedPosts: async (req, res) => {
        try {
            // take by amount in query param or not default 1
            let amount = 1;
            if (req.query.amount) {
                amount = parseInt(req.query.amount);
            }
            // take by month ago in query param or not default 1
            let monthago = 1;
            if (req.query.monthago) {
                monthago = parseInt(req.query.monthago);
            }
            // define time month ago
            var monthAgo = new Date();
            monthAgo.setMonth(monthAgo.getMonth() - monthago);
            console.log(monthAgo.toISOString())
            // const expirationDate = firebaseAdmin.firestore.Timestamp.fromDate(monthAgo);
            // console.log(expirationDate)
            // define posts array get
            var postsArray = [];
            // get post data from firestore
            var postsData = await PostModel._collectionRef
                .where('dateCreated', '<', monthAgo.toISOString())
                .orderBy('dateCreated', 'desc')
                .limit(amount).get();
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