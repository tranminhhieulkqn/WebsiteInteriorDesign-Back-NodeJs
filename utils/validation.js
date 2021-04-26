const { validate, ValidationError, Joi } = require('express-validation')

/**
 * Define role of users
 */
 const roleOfUsers = ('user', 'designer', 'admin')

//contact request validation module for all parameters exist in req.body
module.exports.register = {
    // options: { flatten: true },
    body: Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        birthDate: Joi.string().required(),
        gender: Joi.boolean(),
        username: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        phone: Joi.string(),
        address: Joi.string(),
        role: Joi.string().valid(roleOfUsers).lowercase().required()
    })
};

module.exports.login = {
    // options: { flatten: true },
    body: Joi.object({
        username: Joi.string().required(), //Email should be as email format and required to be present in request body
        password: Joi.string().required() //Phone number should be number formatted and must be present in request body
    })
};

