const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin")
exports.postLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    Admin.findOne({ where: { username: username } }).then((admin) => {
      if (!admin) {
        return res
          .status(401)
          .json({ message: "Invalid username or passwords" });
      }
      bcrypt
        .compare(password, admin.dataValues.password)
        .then((isPasswordValid) => {
          if (!isPasswordValid) {
            return res
              .status(401)
              .json({ message: "Invalid username or passwords" });
          }
        });
      const token = jwt.sign({ userId: admin.dataValues.id,isAdmin:true}, "your_secret_key");
      res.json({ token });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAdmin = async (req, res, next) => {
  const email = req.body.email;
  const admin = await Admin.findOne({ where: { email: email } });
  if (!admin) {
    await Admin.create(
        req.body);
        res.status(201).json("admin successfully created")
  }
  else{
    res.status(500).json({ message:"Admin Exist" });
  }
};
