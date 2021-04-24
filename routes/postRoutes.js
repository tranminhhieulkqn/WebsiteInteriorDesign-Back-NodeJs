var express = require('express');
var router = express.Router();
var PostController = require('../controllers/postController');


// router.route('/alluser')
//     .get(UserController.getAllUsers);

// router.route('/getuser')
//     .get(UserController.getUserByID);

// router.route('/login')
//     .post(validate(validation.login), UserController.login);

router.route('/create')
    .post(PostController.createPost);

router.route('/get')
    .get(PostController.getPost);

module.exports = router;