const prisma = require('../models');
const { pickBody } = require('./_helpers');

const FIELDS = new Set([
  'Pay_Mode', 'ChqNo', 'ChqDt', 'Chqamt', 'ChaBank', 'ChqName',
  'ChqACNO', 'VrNo', 'VrDt', 'ACID', 'CrDt', 'Trans_ID'
]);

const getAll = async (req, res, next) => {
  try {
    const records = await prisma.chqdetails.findMany();
    res.json({ success: true, count: records.length, data: records });
  } catch (error) { next(error); }
};

const getById = async (req, res, next) => {
  try {
    const record = await prisma.chqdetails.findUnique({ where: { ChqID: Number(req.params.id) } });
    if (!record) return res.status(404).json({ success: false, message: `Cheque with ChqID=${req.params.id} not found` });
    res.json({ success: true, data: record });
  } catch (error) { next(error); }
};

const create = async (req, res, next) => {
  try {
    const record = await prisma.chqdetails.create({ data: pickBody(req.body, FIELDS) });
    res.status(201).json({ success: true, message: 'Cheque detail created successfully', data: record });
  } catch (error) { next(error); }
};

const update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!await prisma.chqdetails.findUnique({ where: { ChqID: id } })) {
      return res.status(404).json({ success: false, message: `Cheque with ChqID=${req.params.id} not found` });
    }
    const record = await prisma.chqdetails.update({ where: { ChqID: id }, data: pickBody(req.body, FIELDS) });
    res.json({ success: true, message: 'Cheque detail updated successfully', data: record });
  } catch (error) { next(error); }
};

const remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (!await prisma.chqdetails.findUnique({ where: { ChqID: id } })) {
      return res.status(404).json({ success: false, message: `Cheque with ChqID=${req.params.id} not found` });
    }
    await prisma.chqdetails.delete({ where: { ChqID: id } });
    res.json({ success: true, message: `Cheque with ChqID=${req.params.id} deleted successfully` });
  } catch (error) { next(error); }
};

module.exports = { getAll, getById, create, update, remove };
