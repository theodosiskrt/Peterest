const joi = require('joi');

module.exports = joi.object({
    title: joi.string().required(),
    body: joi.string().required(),
    image:joi.string().allow('')
})