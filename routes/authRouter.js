import express from "express";

import AuthController from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { createUsersSchema } from "../schemas/usersSchemas.js";
// import authMiddleware from "../middlewares/auth.js";

const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post(
  "/register",
  validateBody(createUsersSchema),
  AuthController.register
);
authRouter.post(
  "/login",
  jsonParser,
  validateBody(createUsersSchema),
  AuthController.login
);

export default authRouter;
