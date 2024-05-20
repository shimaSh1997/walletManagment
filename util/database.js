const Sequelize = require("sequelize").Sequelize;

const sequelize = new Sequelize("testproject", "root", "test@1376", {
  dialect:'mysql',
  host:'localhost'
});
module.exports = sequelize;
