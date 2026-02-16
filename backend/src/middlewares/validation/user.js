import validator from "../../utils/validator.js";
import userSignupSchema from "./schemas/user/signup.js";
import userLoginSchema from "./schemas/user/login.js"

export const userSignupValidation = (req, res, next) => {
 
  validator(userSignupSchema, req.body, res, next);
};
export const userLoginValidation = (req, res, next) => {
  validator(userLoginSchema, req.body, res, next);
};

