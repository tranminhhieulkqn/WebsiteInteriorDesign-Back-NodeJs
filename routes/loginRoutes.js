var express = require('express');
var router = express.Router();
var validation = require('../utils/validation');
var LoginController = require('../controllers/loginController');
const { validate, ValidationError, Joi } = require('express-validation');


router.route('/')
    .post(validate(validation.login), LoginController.login);

module.exports = router;