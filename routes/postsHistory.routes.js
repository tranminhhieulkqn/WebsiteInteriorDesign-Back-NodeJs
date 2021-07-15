const router = require('express').Router();
const PostsHistory = require('../controllers/postsHistory.controller');

router.route('/view')
    .post(PostsHistory.viewPost);

router.route('/get')
    .get(PostsHistory.getAllPostsHistory);

router.route('/getBy')
    .get(PostsHistory.getPostsHistoryByID);


module.exports = router;