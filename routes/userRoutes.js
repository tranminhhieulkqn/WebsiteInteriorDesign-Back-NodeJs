var express = require('express');
var router = express.Router();
var validation = require('../utils/validation');
var UserController = require('../controllers/userController');
const { validate, ValidationError, Joi } = require('express-validation');


router.route('/')
    .get(UserController.getAllUsers);

router.route('/login')
    .post(validate(validation.login), UserController.login);

router.route('/register')
    .post(validate(validation.register), UserController.register);

module.exports = router;