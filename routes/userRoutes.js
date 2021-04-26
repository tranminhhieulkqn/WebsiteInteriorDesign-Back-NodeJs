var express = require('express');
var router = express.Router();
var validation = require('../utils/validation');
const roles = require('../helper/roles')
const authorize = require('../middleware/authorize')
var UserController = require('../controllers/userController');
const { validate, ValidationError, Joi } = require('express-validation');


router.route('/login')
    .post(validate(validation.login), UserController.login);

router.route('/register')
    .post(validate(validation.register), UserController.register);

router.route('/get')
    .get(UserController.getUser);

router.route('/update')
    .put(authorize.permit([roles.User, roles.Admin]), UserController.updateUser)

router.route('/delete')
    .delete(authorize.permit([roles.Admin]), UserController.deleteUser)

module.exports = router;