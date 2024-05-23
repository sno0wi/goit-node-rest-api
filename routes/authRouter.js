import express from "express";

import AuthController from "../controllers/authControllers.js";

const authRouter = express.Router();

authRouter.post("/register", AuthController.register);
