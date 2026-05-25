const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/chqdetails.controller');

/**
 * @route   GET /api/chqdetails
 * @desc    Get all Cheque detail records
 */
router.get('/', getAll);

/**
 * @route   GET /api/chqdetails/:id
 * @desc    Get Cheque detail record by ChqID
 */
router.get('/:id', getById);

/**
 * @route   POST /api/chqdetails
 * @desc    Create a new Cheque detail record
 * @body    { Pay_Mode, ChqNo, ChqDt, Chqamt, ChaBank, ChqName, ChqACNO, VrNo, VrDt, ACID, CrDt, Trans_ID }
 */
router.post('/', create);

/**
 * @route   PUT /api/chqdetails/:id
 * @desc    Update Cheque detail record by ChqID
 */
router.put('/:id', update);

/**
 * @route   DELETE /api/chqdetails/:id
 * @desc    Delete Cheque detail record by ChqID
 */
router.delete('/:id', remove);

module.exports = router;
