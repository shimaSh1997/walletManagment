const express = require("express");
const { body, validationResult } = require("express-validator");
const adminAuthController = require("../controllers/adminAuth");
const depositController = require("../controllers/depositController");
const withdrawController = require("../controllers/withdrawController");
const { isAdmin } = require("../middleware/isAdmin.js");
const { verifyToken } = require("../middleware/isAuth");
const { upload_deposit } = require("../controllers/depositController")
const { upload_withdraw } = require("../controllers/withdrawController")

const router = express.Router();

// router for create admin if not any Exist in database
router.post("/admin_initialization", adminAuthController.adminInitiate)
// Login admin
router.post("/login", adminAuthController.postLogin);

// createAdmin route
router.post("/createAdmin", isAdmin, adminAuthController.createAdmin);

// user initialize deposit
router.post(
  "/deposit",
  verifyToken,
  upload_deposit.single("receipt"),
  depositController.initiateDeposit
);

// admin can just confirm deposit and change transaction type to accepted or rejected
router.post("/confirm/:id", depositController.confirmDeposit);
// // Payment routes
// router.post(
//   "/withdraw",
//   // verifyToken,
//   upload_withdraw.single("receipt"),
//   withdrawController.initiateWithdraw
// );
// router.post('/withdraw/:id', withdrawController.confirmWitdraw);

module.exports = router;
