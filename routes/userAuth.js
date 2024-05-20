const express = require("express");
const { body, validationResult } = require("express-validator");
const userAuthController = require("../controllers/userAuth.js");
const { verifyToken } = require("../middleware/isAuth.js");
const router = express.Router();

// User routes for signUp
router.post(
  "/signup",
  // Express Validator middleware for validation
  [
    body("email").isEmail().withMessage("Invalid Email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("password do not match");
      }
      return true;
    }),
  ],
  userAuthController.signUp
);
router.post("/login", userAuthController.login);

router.post("/forgetPassword", userAuthController.forget_password);
router.post("/resetPassword", userAuthController.reset_password);
// User routes for get wallet balance
router.get("/getWalletBalance" , userAuthController.getBalance)
module.exports = router;
