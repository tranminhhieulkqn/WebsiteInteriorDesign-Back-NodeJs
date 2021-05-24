const LikeDetailsModel = require('../models/likeDetails.model');

module.exports = {
    like: async (req, res) => {
        try {
            var data = req.body;
            // check exist 
            var checkExist = await LikeDetailsModel.checkExist(data.postID, data.authorID);
            if (checkExist)
                return res.status(208).json({
                    success: false,
                    message: 'likes already exist.'
                });
            // create likes on firestore
            await LikeDetailsModel.create(data);
            return res.status(200).json({
                success: true,
                message: 'likes have been recorded.'
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

    unlike: async (req, res) => {
        try {
            var data = req.body;
            // check exist 
            var likes = await LikeDetailsModel._collectionRef
                .where('postID', '==', data.postID)
                .where('authorID', '==', data.authorID)
                .limit(1)
                .get();
            var checkExist = false;
            var idLikes = '';
            await likes.forEach((like) => {
                checkExist = true;
                idLikes = like.id;
            });
            if (!checkExist)
                return res.status(404).json({
                    success: false,
                    message: 'likes not exist.'
                });
            // create likes on firestore
            var deleteLikes = await LikeDetailsModel.getById(idLikes);
            await deleteLikes.delete();
            return res.status(200).json({
                success: true,
                message: 'unlike success.'
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

    countLikes: async (req, res) => {
        try {
            var likesOfPost = await LikeDetailsModel.getByIDPost(`${req.params.postID}`);
            var listOfLikes = [];
            await likesOfPost.forEach((like) => {
                listOfLikes.push(like._data.authorID);
            });
            return res.status(200).json({
                success: true,
                message: 'list likes of post.',
                listOfLikes: listOfLikes,
                countLikes: listOfLikes.length
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
    }
}