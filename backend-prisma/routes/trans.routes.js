const express = require('express');
const router = express.Router();
const { getAll, getById, getByAcid, create, update, remove, FilterByColumn } = require('../controllers/trans.controller');

router.get('/', getAll);
router.get('/Trans_ID/:id', getById);
router.get('/ACID/:acid', getByAcid);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.post('/filter', FilterByColumn);

module.exports = router;
