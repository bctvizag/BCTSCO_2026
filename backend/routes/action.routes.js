const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/action.controller');

/**
 * @route   GET /api/actions
 * @desc    Get all Action records
 */
router.get('/', getAll);

/**
 * @route   GET /api/actions/:id
 * @desc    Get Action record by ActionID
 */
router.get('/:id', getById);

/**
 * @route   POST /api/actions
 * @desc    Create a new Action record
 * @body    { ActionDesc, MemID, ActionDT }
 */
router.post('/', create);

/**
 * @route   PUT /api/actions/:id
 * @desc    Update Action record by ActionID
 */
router.put('/:id', update);

/**
 * @route   DELETE /api/actions/:id
 * @desc    Delete Action record by ActionID
 */
router.delete('/:id', remove);

module.exports = router;
