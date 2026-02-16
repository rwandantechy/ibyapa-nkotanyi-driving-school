import response from "./response.js";

export default (schema, toValidate, res, next) => {
  const { error } = schema.validate(toValidate);
  return error
    ? response(res, 422, error.message, null, "VALIDATION_ERROR")
    : next();
};
