var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var IndexController = require('../controllers/indexController');

const urlPass = ['/', '/login', '/users/register'];

//============MIDDLEWARE TO CHECK TOKEN IS PROVIDED TO ACCESS END POINTS===================

router.use(function (req, res, next) {
    console.log(req.originalUrl);
    if (urlPass.includes(req.originalUrl)) {
        return next();
    } else {
        var token = req.body.token;
        if (token) {
            console.log(token)
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return res.json({
                        success: false, statusCode: 401, errMessage: 'Unauthorized Access: Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;
                    next();
                }
            });

        }
        else {
            return res.json({ success: false, statusCode: 403, errMessage: 'Unauthorized Access: No token provided' });
            next();
        }
    }

});

//===============================MIDDLEWARE DONE===========================================================

router.route('/')
    .get(IndexController.getWelcomeMessage);

module.exports = router;