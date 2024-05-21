const express = require("express");
const { body, validationResult } = require("express-validator");
const userAuthController = require("../controllers/userAuth.js");
const { verifyToken } = require("../middleware/isAuth.js");
const signupValidator = require("../middleware/signupValidator");
const router = express.Router();

// User routes for signUp
router.post(
  "/signup",
  // Express Validator middleware for validation
  signupValidator,
  userAuthController.signUp
);
router.post("/login", userAuthController.login);

router.post("/forgetPassword", userAuthController.forget_password);
router.post("/resetPassword", userAuthController.reset_password);
// User routes for get wallet balance
router.get("/getWalletBalance", verifyToken, userAuthController.getBalance)
module.exports = router;
