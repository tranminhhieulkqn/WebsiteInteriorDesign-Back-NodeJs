const router = require('express').Router();
const CommentDetailsController = require('../controllers/commentDetails.controller');

router.route('/create')
    .post(CommentDetailsController.create);

router.route('/get') // required post id in query param
    .get(CommentDetailsController.getAllCommentOfPost);

router.route('/update') // required comment id in query param
    .put(CommentDetailsController.update);

router.route('/delete') // required comment id in query param
    .delete(CommentDetailsController.delete);

module.exports = router;