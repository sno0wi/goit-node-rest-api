import Joi from "joi";

export const createUsersSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(5).max(30).required(),
});
