const express = require('express');
const router = express.Router();

//User registration + User Login -> Authentification -> User Data Management flow 

//Authentification middleware functions: 
const { passwordValidationRules, loginRateLimiter, registerRateLimiter } = require('../Middleware/userMiddleware');

//Authentification controller functions: 
const { register, login, refreshToken } = require('../Controllers/userController');

//Routes to faciltate this flow, middleware -> pass -> controller -> pass
router.post('/register', passwordValidationRules, registerRateLimiter, register);
router.post('/login', loginRateLimiter, login);
router.post('/token', refreshToken); 

module.exports = router;
