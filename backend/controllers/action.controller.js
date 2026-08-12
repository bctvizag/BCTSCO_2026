const { Action_TB, trans_tb, AC_tb, mem_tb } = require('../models');

// GET all Action records
const getAll = async (req, res, next) => {
  try {
    const records = await Action_TB.findAll({
      include: [
        { model: trans_tb, as: 'transactions',
          include: [
            { model: AC_tb, as: 'account', attributes: ['ACID', 'ACNO'] },
            { model: mem_tb, as: 'member', attributes: ['gno', 'name'] },
          ]
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

// GET single Action record by ActionID
const getById = async (req, res, next) => {
  try {
    const record = await Action_TB.findByPk(req.params.id, {
      include: [
        { model: trans_tb, as: 'transactions',
          include: [
            { model: AC_tb, as: 'account', attributes: ['ACID', 'ACNO'] },
            { model: mem_tb, as: 'member', attributes: ['gno', 'name'] },
          ]
        },
      ],
    });
    
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

// POST create new Action record (must include at least one trans_tb row)
const create = async (req, res, next) => {
  try {
    const { transactions, ...actionData } = req.body;

    // Validate: at least one transaction row must be provided
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one transaction (trans_tb) row must be provided when creating an Action record.',
      });
    }

    // Use a DB transaction so both inserts succeed or both roll back
    const { sequelize } = require('../models');
    const result = await sequelize.transaction(async (t) => {
      // 1. Create the Action_TB record
      const action = await Action_TB.create(actionData, { transaction: t });

      // 2. Insert each trans_tb row, stamping the new ActionID
      const transRows = transactions.map((row) => ({
        ...row,
        ActionID: action.ActionID,
      }));
      const createdTrans = await trans_tb.bulkCreate(transRows, {
        transaction: t,
        returning: true,
      });

      return { action, transactions: createdTrans };
    });

    res.status(201).json({
      success: true,
      message: 'Action record and transaction(s) created successfully',
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// PUT update Action record by ActionID (also replaces all its trans_tb rows)
const update = async (req, res, next) => {
  try {
    const { transactions, ...actionData } = req.body;
    const actionId = req.params.id;

    // Validate: at least one transaction row must be provided
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'At least one transaction (trans_tb) row must be provided when updating an Action record.',
      });
    }

    const { sequelize } = require('../models');
    const result = await sequelize.transaction(async (t) => {
      // 1. Update Action_TB
      const [rowsAffected] = await Action_TB.update(actionData, {
        where: { ActionID: actionId },
        transaction: t,
      });
      if (rowsAffected === 0) {
        const err = new Error(`Action record with ActionID=${actionId} not found or no changes made`);
        err.status = 404;
        throw err;
      }

      // 2. Delete existing trans_tb rows for this ActionID
      await trans_tb.destroy({ where: { ActionID: actionId }, transaction: t });

      // 3. Bulk-insert the new/updated transaction rows
      const transRows = transactions.map((row) => ({ ...row, ActionID: Number(actionId) }));
      const createdTrans = await trans_tb.bulkCreate(transRows, { transaction: t, returning: true });

      // 4. Re-fetch the updated Action record
      const action = await Action_TB.findByPk(actionId, { transaction: t });
      return { action, transactions: createdTrans };
    });

    res.json({
      success: true,
      message: 'Action record and transaction(s) updated successfully',
      data: result,
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

// DELETE Action record by ActionID (also deletes all its trans_tb rows)
const remove = async (req, res, next) => {
  try {
    const actionId = req.params.id;
    const { sequelize } = require('../models');

    await sequelize.transaction(async (t) => {
      // 1. Verify the Action record exists
      const action = await Action_TB.findByPk(actionId, { transaction: t });
      if (!action) {
        const err = new Error(`Action record with ActionID=${actionId} not found`);
        err.status = 404;
        throw err;
      }

      // 2. Delete associated trans_tb rows first (avoids FK constraint errors)
      await trans_tb.destroy({ where: { ActionID: actionId }, transaction: t });

      // 3. Delete the Action_TB record
      await action.destroy({ transaction: t });
    });

    res.json({
      success: true,
      message: `Action record with ActionID=${actionId} and its transactions deleted successfully`,
    });
  } catch (error) {
    if (error.status === 404) {
      return res.status(404).json({ success: false, message: error.message });
    }
    next(error);
  }
};

module.exports = { getAll, getById, create, update, remove };
