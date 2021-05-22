const jwt = require('jsonwebtoken');
const configs = require('../configs/configs');

//============MIDDLEWARE TO CHECK TOKEN IS PROVIDED TO ACCESS END POINTS===================
module.exports = {
    roles: {
        admin: 'admin',
        designer: 'designer',
        customer: 'customer'
    },
    permit: (roles = []) => {
        return [
            (req, res, next) => {
                try {
                    var token = req.body.token;
                    if (!token)
                        return res.status(403).json({
                            success: false,
                            message: 'unauthorized access: no token provided.'
                        })
                    var decoded = jwt.verify(token, configs.secretKey);
                    if (!decoded || (roles.length && !roles.includes(decoded.userData.role)))
                        return res.status(401).json({
                            success: false,
                            message: 'unauthorized access: failed to authenticate token.'
                        })
                    next();
                } catch (error) { // cacth error
                    // show error to console
                    console.error(error.message);
                    // return error message
                    return res.status(500).json({
                        success: false,
                        message: error.message
                    })
                }
            }
        ]
    }
}

//===============================MIDDLEWARE DONE===========================================================
