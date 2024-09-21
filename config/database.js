const { Sequelize } = require('sequelize');
const dotenv = require('dotenv').config()

const dbName =process.env.DBNAME
const db =process.env.DB

const sequelize = new Sequelize(dbName, 'root', '', {
 host: 'localhost',
  dialect: db,
  port: 3306
});




module.exports = sequelize;
