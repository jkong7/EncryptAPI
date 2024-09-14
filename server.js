const express = require('express');
const userRoutes = require('./Routes/userRoutes');

const app = express();
app.use(express.json()); //Middleware to parse JSON bodies

//Route for user-related stuff
app.use('/api/users', userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`); 
});

//Error handler
app.use((err, req, res, next) => {
    const statusCode =err.statusCode || 500; //Default to 500 if no statusCode
    res.status(statusCode).json({
        message: err.message,
        stack: process.env.NODE_ENV=== 'development' ? err.stack : undefined //Only show stack in dev mode
    });
});
