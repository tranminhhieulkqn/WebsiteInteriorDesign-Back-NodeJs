var jwt = require('jsonwebtoken');
var User = require('../models/userModel');
var config = require('../config/config');
const { response } = require('express');

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
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            // Return an error if no user exists 
            if (!user) {
                return res.json({ success: false, statusCode: 403, errorMessage: 'Authentication failed. User not found.' });
            } else if (user) {
                // Matching passwords
                if (!user.comparePassword(infoUser.password)) {
                    return res.json({ success: false, statusCode: 403, errorMessage: 'Authentication failed. Wrong password.' });
                } else {
                    // Successful authentication => token creation with jwt. 
                    var token = jwt.sign({ user: user.toJSON() }, config.secret, {
                        expiresIn: '24h'
                    });
                    return res.json({ success: true, statusCode: 200, message: 'You are logged in successfully!', token: token });
                }

            }
        });
    },

    register: function (req, res) {
        // Get infor new user from req
        infoNewUser = req.body;
        // Check exist
        User.findOne({
            $or: [{ email: infoNewUser.email }]
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
                infoNewUser.username = infoNewUser.email
                var user = new User(infoNewUser);
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

    getUser: function (req, res) {
        // Get infor new user from req
        infoUser = req.body;
        maxGet = infoUser.maxGet ? infoUser.maxGet : 20;
        // If exists id, find user by ID or get all
        queryCommand = infoUser.id ? { _id: infoUser.id } : {};
        User.find(queryCommand, function (err, users) {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            //If able to fetch all users then send them in response in data key.
            return res.json({ success: true, statusCode: 200, users: users.slice(0, maxGet) });
        });
    },

    updateUser: function (req, res) {
        // Get infor new user from req
        infoNewUser = req.body;
        if (infoNewUser.birthDate) {
            infoNewUser.birthDate = new Date(infoNewUser.birthDate);
        }
        User.findByIdAndUpdate(infoNewUser.id, infoNewUser, { new: true }, function (err, updatedUser) {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            if (updatedUser === null) {
                return res.json({ success: false, statusCode: 404, errorMessage: 'User does not exist on the system!' })
            }
            return res.json({ success: true, statusCode: 200, updatedUser: updatedUser });
        });
    },

    deleteUser: function (req, res) {
        // Get infor new user from req
        infoUser = req.body;
        User.findByIdAndDelete(infoUser.id, function (err, deletedUser) {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            if (deletedUser === null) {
                return res.json({ success: false, statusCode: 404, errorMessage: 'User does not exist on the system!' })
            }
            return res.json({ success: true, statusCode: 200, deletedUser: deletedUser });
        });
    }
};