const Joi = require('joi');


module.exports.projectSchema = Joi.object({
    project: Joi.object({
        title: Joi.string().required(),
        description: Joi.string().empty(''),
        projectUrl: Joi.string().empty(''),
        github: Joi.string().empty(''),
        projectTech: Joi.array().single(),
    }).required()
})