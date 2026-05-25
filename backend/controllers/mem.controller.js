const { mem_tb } = require('../models');

// GET all Member records
const getAll = async (req, res, next) => {
  try {
    const records = await mem_tb.findAll();
    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// GET single Member record by MemID
const getById = async (req, res, next) => {
  try {
    const record = await mem_tb.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Member with MemID=${req.params.id} not found`,
      });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// POST create new Member record
const create = async (req, res, next) => {
  try {
    const record = await mem_tb.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Member created successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// PUT update Member record by MemID
const update = async (req, res, next) => {
  try {
    const [rowsAffected] = await mem_tb.update(req.body, {
      where: { MemID: req.params.id },
    });
    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: `Member with MemID=${req.params.id} not found or no changes made`,
      });
    }
    const updated = await mem_tb.findByPk(req.params.id);
    res.json({
      success: true,
      message: 'Member updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE Member record by MemID
const remove = async (req, res, next) => {
  try {
    const rowsAffected = await mem_tb.destroy({
      where: { MemID: req.params.id },
    });
    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: `Member with MemID=${req.params.id} not found`,
      });
    }
    res.json({
      success: true,
      message: `Member with MemID=${req.params.id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
