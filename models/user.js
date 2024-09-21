// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/database'); 

// const User = sequelize.define('User', {
//   user_code: {
//     type: DataTypes.STRING(20),
//     allowNull: false,
//     primaryKey: true,
//   },
//   name: {
//     type: DataTypes.STRING(30),
//     allowNull: false,
//   },
//   phone: {
//     type: DataTypes.BIGINT,
//     allowNull: true,
//     unique: true,
//   },
//   email: {
//     type: DataTypes.STRING(40),
//     allowNull: true,
//     unique: true,
//   },
//   address: {
//     type: DataTypes.TEXT,
//     allowNull: true,
//   },
//   created_by: {
//     type: DataTypes.STRING(30),
//     allowNull: false,
//   },
//   created_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//   },
//   updated_by: {
//     type: DataTypes.STRING(30),
//     allowNull: true,
//   },
//   updated_at: {
//     type: DataTypes.DATE,
//     defaultValue: DataTypes.NOW,
//     onUpdate: DataTypes.NOW,
//   },
// }, {
//   tableName: 'user_table',
//   timestamps: false,
// });

// module.exports = User;
