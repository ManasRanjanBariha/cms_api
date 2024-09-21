const { DataTypes } = require('sequelize');

const authenticationSchema = (sequelize) => {
    return {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      user_code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      role_code: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      token: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      created_by: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_by: {
        type: DataTypes.STRING(30),
        allowNull: true,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
        onUpdate: sequelize.literal('CURRENT_TIMESTAMP'),
      },
      record_status: {
        type: DataTypes.TINYINT,
        defaultValue: 1,
      },
    };
};

module.exports = authenticationSchema;
