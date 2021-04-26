var jwt = require('jsonwebtoken');
var config = require('../config/config');

//============MIDDLEWARE TO CHECK TOKEN IS PROVIDED TO ACCESS END POINTS===================

module.exports = {
    permit: (roles = []) => {
        return [
            (req, res, next) => {
                var token = req.body.token;
                if (token) {
                    jwt.verify(token, config.secret, function (err, decoded) {
                        if (err) {
                            return res.json({
                                success: false, statusCode: 401, errMessage: 'Unauthorized Access: Failed to authenticate token.'
                            });
                        } else {
                            // if everything is good, save to request for use in other routes
                            req.user = decoded.user;
                            if (roles.length && !roles.includes(req.user.role)) {
                                return res.json({
                                    success: false, statusCode: 401, errMessage: 'Unauthorized Access: Failed to authenticate token.'
                                });
                            }
                            next();
                        }
                    });

                }
                else {
                    return res.json({ success: false, statusCode: 403, errMessage: 'Unauthorized Access: No token provided' });
                    next();
                }
            }
        ]
    }
}
//===============================MIDDLEWARE DONE===========================================================
