const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Authentication = require('./Authentication');
const applicantSchema = require('../schema/applicantSchema');

const Applicant = sequelize.define('Applicant', applicantSchema(sequelize), {
  tableName: 'applicant_table',
  timestamps: false,
});

module.exports = Applicant;
