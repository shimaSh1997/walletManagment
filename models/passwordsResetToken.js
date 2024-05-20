const Sequelize = require("sequelize");
const sequelize = require("../util/database");
// models/PasswordResetToken.js


const PasswordResetToken = sequelize.define('PasswordResetToken', {
  userId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  token: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  expiresAt: {
    type: Sequelize.DATE,
    allowNull: false,
  },
});

module.exports = PasswordResetToken;