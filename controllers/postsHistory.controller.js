const PostsHistoryModel = require('../models/postsHistory.model')
module.exports ={
    create: async (req, res) => {
        try {
            postsHistoryData = req.body;
            if (!postsHistoryData)
                return res.status(404).json({
                    success: false,
                    message: 'no info postsHistory.'
                });
            var postsHistoryData = await PostsHistoryModel.create(postsHistoryData);
            return res.status(200).json({
                success: true,
                message: 'postsHistory created successfully.',
                postsHistory: postsHistoryData
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
                message: "list of postsHistory.",
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

    getPostsHistoryByID: async (req, res) => {
        try {
            // get post history data from firestore
            var postsHistoryData = await PostsHistoryModel.getById(`${req.query.id}`);
            // if not exist
            if (!postsHistoryData)
                return res.status(404).json({
                    success: false,
                    message: `Post History not exist.`,
                });
            // if exist, return result
            return res.status(200).json({
                success: true,
                message: `data of Post History`,
                postshistory: postsHistoryData
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
            // get posts history data from firestore
            var postsHistoryData = await PostsHistoryModel.getById(`${req.query.id}`);
            console.log(req.query.id);
            // if not exist
            if (!postsHistoryData)
                return res.status(200).json({
                    success: false,
                    message: `post history not exist.`,
                });
            // if exist, change category data
            console.log("asbsbsbs")
            
           console.log(postsHistoryData['id'])


            // categoryData._data = req.body;
            // console.log(req.body);
            // delete categoryData._data.cid;



            // update to firestore
            // await categoryData.save();
            // return result
            return res.status(200).json({
                success: true,
                // message: `category '${categoryData._data.name}' updated successfully.`
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

//     delete: async (req, res) => {
//         try {
//             // get category data from firestore
//             var categoryData = await CategoryModel.getById(`${req.query.id}`);
//             // if not exist
//             if (!categoryData)
//                 return res.status(200).json({
//                     success: false,
//                     message: `category not exist.`,
//                 });
//             // delete category data on firestore
//             await categoryData.delete();
//             return res.status(200).json({
//                 success: true,
//                 message: `category '${categoryData.name}' deleted successfully.`,
//             })
//         } catch (error) { // cacth error
//             // show error to console
//             console.error(error.message);
//             // return error message
//             return res.status(500).json({
//                 success: false,
//                 message: error.message
//             });
//         }
//     }

}