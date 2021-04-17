var jwt = require('jsonwebtoken');  //generate a access token so all other end points can be secure.
var User = require('../models/user'); //User model so
var config = require('../config/config');  //load configuration parameters.

exports.login = function (req, res) {
    console.log("Log")
    User.findOne({ username: req.body.email }, function (err, user) {

        if (err) {
            res.json({ success: false, statusCode: 500, errorMessage: err });
        }

        if (!user) {
            res.json({ success: false, statusCode: 403, errorMessage: 'Authentication failed. User not found.' });
        } else if (user) {

            if (!user.comparePassword(req.body.password)) {
                res.json({success: false,statusCode: 403,errorMessage: 'Authentication failed. Wrong password.'});
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: '24h'
                });

                // return the information including token as JSON
                res.json({
                    success: true,
                    statusCode: 200,
                    message: 'You are logged in successfully!',
                    token: token
                });
            }

        }

    });
};