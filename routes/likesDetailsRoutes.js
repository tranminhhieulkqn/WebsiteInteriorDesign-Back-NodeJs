var express = require('express');
var router = express.Router();
const roles = require('../helper/roles')
const authorize = require('../middleware/authorize')
var LikesDetailsController = require('../controllers/likesDetailsController')

router.route('/like')
    .post(authorize.permit([]), LikesDetailsController.createLike);

router.route('/unlike')
    .delete(authorize.permit([]), LikesDetailsController.deleteLike)

module.exports = router;