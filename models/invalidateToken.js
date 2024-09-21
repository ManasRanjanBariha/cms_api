
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); 

const InvalidateToken = sequelize.define('InvalidateToken', {
    token: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    revoked_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
}, {
    tableName: 'InvalidateTokens',
    timestamps: false,
});

module.exports = InvalidateToken;
