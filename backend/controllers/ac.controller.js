const { AC_tb, mem_tb } = require('../models');

// GET all AC records
const getAll = async (req, res, next) => {
  try {
    const records = await AC_tb.findAll({
      include: [
        {
          model: mem_tb,
          as: 'member',
          attributes: ['name', 'desgn', 'gno'],
        },
      ],
    });
    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// GET single AC record by ACID
const getById = async (req, res, next) => {
  try {
    const record = await AC_tb.findByPk(req.params.id, {
      include: [
        {
          model: mem_tb,
          as: 'member',
          attributes: ['name', 'desgn', 'gno'],
        },
      ],
    });
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `AC record with ACID=${req.params.id} not found`,
      });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// POST create new AC record
const create = async (req, res, next) => {
  try {
    const record = await AC_tb.create(req.body);
    res.status(201).json({
      success: true,
      message: 'AC record created successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// PUT update AC record by ACID
const update = async (req, res, next) => {
  try {
    const [rowsAffected] = await AC_tb.update(req.body, {
      where: { ACID: req.params.id },
    });
    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: `AC record with ACID=${req.params.id} not found or no changes made`,
      });
    }
    const updated = await AC_tb.findByPk(req.params.id, {
      include: [
        {
          model: mem_tb,
          as: 'member',
          attributes: ['name', 'desgn', 'gno'],
        },
      ],
    });
    res.json({
      success: true,
      message: 'AC record updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE AC record by ACID
const remove = async (req, res, next) => {
  try {
    const rowsAffected = await AC_tb.destroy({
      where: { ACID: req.params.id },
    });
    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: `AC record with ACID=${req.params.id} not found`,
      });
    }
    res.json({
      success: true,
      message: `AC record with ACID=${req.params.id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
