const express = require('express');
const router = express.Router();
const { getAll, getById, getByAcid, create, update, remove, FilterByColumn } = require('../controllers/trans.controller');

/**
 * @route   GET /api/transactions
 * @desc    Get all Transaction records
 */
router.get('/', getAll);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get Transaction record by Trans_ID
 */
router.get('/Trans_ID/:id', getById);

/**
 * @route   GET /api/transactions/ACID/:acid
 * @desc    Get Transaction records by ACID
 */
router.get('/ACID/:acid', getByAcid);

/**
 * @route   POST /api/transactions
 * @desc    Create a new Transaction record
 * @body    { ActionID, Trans_des_ID, Trans_dt, CB_dt, ACID, I_NO, Cash_amt, Chq_amt, Adj_amt,
 *            Total_amt, PRN, PRN_D, PRN_C, PRN_B, INT, INT_D, INT_C, INT_B, rate, Days,
 *            Status, T_Order, CreatedBy, Remarks, CB_side, MEMID, Trans_desc, IntCalType, AC_Sub }
 */



router.post('/', create);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update Transaction record by Trans_ID
 */
router.put('/:id', update);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete Transaction record by Trans_ID
 */
router.delete('/:id', remove);

router.post('/filter', FilterByColumn);

module.exports = router;
