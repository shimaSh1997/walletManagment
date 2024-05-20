const { validationResult, Result } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const multer = require("multer");
const path = require("path");
const Transaction = require("../models/Transaction.js");
const { userInfo } = require("os");
const { where } = require("sequelize");

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

exports.upload = multer({ storage });

exports.initiateDeposit = async (req, res, next) => {
  const userId = req.body.userId;
  const amount = req.body.amount;
  const accountId = req.body.accountId;
  console.log("req file:", req.file);
  const receiptPath = req.file ? req.file.path : null;
  //   console.log("receipt:",req.file.path)

  const transaction = await Transaction.create({
    userId,
    amount,
    accountId,
    transactionType: "deposit",
    description: `Deposit to bank account ${accountId}`,
    receiptPath,
  }).catch((err) => {
    console.log("Error occurred: ", err);
  });
  res
    .status(201)
    .json({ message: "initiate Deposit has been successful", transaction });
};

exports.confirmDeposit = async (req, res, next) => {
  const transactionId = req.params.id;

  // console.log("log transaction:", transactionId);
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id },
    });
    if (
      (!transaction || transaction.dataValues.transactionType !== "deposit",
      transaction?.dataValues.status !== "accepted")
    ) {
      return res.status(401).json({ message: "Deposit not found" });
    }
    const amount = transaction.dataValues.amount;
    const transactionType = transaction.dataValues.transactionType;
    // res.status(200).json({message:"test transaction" , transaction})
    await User.findOne({ where: { id: transaction.dataValues.id } }).then(
      async (user) => {
        const balance = user?.dataValues.balance;
        if (transactionType == "deposit") {
          await User.update(
            { balance: balance + amount },
            { where: { id: transaction.dataValues.id } }
          );
          return res
            .status(200)
            .json({ message: "deposit has been confirmed" });
        } else if (transactionType == "withdraw") {
          await User.update(
            { balance: balance - amount },
            { where: { id: transaction.dataValues.id } }
          );
          return res
            .status(200)
            .json({ message: "withdraw has been confirmed" });
        }
      }
    );
  } catch (err) {
    res.json({ message: err.message });
  }
};

