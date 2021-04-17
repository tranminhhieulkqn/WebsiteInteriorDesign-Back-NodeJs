var User = require('../models/userModel');

exports.user = {
    register: function (req, res) {
        User.findOne({ username: req.body.email }, function (err, user) {
            if (err) {
                return res.json({ success: false, statusCode: 500, errorMessage: err });
            }
            if (user) {
                return res.json({ success: false, statusCode: 302, errorMessage: 'Email ID is already exist in system' });
            }
            else {
                var user = new User();
                user.firstName = req.body.firstName;
                user.lastName = req.body.lastName;
                user.username = req.body.email;
                user.password = req.body.password;
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