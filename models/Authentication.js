const sequelize = require('../config/database');
const authenticationSchema = require('../schema/authenticationSchema');

const Authentication = sequelize.define('Authentication', authenticationSchema(sequelize), {
  tableName: 'authentication_table',
  timestamps: false, 
});

module.exports = Authentication;
