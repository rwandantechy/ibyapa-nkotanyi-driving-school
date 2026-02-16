import Joi from "joi";

export default Joi.object({
  name: Joi.string()
    .min(4)
    .required()
    .error(new Error("Full name must be at least 4 characters long.")),

  language: Joi.string()
    .required()
    .error(new Error("Language must be provided.")),

  phone: Joi.string()
    .min(10)
    .required()
    .error(new Error("Phone number must be at least 10 digits long.")),
 
  password: Joi.string()
    .min(8)
    .required()
    .error(new Error("Password must be at least 8 characters long.")),
  role: Joi.string().max(8),
});
