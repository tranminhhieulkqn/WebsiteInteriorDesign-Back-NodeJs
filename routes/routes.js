var express = require('express');  //load express module to crate instance of app
var jwt = require('jsonwebtoken'); //load json eb token to verify token in endpoints
var config = require('../config/config'); //get secret key from configuration parameters
//The express.Router class can be used to create modular mountable route handlers.
// A Router instance is a complete middleware and routing system;
var router = express.Router();
//express-validation is a middleware that validates the body, params, query,
// headers and cookies of a request and returns a response with errors;
//we have used it for contact request parameters validation with JOI.
const { validate, ValidationError, Joi } = require('express-validation');
//Index controller to handle all(get, post, delete, put) route "/" requests.
var IndexController = require('../controllers/indexController');
//ContactRequest controller to handle all(get, post, delete, put) route "/contactRequest" requests.
var UserController = require('../controllers/userController');

//Login controller to check user name and password and return user ID with token

var LoginController = require('../controllers/loginController');
//load validation module to validate input requests parameter.
var validation = require('../utils/validation');

//============MIDDLEWARE TO CHECK TOKEN IS PROVIDED TO ACCESS END POINTS===================
// route middleware to verify a token
router.use(function (req, res, next) {
    console.log(req.originalUrl);
    if (req.originalUrl === '/login') {
        return next();
    } else {
        // check header or url parameters or post parameters for token
        var token = req.body.token;

        // decode token
        if (token) {
            console.log(token)
            // verifies secret and checks exp
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return res.json({
                        success: false,
                        statusCode: 401,
                        errMessage: 'Unauthorized Access: Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        } 
        else {

            // if there is no token
            // return an error
            return res.json({success: false, statusCode: 403, errMessage: 'Unauthorized Access: No token provided'});
            next();
        }
    }


});
//===============================MIDDLEWARE DONE===========================================================

//get Route API to just check route end point is working fine.
router.route('/')
    .get(IndexController.getWelcomeMessage);

//all request received at /conatctRequest end point would be received here and would be
// transfer to corresponding controller as per operation method.
router.route('/users')
    .get(UserController.user.getAllUsers)
    .post(validate(validation.register), UserController.user.register);

//==========Login end point('/api/login')===========================================
router.route('/login')
    .post(validate(validation.login), LoginController.login);
//export router module.
module.exports = router;