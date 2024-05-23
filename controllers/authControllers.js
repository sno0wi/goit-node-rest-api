import bycrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user.js";

async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }
    const passwordHash = await bycrypt.hash(password, 10);
    await User.create({ name, email, password: passwordHash });
    res.status(201).send({ message: "Registration successfully!" });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user === null) {
      console.log("Email");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      console.log("Password");
      return res
        .status(401)
        .send({ message: "Email or password is incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    await User.findByIdAndUpdate(user._id, { token }, { new: true });

    res.send({ token });
  } catch (error) {
    next(error);
  }
}

export default { register, login };
