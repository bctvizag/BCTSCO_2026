const prisma = require('../models');
const { pickBody } = require('./_helpers');

const FIELDS = new Set(['ActionDesc', 'MemID', 'ActionDT']);

const getAll = async (req, res, next) => {
  try {
    const records = await prisma.action_TB.findMany();
    res.json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const record = await prisma.action_TB.findUnique({ where: { ActionID: Number(req.params.id) } });
    if (!record) return res.status(404).json({ success: false, message: `Action with ActionID=${req.params.id} not found` });
    res.json({ success: true, data: record });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const record = await prisma.action_TB.create({ data: pickBody(req.body, FIELDS) });
    res.status(201).json({ success: true, message: 'Action created successfully', data: record });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!await prisma.action_TB.findUnique({ where: { ActionID: id } })) {
      return res.status(404).json({ success: false, message: `Action with ActionID=${req.params.id} not found` });
    }
    const record = await prisma.action_TB.update({ where: { ActionID: id }, data: pickBody(req.body, FIELDS) });
    res.json({ success: true, message: 'Action updated successfully', data: record });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!await prisma.action_TB.findUnique({ where: { ActionID: id } })) {
      return res.status(404).json({ success: false, message: `Action with ActionID=${req.params.id} not found` });
    }
    await prisma.action_TB.delete({ where: { ActionID: id } });
    res.json({ success: true, message: `Action with ActionID=${req.params.id} deleted successfully` });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
