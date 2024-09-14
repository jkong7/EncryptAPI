const { DataTypes } = require('sequelize');
const sequelize = require('./index');  

//User table model: username, password, email, role, isactive bool 
const User = sequelize.define('User', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    role: {
        type: DataTypes.STRING,
        defaultValue: 'user' //default to user
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true //default to true (a registered user is active)
    }
});

module.exports = User;
