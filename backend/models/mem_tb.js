const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const mem_tb = sequelize.define(
  'mem_tb',
  {
    MemID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    Memtype: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    empno: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    gno: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    hrno: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    desgn: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    sex: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    DOB: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    DOA: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    DOR: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    DOM: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    DIV: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    subdiv: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    Status: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    Phone1: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
  },
  {
    tableName: 'mem_tb',
    timestamps: false,
  }
);

module.exports = mem_tb;
