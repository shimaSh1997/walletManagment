const { validationResult } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const { Op } = require("sequelize");

exports.adminInitiate = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const email = req.body.email;

  if (!username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    Admin.findAll({
      where: {
        [Op.and]: [
          { username: { [Op.is]: null } },
          { email: { [Op.is]: null } },
          { password: { [Op.is]: null } },
        ],
      },
    }).then(async (adminData) => {
      console.log("adminnnnn log: ", adminData.length);
      if (adminData.length == 0) {
        await Admin.create({
          username: username,
          password: hashedPassword,
          email: email,
        });
        res.json({ message: "admin created successfully" });
      } else {
        res.json({ message: "We have a at least one admin in Admin database" });
      }
    });
  } catch (err) {
    next(err);
  }
};

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
      // create token for admin for upgrade admin priviledge
      const token = jwt.sign(
        { userId: admin.dataValues.id, isAdmin: true },
        "your_secret_key"
      );
      res.json({ token });
    });
  } catch (error) {
    // res.status(500).json({ error: error.message });
    next(err);
  }
};

exports.createAdmin = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const admin = await Admin.findOne({ where: { email: email } });
  if (!admin) {
    await Admin.create(req.body);
    res.status(201).json("admin successfully created");
  } else {
    res.status(500).json({ message: "Admin Exist" });
  }
};
