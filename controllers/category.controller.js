const CategoryModel = require('../models/category.model')
module.exports ={
    create: async (req, res) => {
        try {
            categoryData = req.body;
            if (!categoryData)
                return res.status(404).json({
                    success: false,
                    message: 'no info category.'
                });
            var categoryCreated = await CategoryModel.create(categoryData);
            return res.status(200).json({
                success: true,
                message: 'category created successfully.',
                category: categoryCreated
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
    getAllCategory: async (req, res) => {
        try {
            // define category array
            var categoriesArray = [];
            // get category data from firestore
            var categoriesData = await CategoryModel._collectionRef.get();
            categoriesData.forEach(doc => {
                category = doc.data();
                category.id = doc.id;
                categoriesArray.push(category); // push to categoryarray
            })
            // return result
            return res.status(200).json({
                success: true,
                message: "list of category.",
                categories: categoriesArray
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

    getCategoryByID: async (req, res) => {
        try {
            // get category data from firestore
            var categoryData = await CategoryModel.getById(`${req.query.id}`);
            // if not exist
            if (!categoryData)
                return res.status(404).json({
                    success: false,
                    message: `category not exist.`,
                });
            // if exist, return result
            return res.status(200).json({
                success: true,
                message: `data of category '${categoryData.name}.'`,
                category: categoryData
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
            // get category data from firestore
            var categoryData = await CategoryModel.getById(`${req.query.id}`);
            console.log(req.query.id);
            // if not exist
            if (!categoryData)
                return res.status(200).json({
                    success: false,
                    message: `category not exist.`,
                });
            // if exist, change category data
            categoryData._data = req.body;
            console.log(req.body);
            delete categoryData._data.cid;
            // update to firestore
            await categoryData.save();
            // return result
            return res.status(200).json({
                success: true,
                message: `category '${categoryData._data.name}' updated successfully.`
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
            // get category data from firestore
            var categoryData = await CategoryModel.getById(`${req.query.id}`);
            // if not exist
            if (!categoryData)
                return res.status(200).json({
                    success: false,
                    message: `category not exist.`,
                });
            // delete category data on firestore
            await categoryData.delete();
            return res.status(200).json({
                success: true,
                message: `category '${categoryData.name}' deleted successfully.`,
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