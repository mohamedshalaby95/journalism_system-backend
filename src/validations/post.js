const Joi = require("joi");

const addValidation= (body) => {
  const Schema = Joi.object({
    title: Joi.string().empty('').min(5).max(100).required(),
    description: Joi.string().empty('').min(20).required(),
    image: Joi.string().empty('').required(),
    category: Joi.string().empty('').required(),
    subCategory: Joi.string().empty('').required(),
    auther: Joi.string().empty('').required(),
    regien: Joi.string().empty('').required(),
  });
  return Schema.validate(body);
}
const delValidation=(body) => {
    const Schema = Joi.object({
      _id: Joi.string().empty('').required()
    });
    return Schema.validate(body);
  }
  const updateValidation= (body) => {
    const Schema = Joi.object({  
      _id:Joi.string().empty('').required(),
      title: Joi.string().empty('').min(5).max(100).required(),
      description: Joi.string().empty('').min(20).required(),
      image: Joi.string().empty('').required(),
      category: Joi.string().empty('').required(),
      subCategory: Joi.string().empty('').required(),
      auther: Joi.string().empty('').required(),
      region: Joi.string().empty('').required(),
    });
    return Schema.validate(body);
  }

module.exports ={addValidation ,delValidation,updateValidation}