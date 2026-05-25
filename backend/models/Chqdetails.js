const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Chqdetails = sequelize.define(
  'Chqdetails',
  {
    ChqID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Pay_Mode: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ChqNo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    ChqDt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Chqamt: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    ChaBank: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ChqName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ChqACNO: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    VrNo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    VrDt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ACID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CrDt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    Trans_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    tableName: 'Chqdetails',
    timestamps: false,
  }
);

module.exports = Chqdetails;
