const express = require("express");
const { body, validationResult } = require("express-validator");
const adminAuthController = require("../controllers/adminAuth");
const depositController = require("../controllers/depositController");
const { isAdmin } = require("../middleware/isAdmin.js");
const { verifyToken } = require("../middleware/isAuth");

const router = express.Router();

// User routes for login
router.post("/login", adminAuthController.postLogin);

// createAdmin route
router.post("/createAdmin", isAdmin, adminAuthController.createAdmin);

router.post(
  "/deposit",
  verifyToken,
  depositController.upload.single("receipt"),
  depositController.initiateDeposit
);

// admin can just confirm deposit and change transaction type to accepted or rejected
router.post("/confirm/:id", depositController.confirmDeposit);
// Payment routes
// router.post('/withdraw/:id', depositController.confirmWithdraw);

module.exports = router;
