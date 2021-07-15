const router = require('express').Router();
const PostsHistory = require('../controllers/postsHistory.controller');

router.route('/create')
    .post(PostsHistory.create);
    router.route('/get')
    .get(PostsHistory.getAllPostsHistory);

router.route('/getBy')
    .get(PostsHistory.getPostsHistoryByID);

router.route('/update')
    .put(PostsHistory.update);

// router.route('/delete')
//     .delete(CategoryController.delete);

module.exports = router;