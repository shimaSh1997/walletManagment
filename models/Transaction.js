const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const BankAccount = require("./BankAccount.js");
const User = require("./User")
const Transaction = sequelize.define("transaction", {
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
  amount: {
    type: Sequelize.FLOAT,
  },
  accountId: {
    type: Sequelize.INTEGER,
    allowNull: false,
    references: {
      model: BankAccount,
      key: "id",
    },
  },
  status: { type: Sequelize.DataTypes.ENUM("pending", "accepted","rejected"),
  defaultValue:"pending"
   },
  transactionType:{
    type:Sequelize.DataTypes.ENUM("deposit","withdrawal")
  },
  receiptPath: {
    type: Sequelize.STRING,
    allowNull: true, // Path to receipt file
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  }
});

module.exports = Transaction;
