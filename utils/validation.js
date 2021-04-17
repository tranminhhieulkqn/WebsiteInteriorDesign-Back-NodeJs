const { validate, ValidationError, Joi } = require('express-validation')
//contact request validation module for all parameters exist in req.body
module.exports.register = {
    // options: { flatten: true },
    body: Joi.object({
        firstName: Joi.string(), //First Name should be a string otherwise send a error message
        lastName: Joi.string(),   //Last Name should be a string otherwise send a error message
        email: Joi.string().email().required(), //Email should be as email format and required to be present in request body
        password: Joi.string().required() //Phone number should be number formatted and must be present in request body
    })
};

module.exports.login = {
    // options: { flatten: true },
    body: Joi.object({
        email: Joi.string().email().required(), //Email should be as email format and required to be present in request body
        password: Joi.string().required() //Phone number should be number formatted and must be present in request body
    })
};

