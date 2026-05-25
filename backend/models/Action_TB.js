const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Action_TB = sequelize.define(
  'Action_TB',
  {
    ActionID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ActionDesc: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    MemID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    ActionDT: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    tableName: 'Action_TB',
    timestamps: false,
  }
);

module.exports = Action_TB;
