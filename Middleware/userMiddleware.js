const { body } = require('express-validator');
const rateLimit = require('express-rate-limit');

//Thorough password validation middleware for the register route 
exports.passwordValidationRules = [
    body('password')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')

        .matches(/\d/).withMessage('Password must contain a number')

        .matches(/[@$!%*#?&]/).withMessage('Password must contain a special character'),

    body('email').isEmail().withMessage('Enter a valid email address'),

    body('username').not().isEmpty().withMessage('Username is required')
];

//Rate limiting middleware for the login route, stops route execution and does not proceed to controller function
exports.loginRateLimiter=rateLimit({
    windowMs: 15*60*1000, //15 min
    max: 5,
    message: "Too many login attempts, try again in 15 minutes"
})

//Rate limiting middleware for the register route, stops route execution and does not proceed to controller function
exports.registerRateLimiter=rateLimit({
    windowMs: 30*60*1000, //30 min
    max: 10,
    message: "Too many login attempts, try again in 30 minutes"
})
