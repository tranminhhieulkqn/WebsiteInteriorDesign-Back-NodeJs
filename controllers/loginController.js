var jwt = require('jsonwebtoken');
var User = require('../models/userModel');
var config = require('../config/config');

exports.login = function (req, res) {
    User.findOne({ username: req.body.email }, function (err, user) {

        if (err) {
            res.json({ success: false, statusCode: 500, errorMessage: err });
        }

        if (!user) {
            res.json({ success: false, statusCode: 403, errorMessage: 'Authentication failed. User not found.' });
        } else if (user) {

            if (!user.comparePassword(req.body.password)) {
                res.json({ success: false, statusCode: 403, errorMessage: 'Authentication failed. Wrong password.' });
            } else {
                
                var token = jwt.sign(user.toJSON(), config.secret, {
                    expiresIn: '24h'
                });

                res.json({ success: true, statusCode: 200, message: 'You are logged in successfully!', token: token });
            }

        }

    });
};