const router = require('express').Router();
const LikeDetailsController = require('../controllers/likeDetails.controller');

router.route('/like')
    .post(LikeDetailsController.like);

router.route('/unlike')
    .delete(LikeDetailsController.unlike);

router.route('/countlikes/:postID')
    .get(LikeDetailsController.countLikes);


module.exports = router;