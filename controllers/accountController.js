const { validationResult } = require("express-validator");
const BankAccount = require("../models/BankAccount");

exports.addAccount = async (req, res, next) => {
  const account_number = req.body.account_number;
  const bank_name = req.body.bank_name
  const cvv2 = req.body.cvv2
  const userId = req.userId
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  console.log("log account number:", req.body);
  try {
    const account = await BankAccount.findAll({ where: { account_number } });
    console.log("test:", account);
    if (account.length > 0) {
      return res.status(400).json({ message: "duplicate bank account" });
    }
    const newAccount = await BankAccount.create({ account_number, bank_name, cvv2, userId });
    console.log("test:", newAccount);
    res.status(201).json({ meesage: "Bank account has been added successfully", account: newAccount });
  } catch (error) {
    next(error)
  }
};
