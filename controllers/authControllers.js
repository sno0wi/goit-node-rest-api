import * as fs from "node:fs/promises";
import bcrypt from "bcrypt";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import gravatar from "gravatar";
import path from "node:path";

import mail from "../mail.js";
import User from "../models/user.js";

async function register(req, res, next) {
  try {
    const { email, password } = req.body;
    const foundUser = await User.findOne({ email });
    if (foundUser !== null) {
      return res.status(409).send({ message: "Email in use" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomUUID();
    const avatarURL = gravatar.url(email, { s: "200", r: "pg", d: "mm" });

    mail.sendMail({
      to: email,
      from: "sno0wi20@gmail.com",
      subject: "Welcome to contact book",
      html: `To confirm you email please click on <a href="http://localhost:8080/users/verify/${verificationToken}">link</a>`,
      text: `To confirm you email please open the link http://localhost:8080/users/verify/${verificationToken}`,
    });

    const createdUser = await User.create({
      email,
      password: passwordHash,
      avatarURL,
      verificationToken,
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

    if (!user.verify) {
      return res
        .status(403)
        .send({ message: "Please verify your email to login" });
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

async function verifyEmail(req, res, next) {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken: verificationToken });
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    await User.findByIdAndUpdate(user._id, {
      verificationToken: null,
      verify: true,
    });

    res.status(200).send({ message: "Email confirm successfully!" });
  } catch (error) {
    next(error);
  }
}

async function sendVerificationEmail(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user == null)
      return res.status(404).send({ message: "User not found" });
    if (user.verify === true)
      return res
        .status(400)
        .send({ message: "Verification has already been passed" });

    mail.sendMail({
      to: email,
      from: "no-reply@gmail.com",
      subject: 'Reconfirmation of mail | "localhost:3000 "',
      html: `
        <h1>Welcome to the our site "localhost:3000"</h1>
        <p>Please click on the link below to verify your email</p>
        <a href="http://localhost:3000/users/verify/${user.verificationToken}">
          Link</a>`,
      text: `Welcome to the our site "localhost:3000"
        Please click on the link below to verify your email
        http://localhost:3000/users/verify/${user.verificationToken}`,
    });

    res.status(200).send({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
}

export default {
  register,
  login,
  logout,
  getCurrentUser,
  changeAvatar,
  verifyEmail,
  sendVerificationEmail,
};
