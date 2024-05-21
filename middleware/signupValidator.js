const { body, validationResult } = require("express-validator")
const signupValidator = [
    body("email").isEmail().withMessage("Please provide a valid email address").normalizeEmail(),
    body("password")
        .isLength({ min: 6 }).trim().escape()
        .withMessage("Password must be at least 6 characters long"),
    body("confirmPassword").custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error("Password confirmation does not match password");
        }
        return true;
    }),

    (req, res, next) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() }) //returns validation errors if any
        }
        next()
    }
]

module.exports = signupValidator


