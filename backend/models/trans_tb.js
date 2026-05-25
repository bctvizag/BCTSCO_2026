const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const trans_tb = sequelize.define(
  'trans_tb',
  {
    Trans_ID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ActionID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Trans_des_ID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Trans_dt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    CB_dt: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    ACID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    I_NO: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Cash_amt: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    Chq_amt: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    Adj_amt: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    Total_amt: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    PRN: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    PRN_D: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    PRN_C: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    PRN_B: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    INT: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    INT_D: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    INT_C: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    INT_B: {
      type: DataTypes.DECIMAL(18, 2),
      allowNull: true,
    },
    rate: {
      type: DataTypes.DECIMAL(18, 4),
      allowNull: true,
    },
    Days: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    T_Order: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    CreatedOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    CreatedBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    ModifiedOn: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    ModifiedBy: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    Remarks: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    CB_side: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    MEMID: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    Trans_desc: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    IntCalType: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    AC_Sub: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
  },
  {
    tableName: 'trans_tb',
    timestamps: false,
  }
);

module.exports = trans_tb;
