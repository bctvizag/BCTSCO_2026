const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/ac.controller');

/**
 * @route   GET /api/ac
 * @desc    Get all AC records
 */
router.get('/', getAll);

/**
 * @route   GET /api/ac/:id
 * @desc    Get AC record by ACID
 */
router.get('/:id', getById);

/**
 * @route   POST /api/ac
 * @desc    Create a new AC record
 * @body    { MemID, AC_type, AC_Sub, ACNO, DOC, Amt, Period, CloseDT, prn, int, rate, Closed, Remarks, IntCalType }
 */
router.post('/', create);

/**
 * @route   PUT /api/ac/:id
 * @desc    Update AC record by ACID
 */
router.put('/:id', update);

/**
 * @route   DELETE /api/ac/:id
 * @desc    Delete AC record by ACID
 */
router.delete('/:id', remove);

module.exports = router;
