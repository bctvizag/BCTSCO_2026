const express = require('express');
const router = express.Router();
const { getAll, getById, getAC_Sub } = require('../controllers/trans_desc_tb.controller');

router.get('/', getAll);
router.get('/ac-sub', getAC_Sub);
router.get('/:id', getById);

module.exports = router;
