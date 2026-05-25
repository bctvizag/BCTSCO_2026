const { Chqdetails } = require('../models');

// GET all Chqdetails records
const getAll = async (req, res, next) => {
  try {
    const records = await Chqdetails.findAll();
    res.json({
      success: true,
      count: records.length,
      data: records,
    });
  } catch (error) {
    next(error);
  }
};

// GET single Chqdetails record by ChqID
const getById = async (req, res, next) => {
  try {
    const record = await Chqdetails.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Cheque record with ChqID=${req.params.id} not found`,
      });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// POST create new Chqdetails record
const create = async (req, res, next) => {
  try {
    const record = await Chqdetails.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Cheque record created successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// PUT update Chqdetails record by ChqID
const update = async (req, res, next) => {
  try {
    const [rowsAffected] = await Chqdetails.update(req.body, {
      where: { ChqID: req.params.id },
    });
    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: `Cheque record with ChqID=${req.params.id} not found or no changes made`,
      });
    }
    const updated = await Chqdetails.findByPk(req.params.id);
    res.json({
      success: true,
      message: 'Cheque record updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE Chqdetails record by ChqID
const remove = async (req, res, next) => {
  try {
    const rowsAffected = await Chqdetails.destroy({
      where: { ChqID: req.params.id },
    });
    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: `Cheque record with ChqID=${req.params.id} not found`,
      });
    }
    res.json({
      success: true,
      message: `Cheque record with ChqID=${req.params.id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
