const { DataTypes } = require('sequelize');
const sequelize = require('./index');  

//Token table model: userID, token, expiration, and revoked bool
const Token = sequelize.define('Token', {
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    expires: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    revoked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
    }
});

module.exports = Token;
