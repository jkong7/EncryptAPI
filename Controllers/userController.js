const { validationResult } = require('express-validator');

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const logger = require('../Configuration/logger');

const User = require('../Database Models/users');
const Token = require('../Database Models/token'); 




//Register controller function 
exports.register=async (req, res) => {
    //Checks if any errors were spotted during password validation middleware 
    const password_validation_errors=validationResult(req); 
    if (!errors.isEmpty()) {
        logger.error('Password validation failed during registration', { errors: errors.array() }); //Log the error internally (not displayed)
        return res.status(422).json({ errors: errors.array() }); //Send validation errors back to client as a json object literal 
    }
    //Otherwise register the user, attempt to log user into the databse
    const { username, password, email } = req.body; 
    const hashedPassword = await bcrypt.hash(password, 10); //Use bcrypt to hash the password with 10 salt rounds to increase security 

    try {
        const user = await User.create({
            username, 
            password: hashedPassword, 
            email
        });
        logger.info('User registered successfully', { username: username }); //User register succesfully, notify client and log
        res.status(201).send('User created successfully');
    } catch (error) {
        logger.error('Error logging user to database', { error: error.message }); //User unable to be logged into database
        res.status(500).send('Error creating user'); 
    }
}; //Uses async/await to handle asynchronous tasks--password hashing and database user creation without blocking the flow.





//Login controller function 
exports.login = async (req, res) => {
    const { username, password} = req.body; 
    try {
        const user = await User.findOne({where: { username }}); //Try to find matching user 
        if (!user) {
            logger.warn('User not found', { username }); 
            return res.status(404).send('User not found'); 
        }
        //Username found, columns now stored in "user", validate password against the hash
        const match = await bcrypt.compare(password, user.password); 
        if (!match) {
            logger.warn('Login failed: Invalid credentials', { username }); 
            return res.status(400).send("Invalid credentials"); 
        }
        //User succesfully logs in, generate JWT tokens
        //Header.payload.signature
        const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '15m'}); 
        const refreshToken = jwt.sign({ userId: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '3d' });

        //Log refershToken to database 
        await Token.create({
            userId: user.id, 
            token: refreshToken, 
            expires: new Date(Date.now() + 3*24*60*60*1000), //3 days 
            revoked: false
        });
        logger.info('User logged in successfully', { username: username}); 
        res.json({accessToken, refreshToken}); //Give out tokens 
    } catch (error) {
        logger.error('Login error', {error: error.message });
        res.status(500).send('Login error');
    }
};

//Refresh token controller function (generate new access token if refresh token is still valid)
exports.refreshToken = async(req, res) => {
    const {refreshtoken } = req.body; 
    //Checks if refreshToken is present 
    if (!refreshtoken) {
        return res.status(401).json({ message: "Refresh token required"}); 
    }
    try {
        const token = await Token.findOne({ where: { token: refreshtoken, revoked: false } });
        if (!token) {
            return res.status(401).json({ message: "Invalid or expired Refresh Token" });
        }
        //Process JWT payload and then generate a new accessToken (15m) for the user 
        const payload = jwt.verify(refreshtoken, process.env.REFRESH_TOKEN_SECRET);
        const newAccessToken = jwt.sign({ userId: payload.userId }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.json({ accessToken: newAccessToken });
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            res.status(403).json({ message: "Refresh token expired" });
        } else {
            res.status(403).json({ message: "Invalid refresh token" });
        }
    }
};
