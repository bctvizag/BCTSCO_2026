const prisma = require('../models');
const { pickBody } = require('./_helpers');

const FIELDS = new Set([
  'Memtype', 'empno', 'gno', 'hrno', 'name', 'desgn', 'sex',
  'DOB', 'DOA', 'DOR', 'DOM', 'DIV', 'subdiv', 'Status', 'Phone1'
]);

const getAll = async (req, res, next) => {
  try {
    const records = await prisma.mem_tb.findMany();
    res.json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const record = await prisma.mem_tb.findUnique({ where: { MemID: Number(req.params.id) } });
    if (!record) return res.status(404).json({ success: false, message: `Member with MemID=${req.params.id} not found` });
    res.json({ success: true, data: record });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const record = await prisma.mem_tb.create({ data: pickBody(req.body, FIELDS) });
    res.status(201).json({ success: true, message: 'Member created successfully', data: record });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!await prisma.mem_tb.findUnique({ where: { MemID: id } })) {
      return res.status(404).json({ success: false, message: `Member with MemID=${req.params.id} not found` });
    }
    const record = await prisma.mem_tb.update({ where: { MemID: id }, data: pickBody(req.body, FIELDS) });
    res.json({ success: true, message: 'Member updated successfully', data: record });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!await prisma.mem_tb.findUnique({ where: { MemID: id } })) {
      return res.status(404).json({ success: false, message: `Member with MemID=${req.params.id} not found` });
    }
    await prisma.mem_tb.delete({ where: { MemID: id } });
    res.json({ success: true, message: `Member with MemID=${req.params.id} deleted successfully` });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
