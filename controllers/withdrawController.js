const { validationResult, Result } = require("express-validator");
const Transaction = require("../models/Transaction.js");
const User = require("../models/User");
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

exports.upload_withdraw = multer({ storage });

exports.initiateWithdraw = async (req, res, next) => {
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
    transactionType: "withdraw",
    description: `Withdraw from bank account ${accountId}`,
    receiptPath,
  }).catch((err) => {
    console.log("Error occurred: ", err);
  });
  res
    .status(201)
    .json({ message: "initiate Withdraw has been successful", transaction });
};

exports.confirmWitdraw = async (req, res, next) => {
  const transactionId = req.params.id;
  // console.log("log transaction:", transactionId);
  try {
    const transaction = await Transaction.findOne({
      where: { id: req.params.id },
    });
    if (
      (!transaction || transaction.dataValues.transactionType !== "withdraw",
      transaction?.dataValues.status !== "pending")
    ) {
      return res.status(401).json({ message: "Withdraw not found" });
    }
    const amount = transaction.dataValues.amount;
    const transactionType = transaction.dataValues.transactionType;
    // res.status(200).json({message:"test transaction" , transaction})
    await User.findOne({ where: { id: transaction.dataValues.id } }).then(
      async (user) => {
        const balance = user?.dataValues.balance;
        if (user.dataValues.balance < amount) {
          return res.status(400).json({ message: "Insufficient balance." });
        }

        await User.update(
          { balance: balance - amount },
          { where: { id: transaction.dataValues.id } }
        );
        return res.status(200).json({ message: "withdraw has been confirmed" });
      }
    );
  } catch (err) {
    res.json({ message: err.message });
  }
};
