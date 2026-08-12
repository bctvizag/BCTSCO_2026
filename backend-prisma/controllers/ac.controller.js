const prisma = require('../models');
const { pickBody } = require('./_helpers');

const AC_FIELDS = new Set([
  'MemID', 'AC_type', 'AC_Sub', 'ACNO', 'DOC', 'Amt', 'Period',
  'CloseDT', 'prn', 'int', 'rate', 'Closed', 'Remarks', 'IntCalType'
]);

const getAll = async (req, res, next) => {
  try {
    const records = await prisma.aC_tb.findMany();
    res.json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const record = await prisma.aC_tb.findUnique({ where: { ACID: Number(req.params.id) } });
    if (!record) return res.status(404).json({ success: false, message: `AC record with ACID=${req.params.id} not found` });
    res.json({ success: true, data: record });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const record = await prisma.aC_tb.create({ data: pickBody(req.body, AC_FIELDS) });
    res.status(201).json({ success: true, message: 'AC record created successfully', data: record });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.aC_tb.findUnique({ where: { ACID: id } });
    if (!existing) return res.status(404).json({ success: false, message: `AC with ACID=${req.params.id} not found` });
    const record = await prisma.aC_tb.update({ where: { ACID: id }, data: pickBody(req.body, AC_FIELDS) });
    res.json({ success: true, message: 'AC record updated successfully', data: record });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.aC_tb.findUnique({ where: { ACID: id } });
    if (!existing) return res.status(404).json({ success: false, message: `AC with ACID=${req.params.id} not found` });
    await prisma.aC_tb.delete({ where: { ACID: id } });
    res.json({ success: true, message: `AC with ACID=${req.params.id} deleted successfully` });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
