const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const PasswordResetToken = require("../models/passwordsResetToken");
const { Op } = require("sequelize");
// user flow for signUp
exports.signUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  if (email) {
    try {
      const user = await User.findAll({ where: { email: email } });
      if (user.length > 0) {
        return res.status(400).json({ message: "User Exist " });
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      User.create({
        username: username,
        email: email,
        password: hashedPassword,
        isAdmin: false,
      });
      res.status(201).json({ message: "User successfully created" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

exports.login = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    User.findOne({ where: { username: username } }).then((user) => {
      if (!user) {
        return res
          .status(401)
          .json({ message: "Invalid username or passwords" });
      }
      bcrypt
        .compare(password, user.dataValues.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            return res
              .status(401)
              .json({ message: "Invalid username or passwords" });
          }
        });
      const token = jwt.sign({ userId: user.dataValues.id }, "your_secret_key");
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
const generateToken = (userId) => {
  const token = jwt.sign({ userId }, "your_secret_key", { expiresIn: "1h" });
  return token;
};
const sendToken = async (userId, email) => {
  const token = generateToken(userId);
  const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now
  return await PasswordResetToken.create({ userId, token, expiresAt });
};
// reset password route for user
exports.forget_password = async (req, res, next) => {
  const email = req.body.email;

  const user = await User.findOne({ where: { email: email } });
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  const token = await sendToken(user.dataValues.id, email);
  return res
    .status(200)
    .json({ token: token, message: "Token sent successfully." });
};
exports.reset_password = async (req, res, next) => {
  const email = req.body.email;
  const token = req.body.token;
  const newPassword = req.body.password;

  const user = await User.findOne({ where: { email: email } });
  // console.log("user: ",user)
  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }
  // toDo
  const resetToken = await PasswordResetToken.findOne({
    userId: user.dataValues.id,
    token,
    expiresAt: { [Op.gt]: new Date() }, //check if token is not expired
  });
  console.log("test:", resetToken);
  if (!resetToken) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
  await user.update({ password: newPassword });
  // await user.destroy(resetToken);
  return res.status(200).json({ message: "Password reset successful." });
};
exports.getBalance = async (req, res, next) => {
  const userId = req.body.userId

  await User.findOne({ where: userId })
    .then(result => {
      if(!result){
        return res.status(404).json({ message: "User not found." });
      }
      res.json({message:"get balance from user successfully", result})
    })
    .catch((err) => {
      console.log("Error get balance: ", err);
    });
};
