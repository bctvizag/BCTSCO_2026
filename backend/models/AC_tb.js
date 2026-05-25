const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AC_tb = sequelize.define(
  'AC_tb',
  {
    ACID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    MemID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    AC_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    AC_Sub: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ACNO: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    DOC: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Amt: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    Period: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CloseDT: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    prn: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    int: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    rate: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: true,
    },
    Closed: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
    Remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    IntCalType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: 'AC_tb',
    timestamps: false,
  }
);

module.exports = AC_tb;
