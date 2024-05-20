const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("../models/User");

const BankAccount = sequelize.define("bankAccount", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: "id",
    },
  },
  account_number: {
    type: Sequelize.STRING,
  },
  bank_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  cvv2: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }
});

module.exports = BankAccount;
