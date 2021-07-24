const PredictResultModel = require('../models/predictResult.model')
module.exports= {
    getAllPredictResult: async (req, res) => {
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
                message: error.message
            });
        }
    },  
    update: async (req, res) => {
        try {
            // get predict result data from firestore
            var predictResultData = await PredictResultModel.getById(`${req.query.id}`);
            console.log(req.query.id);
            // if not exist
            if (!predictResultData)
                return res.status(200).json({
                    success: false,
                    message: `predict result not exist.`,
                });
            // if exist, change predict result data
            predictResultData._data = req.body;
            console.log(req.body);
            delete predictResultData._data.cid;
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