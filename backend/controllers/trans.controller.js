const { trans_tb } = require('../models');

// GET all Transaction records
const getAll = async (req, res, next) => {
  try {
    const { orderBy, order = "ASC", ...filters } = req.query;

  
    console.log("Query Params:", req.query);

    // Build WHERE condition dynamically
    const where = {};

    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== "") {
        where[key] = filters[key];
      }
    });

    // Build ORDER condition
    let orderCondition = [];

    if (orderBy) {
      orderCondition.push([
        orderBy,
        order.toUpperCase() === "DESC" ? "DESC" : "ASC",
      ]);
    }

    console.log("Filters:", where);
    console.log("Order:", orderCondition);

    const records = await trans_tb.findAll({
      where,
      order: orderCondition,
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

// GET single Transaction record by Trans_ID
const getById = async (req, res, next) => {
  try {
    const record = await trans_tb.findByPk(req.params.id);
    if (!record) {
      return res.status(404).json({
        success: false,
        message: `Transaction with Trans_ID=${req.params.id} not found`,
      });
    }
    res.json({ success: true, data: record });
  } catch (error) {
    next(error);
  }
};

// POST create new Transaction record
const create = async (req, res, next) => {
  try {
    const record = await trans_tb.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

// PUT update Transaction record by Trans_ID
const update = async (req, res, next) => {
  try {
    const [rowsAffected] = await trans_tb.update(req.body, {
      where: { Trans_ID: req.params.id },
    });
    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: `Transaction with Trans_ID=${req.params.id} not found or no changes made`,
      });
    }
    const updated = await trans_tb.findByPk(req.params.id);
    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE Transaction record by Trans_ID
const remove = async (req, res, next) => {
  try {
    const rowsAffected = await trans_tb.destroy({
      where: { Trans_ID: req.params.id },
    });
    if (rowsAffected === 0) {
      return res.status(404).json({
        success: false,
        message: `Transaction with Trans_ID=${req.params.id} not found`,
      });
    }
    res.json({
      success: true,
      message: `Transaction with Trans_ID=${req.params.id} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
