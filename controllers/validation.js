const Joi = require('joi')

//crear componente registerValidation

const registerValidation = (data) => {
    const schema = Joi.object({
        Name: Joi.string().required(),
        Email: Joi.string().min(6).required().email(),
        Password: Joi.string().min(6).required(),
        LastName: Joi.string().required(),
        Users: Joi.string().required(),
        Rol: Joi.required()
    });
    return schema.validate(data);
}

const loginValidation = (data) => {
    const schema = Joi.object({
        Email: Joi.string().min(6).required().email(),
        Password: Joi.string().min(6).required()
    });
    return schema.validate(data);
}

module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;