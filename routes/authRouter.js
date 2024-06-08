import express from "express";

import AuthController from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import {
  createUsersSchema,
  verificationEmailSchema,
} from "../schemas/usersSchemas.js";
import authMiddleware from "../middlewares/auth.js";
import uploadMiddleware from "../middlewares/upload.js";
import resizeImage from "../middlewares/resizeImage.js";

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

authRouter.post("/logout", authMiddleware, AuthController.logout);

authRouter.get("/current", authMiddleware, AuthController.getCurrentUser);

authRouter.patch(
  "/avatars",
  authMiddleware,
  uploadMiddleware.single("avatarURL"),
  resizeImage,
  AuthController.changeAvatar
);

authRouter.get("/verify/:verificationToken", AuthController.verifyEmail);

authRouter.post(
  "/verify/",
  validateBody(verificationEmailSchema),
  AuthController.sendVerificationEmail
);

export default authRouter;
