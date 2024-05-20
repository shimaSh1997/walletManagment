const express = require("express");
const { body, validationResult } = require("express-validator");
const { isAdmin } = require("../middleware/isAdmin.js");
const accountController = require("../controllers/accountController")
const router = express.Router();


router.post("/addAccount", accountController.addAccount)

module.exports = router;