const express = require("express");
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");
const sequelize = require("./util/database");
const userAuthRoutes = require("./routes/userAuth");
const adminAuthRoutes = require("./routes/adminAuth");
const accountRouts = require("./routes/account")
const Admin = require("./models/Admin")
const User = require("./models/User")
const Account = require("./models/BankAccount")
const Transaction = require("./models/Transaction");

const app = express();

app.use(bodyParser.json()); // application/json


// user and account
User.hasMany(Account)
Account.belongsTo(User)
// user and transaction
User.hasMany(Transaction)
Transaction.belongsTo(User)

sequelize
  .sync({ alter: true })
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/user", userAuthRoutes);
app.use("/admin", adminAuthRoutes)
// - Bank Account System: Users can define and manage their bank accounts.
app.use("/account", accountRouts)


// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});