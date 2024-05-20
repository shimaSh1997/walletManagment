const { validationResult } = require("express-validator");
const BankAccount = require("../models/BankAccount");
exports.addAccount = async (req, res, next) => {
  const account_number = req.body.account_number;
  console.log("log account number:", req.body);
  try {
    const account = await BankAccount.findAll({ where: { account_number } });
    console.log("test:", account);
    if (account.length > 0) {
      return res.status(400).json({ message: "duplicate bank account" });
    }
    await BankAccount.create(req.body);
    res.status(201).json("Bank account has been add successfully");
  } catch (err) {
    res.json({ message: err.message });
  }
};
