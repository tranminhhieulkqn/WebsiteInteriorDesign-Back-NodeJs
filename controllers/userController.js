var jwt = require('jsonwebtoken');
var User = require('../models/userModel');
var config = require('../config/config');

module.exports = {
    login: function (req, res) {
        // Get infor new user from req
        infoUser = req.body;
        // Check user by email, username, phone
        User.findOne({
            $or: [{ username: infoUser.username }, { email: infoUser.username }, { phone: infoUser.username }]
        }, function (err, user) {
            // Returns an error if it exists
            if (err) {
                res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            // Return an error if no user exists 
            if (!user) {
                res.json({ success: false, statusCode: 403, errorMessage: 'Authentication failed. User not found.' });
            } else if (user) {
                // Matching passwords
                if (!user.comparePassword(infoUser.password)) {
                    res.json({ success: false, statusCode: 403, errorMessage: 'Authentication failed. Wrong password.' });
                } else {
                    // Successful authentication => token creation with jwt. 
                    var token = jwt.sign(user.toJSON(), config.secret, {
                        expiresIn: '24h'
                    });
                    res.json({ success: true, statusCode: 200, message: 'You are logged in successfully!', token: token });
                }
    
            }
        });
    },

    register: function (req, res) {
        // Get infor new user from req
        infoNewUser = req.body;
        // Check exist
        User.findOne({
            $or: [{ username: infoNewUser.username }, { email: infoNewUser.email }, { phone: infoNewUser.phone }]
        }, function (err, user) {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            if (user) {
                return res.json({
                    success: false, statusCode: 302,
                    errorMessage: 'User is already exist in system!'
                });
            }
            else { // If user is not in system.
                var user = new User({
                    firstName: infoNewUser.firstName,
                    lastName: infoNewUser.lastName,
                    birthDate: new Date(infoNewUser.birthDate),
                    gender: infoNewUser.gender,
                    username: infoNewUser.username,
                    password: infoNewUser.password,
                    phone: infoNewUser.phone,
                    email: infoNewUser.email,
                    address: infoNewUser.address,
                    role: infoNewUser.role
                });
                user.save(function (err) {
                    if (err) {
                        return res.json({ success: false, statusCode: 500, errorMessage: err });
                    }
                    //If execution is success then send response as user is registered successfully.
                    return res.json({ success: true, statusCode: 200, message: "User has been registered successfully" });
                });
            }
        });
    },

    getAllUsers: function (req, res) {
        User.find({}, function (err, users) {

            if (err) {
                res.json({ success: false, statusCode: 500, errorMessage: err });
            }

            //If able to fetch all users then send them in response in data key.
            res.json({ success: true, statusCode: 200, data: users });

        })

    }
};