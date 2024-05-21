const express = require("express");
const { body, validationResult } = require("express-validator");
const { isAdmin } = require("../middleware/isAdmin.js");
const { verifyToken } = require("../middleware/isAuth")
const accountController = require("../controllers/accountController")
const router = express.Router();


router.post("/addAccount", [
    body('account_number')
        .trim()
        .notEmpty()
        .withMessage('Account number is required')
        .isNumeric()
        .withMessage('Account number must be numeric'),
    body('bank_name')
        .trim()
        .notEmpty()
        .withMessage('Bank name is required'),], verifyToken, accountController.addAccount)
module.exports = router;