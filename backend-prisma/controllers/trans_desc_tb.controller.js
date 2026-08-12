const prisma = require('../models');

const getAll = async (req, res, next) => {
  try {
    const records = await prisma.trans_desc_tb.findMany();
    res.json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

const getAC_Sub = async (req, res, next) => {
  try {
    const records = await prisma.trans_desc_tb.findMany({
      where: { AC_Sub: { in: ['LT', 'Thrift'] } },
      distinct: ['AC_Sub', 'AC_type'],
      select: { AC_Sub: true, AC_type: true },
    });
    res.json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const record = await prisma.trans_desc_tb.findUnique({
      where: { Trans_des_ID: Number(req.params.id) },
    });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Transaction description record with Trans_des_ID=${req.params.id} not found`,
      });
    }
    res.json({ success: true, data: record });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, getAC_Sub };
