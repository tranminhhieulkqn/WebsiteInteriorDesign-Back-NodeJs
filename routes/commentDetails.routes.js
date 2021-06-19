const router = require('express').Router();
const CommentDetailsController = require('../controllers/commentDetails.controller');

router.route('/create') // required post id in query param
    .post(CommentDetailsController.create);

// router.route('/get')
//     .get(CommentDetailsController.getAllPost);

// router.route('/getBy')
//     .get(CommentDetailsController.getPostByID);

// router.route('/getLast')
//     .get(CommentDetailsController.getLastPost);

// router.route('/update')
//     .put(CommentDetailsController.update);

// router.route('/delete')
//     .delete(CommentDetailsController.delete);

module.exports = router;