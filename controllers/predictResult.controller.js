const PredictResultModel = require('../models/predictResult.model')
module.exports = {
    getAll: async (req, res) => {
        try {
            // define postsviewed array
            var predictResultArray = [];
            // get postsviewed data from firestore
            var predictResultData = await PredictResultModel._collectionRef.get();
            predictResultData.forEach(doc => {
                predictResult = doc.data();
                predictResult.id = doc.id;
                predictResultArray.push(predictResult); // push to predict result
            })
            // return result
            return res.status(200).json({
                success: true,
                message: "list of posts history.",
                predictResult: predictResultArray
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

    getAllByUser: async (req, res) => {
        try {
            let { userID, pageSize, currentPage } = req.query;

            pageSize = Number(pageSize) || 1
            currentPage = Number(currentPage) || 1

            // Get size all userID and on page
            dataSize = await PredictResultModel._collectionRef
                .where('userID', '==', userID)
                .get();
            let totalItem = dataSize.size || 0;
            let totalPage = Math.ceil(dataSize.size / pageSize) || 0

            // define users array
            var resultsArray = [];
            first = await PredictResultModel._collectionRef
                .where('userID', '==', userID)
                .orderBy('dateCreated', 'desc')
                .limit(pageSize * (currentPage - 1) + 1)
                .get();

            try {
                resultsData = await PredictResultModel._collectionRef
                    .where('userID', '==', userID)
                    .orderBy('dateCreated', 'desc')
                    .startAt(first.docs[first.docs.length - 1].data()['dateCreated'])
                    .limit(Number(pageSize))
                    .get();

                resultsData.forEach(doc => {
                    userID = doc.data();
                    userID.id = doc.id;
                    resultsArray.push(userID); // push to resultsArray
                })
            } catch (error) {

            }

            // return result
            return res.status(200).json({
                success: true,
                message: "list of userID.",
                results: resultsArray,
                totalItem: totalItem,
                totalPage: totalPage
            });
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message
            })
        }
    },

    create: async (req, res) => {
        try {
            predictResult = req.body;
            if (!predictResult)
                return res.status(404).json({
                    success: false,
                    message: 'no info predict result.'
                });
            var predictResultCreated = await PredictResultModel.create(predictResult);
            return res.status(200).json({
                success: true,
                message: 'predict result created successfully.',
                predictResult: predictResultCreated
            })
        } catch (error) { // cacth error
            // show error to console
            console.error(error.message);
            // return error message
            return res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    },

    update: async (req, res) => {
        try {
            // get predict result data from firestore
            var predictResultData = await PredictResultModel.getById(`${req.query.id}`);

            // if not exist
            if (!predictResultData)
                return res.status(200).json({
                    success: false,
                    message: `predict result not exist.`,
                });
            // if exist, change predict result data
            predictResultData._data = Object.assign(predictResultData._data, req.body);

            // update to firestore
            await predictResultData.save();
            // return result
            return res.status(200).json({
                success: true,
                message: `predict result  updated successfully.`
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