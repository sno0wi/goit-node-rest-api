import * as fs from "node:fs/promises";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "node:path";

import User from "../models/user.js";

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser !== null) {
      return res.status(409).send({ message: "Email in use" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });
    const createdUser = await User.create({
      email,
      password: passwordHash,
      avatarURL,
    });

    res.status(201).send({
      user: {
        email: createdUser.email,
        subscription: createdUser.subscription,
        avatarURL,
      },
    });
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

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { token },
      { new: true }
    );

    res.status(200).send({
      token,
      user: {
        email: updatedUser.email,
        password: updatedUser.password,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    const findUser = await User.findById(req.user.id);
    if (findUser === null) {
      return res.status(401).send({ message: "Not authorized" });
    }
    await User.findByIdAndUpdate(req.user.id, { token: null }, { new: true });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

async function getCurrentUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).send({ message: "Not authorized" });
    }
    res.status(200).send({
      email: user.email,
      subscription: user.subscription,
    });
  } catch (error) {
    next(error);
  }
}

async function changeAvatar(req, res, next) {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).send({ message: "Not authorized" });
    }

    if (!req.file || !req.file.filename) {
      return res.status(400).send({ message: "No file uploaded" });
    }

    const newPath = path.resolve("public", "avatars", req.file.filename);
    try {
      await fs.rename(req.file.path, newPath);
    } catch (error) {
      await fs.unlink(req.file.path);
      next(error);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { avatarURL: `/avatars/${req.file.filename}` },
      { new: true }
    );

    res.status(200).send({ avatarURL: updatedUser.avatarURL });
  } catch (error) {
    next(error);
  }
}

export default { register, login, logout, getCurrentUser, changeAvatar };
