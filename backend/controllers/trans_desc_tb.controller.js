const { Trans_desc_tb } = require("../models/index");

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

module.exports = { getAll, getById };
