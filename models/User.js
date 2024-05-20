const Sequelize = require("sequelize");
const sequelize = require("../util/database");

const User = sequelize.define("user", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  username: Sequelize.STRING,
  // firstName: {
  //   type: Sequelize.STRING,
  // },
  // lastName: {
  //   type: Sequelize.STRING,
  // },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  balance: {
    type: Sequelize.FLOAT,
    defaultValue:0
  }
  // isAdmin:{
  //   type:Sequelize.BOOLEAN
  // }
});

module.exports = User;
