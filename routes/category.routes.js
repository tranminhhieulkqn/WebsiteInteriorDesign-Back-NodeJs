const router = require('express').Router();
const CategoryController = require('../controllers/category.controller');

router.route('/create')
    .post(CategoryController.create);
    router.route('/get')
    .get(CategoryController.getAllCategory);

router.route('/getBy')
    .get(CategoryController.getCategoryByID);

router.route('/update')
    .put(CategoryController.update);

router.route('/delete')
    .delete(CategoryController.delete);

module.exports = router;