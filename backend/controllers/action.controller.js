const { Action_TB } = require('../models');

// GET all Action records
const getAll = async (req, res, next) => {
  try {
    const records = await Action_TB.findAll();
    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// GET single Action record by ActionID
const getById = async (req, res, next) => {
  try {
    const record = await Action_TB.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Action record with ActionID=${req.params.id} not found`,
      });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// POST create new Action record
const create = async (req, res, next) => {
  try {
    const record = await Action_TB.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Action record created successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// PUT update Action record by ActionID
const update = async (req, res, next) => {
  try {
    const [rowsAffected] = await Action_TB.update(req.body, {
      where: { ActionID: req.params.id },
    });
    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: `Action record with ActionID=${req.params.id} not found or no changes made`,
      });
    }
    const updated = await Action_TB.findByPk(req.params.id);
    res.json({
      success: true,
      message: 'Action record updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE Action record by ActionID
const remove = async (req, res, next) => {
  try {
    const rowsAffected = await Action_TB.destroy({
      where: { ActionID: req.params.id },
    });
    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: `Action record with ActionID=${req.params.id} not found`,
      });
    }
    res.json({
      success: true,
      message: `Action record with ActionID=${req.params.id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
