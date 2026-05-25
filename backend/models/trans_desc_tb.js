// SELECT [Trans_des_ID], [Head], [AC_Sub], [Trans_desc], [AC_type], [CB_side], [TransType], [I_type], [Post_type], [Memtype]   FROM [dbo].[trans_desc_tb]
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Trans_desc_tb = sequelize.define(
    'Trans_desc_tb',
    {
        Trans_des_ID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        Head: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        AC_Sub: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        Trans_desc: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        AC_type: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        CB_side: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        TransType: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        I_type: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        Post_type: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        Memtype: {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
    },
    {
        tableName: 'trans_desc_tb',
        timestamps: false,
    }
);

module.exports = Trans_desc_tb;
