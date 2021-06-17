const router = require('express').Router();
const PostController = require('../controllers/post.controller');

router.route('/create')
    .post(PostController.create);

router.route('/get')
    .get(PostController.getAllPost);

router.route('/getBy')
    .get(PostController.getPostByID);

router.route('/update')
    .put(PostController.update);

router.route('/delete')
    .delete(PostController.delete);

module.exports = router;