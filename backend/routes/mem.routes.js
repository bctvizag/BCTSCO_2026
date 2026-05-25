const express = require('express');
const router = express.Router();
const { getAll, getById, create, update, remove } = require('../controllers/mem.controller');

/**
 * @route   GET /api/members
 * @desc    Get all Member records
 */
router.get('/', getAll);

/**
 * @route   GET /api/members/:id
 * @desc    Get Member record by MemID
 */
router.get('/:id', getById);

/**
 * @route   POST /api/members
 * @desc    Create a new Member record
 * @body    { Memtype, empno, gno, hrno, name, desgn, sex, DOB, DOA, DOR, DOM, DIV, subdiv, Status, Phone1 }
 */
router.post('/', create);

/**
 * @route   PUT /api/members/:id
 * @desc    Update Member record by MemID
 */
router.put('/:id', update);

/**
 * @route   DELETE /api/members/:id
 * @desc    Delete Member record by MemID
 */
router.delete('/:id', remove);

module.exports = router;
