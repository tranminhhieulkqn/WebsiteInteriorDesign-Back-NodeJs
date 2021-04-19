var express = require('express');
var router = express.Router();
var validation = require('../utils/validation');
var UserController = require('../controllers/userController');
const { validate, ValidationError, Joi } = require('express-validation');


router.route('/')
    .get(UserController.user.getAllUsers);

router.route('/register')
    .post(validate(validation.register), UserController.user.register);

module.exports = router;