var express = require('express');
var router = express.Router();
var validation = require('../utils/validation');
var UserController = require('../controllers/userController');
const { validate, ValidationError, Joi } = require('express-validation');


router.route('/login')
    .post(validate(validation.login), UserController.login);

router.route('/register')
    .post(validate(validation.register), UserController.register);

router.route('/get')
    .get(UserController.getUser);

router.route('/update')
    .put(UserController.updateUser)

router.route('/delete')
    .delete(UserController.deleteUser)

module.exports = router;