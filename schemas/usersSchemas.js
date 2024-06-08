import Joi from "joi";

export const createUsersSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email field cannot be empty",
    "any.required": "Email field is required",
  }),
  password: Joi.string().min(5).max(30).required().messages({
    "string.min": "Password must be at least 5 characters long",
    "string.max": "Password must not exceed 30 characters",
    "string.empty": "Password field cannot be empty",
    "any.required": "Password field is required",
  }),
});

export const verificationEmailSchema = Joi.object({
  email: Joi.string().email().required(),
});
