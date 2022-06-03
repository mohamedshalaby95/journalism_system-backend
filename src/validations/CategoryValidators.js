const Joi = require("joi");





module.exports = (body) => {
    const Schema = Joi.object({
   
    title: Joi.string().min(3).max(30).required(),
  });
  return Schema.validate(body);
};
