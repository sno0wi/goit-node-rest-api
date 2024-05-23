import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const user = await User.findById({ email });
    if (user !== null) {
      return res.status(409).send({ message: "User already registered" });
    }
    const passwordHash = await bycrypt.hash(password, 10);
    await User.create({ name, email, password: passwordHash });
    res.status(201).send({ message: "Registration successfully!" });
  } catch (error) {
    next(error);
  }
}

export default { register };
