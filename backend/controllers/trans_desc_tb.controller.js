const { sequelize, Trans_desc_tb } = require("../models/index");
const { QueryTypes } = require('sequelize');

const getAll = async (req, res, next) => {
    try {
        const records = await Trans_desc_tb.findAll();
        res.json({
            success: true,
            count: records.length,
            data: records,
        });
    } catch (error) {
        next(error);
    }
};


const getAC_Sub = async (req, res, next) => {
    try {       

        const records = await sequelize.query(
            `
            SELECT DISTINCT AC_Sub, AC_type
            FROM Trans_desc_tb
            WHERE AC_Sub IN ('LT', 'Thrift')
            `,
            {
                type: QueryTypes.SELECT
            }
        );

        res.json({
            success: true,
            count: records.length,
            data: records,
        });

    } catch (error) {
        next(error);
    }
};



const getById = async (req, res, next) => {
    try {
        const record = await Trans_desc_tb.findByPk(req.params.id);
        if (!record) {
            return res.status(404).json({
                success: false,
                message: `Transaction description record with Trans_des_ID=${req.params.id} not found`,
            });
        }
        res.json({ success: true, data: record });
    } catch (error) {
        next(error);
    }
};

module.exports = { getAll, getById, getAC_Sub };
