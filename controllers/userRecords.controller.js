const UserRecordsModel = require('../models/userRecords.model')

module.exports = {
    getAllUserRecord: async (req, res) => {
        try {
            // define postsviewed array
            var userRecordArray = [];
            // get postsviewed data from firestore
            var userRecordData = await UserRecordsModel._collectionRef.get();
            userRecordData.forEach(doc => {
                userRecord = doc.data();
                userRecord.id = doc.id;
                userRecordArray.push(userRecord); // push to postsviewedArray
            })
            // return result
            return res.status(200).json({
                success: true,
                message: "list of posts history.",
                userRecords: userRecordArray
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

    getUserRecordByUser: async (req, res) => {
        try {
            let { userID } = req.query;
            // get post history data from firestore
            if (!userID)
                throw new Error('user id required.');
            var userRecordData = await UserRecordsModel.getBy('userID', `${userID}`);
            // if not exist
            if (!userRecordData)
                return res.status(404).json({
                    success: false,
                    message: `post history not exist.`,
                });
            // if exist, return result
            return res.status(200).json({
                success: true,
                message: `data of post history`,
                userRecord: userRecordData
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

            var userRecordData = await UserRecordsModel.getBy("userID", userID.toString());

            if (userRecordData) {

                let indexID = userRecordData._data.viewedPosts.indexOf(postID)
                // remove ID before
                if (indexID > -1) {
                    userRecordData._data.viewedPosts.splice(userRecordData._data.viewedPosts.indexOf(postID), 1)
                }
                // add new post ID to list
                userRecordData._data.viewedPosts.push(postID)

                if (liked) {

                    let indexID = userRecordData._data.likedPosts.indexOf(postID)
                    // remove ID before
                    if (indexID > -1) {
                        userRecordData._data.likedPosts.splice(userRecordData._data.likedPosts.indexOf(postID), 1)
                    }

                    // add new post ID to list
                    userRecordData._data.likedPosts.push(postID)
                }
                // update to firestore
                await userRecordData.save();
            }
            else { // if not exists => create new
                userRecordData = await UserRecordsModel.create({
                    userID: userID,
                    viewedPosts: [postID],
                    likedPosts: (liked) ? [postID] : []
                });
            }

            // return result
            return res.status(200).json({
                success: true,
                message: `user record updated successfully.`
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

    saveFavorite: async (req, res) => {
        try {
            let { userID, style } = req.query;
            // get post history data from firestore
            if (!userID || !style)
                throw new Error('user id and style required.');
            var userRecordData = await UserRecordsModel.getBy('userID', `${userID}`);

            // if not exist
            if (userRecordData) {
                userRecordData._data.favoriteStyles.push(String(style));
            }

            // update to firestore
            await userRecordData.save();

            // if exist, return result
            return res.status(200).json({
                success: true,
                message: `saved favorite style of user`,
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