var express = require('express');
var router = express.Router();
const roles = require('../helper/roles')
const authorize = require('../middleware/authorize')
var PostController = require('../controllers/postController');

router.route('/create')
    .post(authorize.permit([roles.Designer]), PostController.createPost);

router.route('/get')
    .get(authorize.permit([]), PostController.getPost);

router.route('/update')
    .put(authorize.permit([roles.Designer]), PostController.updatePost)

router.route('/delete')
    .delete(authorize.permit([roles.Designer]), PostController.deletePost)

module.exports = router;