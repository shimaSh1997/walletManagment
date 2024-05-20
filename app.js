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


// app.use(multer({dest:'images'}).single('image'))
// user and account
User.hasMany(Account)
Account.belongsTo(User)

User.hasMany(Transaction)
Transaction.belongsTo(User)

sequelize
  .sync({alter:true})
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });

app.use("/user", userAuthRoutes);
app.use("/admin",adminAuthRoutes)
// - Bank Account System: Users can define and manage their bank accounts.
app.use("/account",accountRouts)

// app.use("/user", userRoutes);
// app.use((error, req, res, next) => {
//   console.log(error);
//   const status = error.statusCode || 500;
//   const message = error.message;
//   const data = error.data;
//   res.status(status).json({ message: message, data: data });
// });
