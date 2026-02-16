import Joi from "joi";

export default Joi.object({
  account: Joi.string()
    .min(4)
    .required()
    .error(new Error("Phone  must be valid")),
  password: Joi.string()
    .min(8)
    .required()
    .error(new Error("Password must be at least 8 characters long.")),
  role: Joi.string().max(8),
});
