const { validationResult, Result } = require("express-validator");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const path = require("path");
const Transaction = require("../models/Transaction.js");
const multer = require("multer");


// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

exports.upload_deposit = multer({ storage });

exports.initiateDeposit = async (req, res, next) => {
  // Validate the request body
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors })
  }
  const userId = req.userId;
  // console.log("userrrr id: ",userId)
  const amount = req.body.amount;
  const accountId = req.body.accountId;
  // console.log("req file:", req.file);
  const receiptPath = req.file ? req.file.path : null;
  console.log("receipt:", req.file.path)

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
  console.log("in initiat deposit::: ", transaction)
  res
    .status(201)
    .json({ message: "initiate Deposit has been successful", transaction });
};

exports.confirmDeposit = async (req, res, next) => {
  const transactionId = req.params.id;

  // console.log("log transaction:", transactionId);
  try {
    const transaction = await Transaction.findOne({
      where: { id: transactionId },
    });
    if (
      (!transaction || transaction.dataValues.transactionType !== "deposit",
        transaction?.dataValues.status !== "pending")
    ) {
      return res.status(401).json({ message: "Deposit not found" });
    }
    const amount = transaction.dataValues.amount;
    // const transactionType = transaction.dataValues.transactionType;
    // res.status(200).json({message:"test transaction" , transaction})
    await User.findOne({ where: { id: transaction.dataValues.id } }).then(
      async (user) => {
        const balance = user?.dataValues.balance;
        await User.update(
          { balance: balance + amount },
          { where: { id: transaction.dataValues.id } }
        );
        // console.log("user: ", user)
        // const status = transaction.dataValues.status
        // await Transaction.update({ status: 'confirmed' }, { where: { id: transactionId} })
        // .catch(err => { console.log("Errrr:", err) })
        return res
          .status(200)
          .json({ message: "deposit has been confirmed" });

      }
    );
  } catch (err) {
    res.json({ message: err.message });
  }
};

