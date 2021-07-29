const router = require('express').Router();
const PostController = require('../controllers/post.controller');

router.route('/create')
    .post(PostController.create);

router.route('/like')
    .post(PostController.likePost);

router.route('/unlike')
    .delete(PostController.unlikePost);

router.route('/get')
    .get(PostController.getAllPost);

router.route('/getPublic')
    .get(PostController.getAllPostPublic);

router.route('/getByAuthorID')
    .get(PostController.getAllPostByAuthor);

router.route('/getByAuthor')
    .get(PostController.getAllPostByAuthorID);

router.route('/getBy')
    .get(PostController.getPostByID);

router.route('/getByCategory')
    .get(PostController.getPostByCategory);

router.route('/getLast')
    .get(PostController.getLastPosts);

router.route('/getLastByAuthor')
    .get(PostController.getLastPostsByAuthorID);

router.route('/getFeatured')
    .get(PostController.getFeaturedPosts);

router.route('/getRecommended')
    .get(PostController.getRecommendedPosts);

router.route('/update')
    .put(PostController.update);

router.route('/delete')
    .delete(PostController.delete);

module.exports = router;