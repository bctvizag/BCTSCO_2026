const prisma = require('../models');
const { buildWhere, pickBody, convertValue, INT_FIELDS, DECIMAL_FIELDS, DATE_FIELDS } = require('./_helpers');

const FIELDS = new Set([
  'ActionID', 'Trans_des_ID', 'Trans_dt', 'CB_dt', 'ACID', 'I_NO',
  'Cash_amt', 'Chq_amt', 'Adj_amt', 'Total_amt', 'PRN', 'PRN_D',
  'PRN_C', 'PRN_B', 'INT', 'INT_D', 'INT_C', 'INT_B', 'rate', 'Days',
  'Status', 'T_Order', 'CreatedOn', 'CreatedBy', 'ModifiedOn',
  'ModifiedBy', 'Remarks', 'CB_side', 'MEMID', 'Trans_desc',
  'IntCalType', 'AC_Sub', 'INT_M', 'Trans_ID'
]);

const include = {
  account: { select: { ACID: true, ACNO: true } },
  member: { select: { gno: true, name: true } },
};

const getAll = async (req, res, next) => {
  try {
    const { orderBy, order = 'ASC' } = req.query;
    const where = buildWhere(req.query, FIELDS);
    const args = {
      where,
      include,
      take: 2000,
    };

    if (orderBy) {
      if (!FIELDS.has(orderBy)) {
        return res.status(400).json({ success: false, message: `Invalid orderBy field: ${orderBy}` });
      }
      args.orderBy = { [orderBy]: String(order).toUpperCase() === 'DESC' ? 'desc' : 'asc' };
    }

    const records = await prisma.trans_tb.findMany(args);
    res.json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const record = await prisma.trans_tb.findUnique({
      where: { Trans_ID: Number(req.params.id) },
      include,
    });
    if (!record) return res.status(404).json({ success: false, message: `Transaction with Trans_ID=${req.params.id} not found` });
    res.json({ success: true, data: record });
  } catch (error) { next(error); }
};

const getByAcid = async (req, res, next) => {
  try {
    const records = await prisma.trans_tb.findMany({
      where: { ACID: Number(req.params.acid) },
      include,
    });
    if (!records.length) {
      return res.status(404).json({ success: false, message: `No transactions found for ACID=${req.params.acid}` });
    }
    res.json({ success: true, data: records });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const record = await prisma.trans_tb.create({ data: pickBody(req.body, FIELDS) });
    res.status(201).json({ success: true, message: 'Transaction created successfully', data: record });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!await prisma.trans_tb.findUnique({ where: { Trans_ID: id } })) {
      return res.status(404).json({ success: false, message: `Transaction with Trans_ID=${req.params.id} not found` });
    }
    const record = await prisma.trans_tb.update({ where: { Trans_ID: id }, data: pickBody(req.body, FIELDS) });
    res.json({ success: true, message: 'Transaction updated successfully', data: record });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!await prisma.trans_tb.findUnique({ where: { Trans_ID: id } })) {
      return res.status(404).json({ success: false, message: `Transaction with Trans_ID=${req.params.id} not found` });
    }
    await prisma.trans_tb.delete({ where: { Trans_ID: id } });
    res.json({ success: true, message: `Transaction with Trans_ID=${req.params.id} deleted successfully` });
  } catch (error) { next(error); }
};

const FilterByColumn = async (req, res, next) => {
  try {
    const { column, value } = req.body || {};
    if (!FIELDS.has(column)) {
      return res.status(400).json({ success: false, message: `Invalid filter column: ${column}` });
    }
    const records = await prisma.trans_tb.findMany({
      where: { [column]: convertValue(column, value) },
      include,
    });
    res.json({ success: true, data: records });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, getByAcid, create, update, remove, FilterByColumn };
