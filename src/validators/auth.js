const { check, validationResult } = require("express-validator");

exports.validateSignupRequest = [
    check("email").isEmail().withMessage("invalid email"),
    check("password").isLength({ min: 5 }).withMessage("password should be contain atleast 5 characters")
]

exports.authRequestValidated = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        let error = [];
        errors.array().map((e) => error.push(e.msg));
        return res.status(403).json({ message: error });
    }
    next();
}

exports.validateSigninRequest = [
    check("email").isEmail().withMessage("invalid email"),
    check("password").notEmpty().withMessage("password is required").isLength({ min: 5 }).withMessage("password should be contain atleast 5 characters")
]
