const PostsHistoryModel = require('../models/postsHistory.model')

module.exports = {
    getAllPostsHistory: async (req, res) => {
        try {
            // define postsviewed array
            var postHistoryArray = [];
            // get postsviewed data from firestore
            var postsHistoryData = await PostsHistoryModel._collectionRef.get();
            postsHistoryData.forEach(doc => {
                postHistory = doc.data();
                postHistory.id = doc.id;
                postHistoryArray.push(postHistory); // push to postsviewedArray
            })
            // return result
            return res.status(200).json({
                success: true,
                message: "list of posts history.",
                postsHistory: postHistoryArray
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

    getPostsHistoryByUser: async (req, res) => {
        try {
            let { userID } = req.query;
            // get post history data from firestore
            if (!userID)
                throw new Error('user id required.');
            var postsHistoryData = await PostsHistoryModel.getBy('userID', `${userID}`);
            // if not exist
            if (!postsHistoryData)
                return res.status(404).json({
                    success: false,
                    message: `post history not exist.`,
                });
            // if exist, return result
            return res.status(200).json({
                success: true,
                message: `data of post history`,
                postsHistory: postsHistoryData
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

    viewPost: async (req, res) => {
        try {
            // get posts history data from firestore
            let { postID, userID, liked } = req.query;
            if (!postID || !userID)
                throw new Error('post id and user id required.');

            var postsHistoryData = await PostsHistoryModel.getBy("userID", userID.toString());

            if (postsHistoryData) {
                // add new post ID to list
                postsHistoryData._data.viewedPosts.push(postID)
                // remove duplicates
                postsHistoryData._data.viewedPosts = postsHistoryData._data.viewedPosts.filter(
                    (value, index, self) => {
                        return self.indexOf(value) === index;
                    })
                if (liked) {
                    // add new post ID to list
                    postsHistoryData._data.likedPosts.push(postID)
                    // remove duplicates
                    postsHistoryData._data.likedPosts = postsHistoryData._data.likedPosts.filter(
                        (value, index, self) => {
                            return self.indexOf(value) === index;
                        })
                }
                // update to firestore
                await postsHistoryData.save();
            }
            else { // if not exists => create new
                postsHistoryData = await PostsHistoryModel.create({
                    userID: userID,
                    viewedPosts: [postID],
                    likedPosts: (liked) ? [postID] : []
                });
            }

            // return result
            return res.status(200).json({
                success: true,
                message: `post history updated successfully.`

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
}