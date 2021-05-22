const router = require('express').Router();
const PostController = require('../controllers/post.controller');

router.route('/create')
    .post(PostController.create);

router.route('/get')
    .get(PostController.getAllPost);

router.route('/get/:id')
    .get(PostController.getPostByID);

router.route('/update/:id')
    .put(PostController.update);

router.route('/delete/:id')
    .delete(PostController.delete);

module.exports = router;