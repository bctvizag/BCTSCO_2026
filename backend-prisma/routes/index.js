const express = require('express');
const router = express.Router();

router.use('/ac', require('./ac.routes'));
router.use('/actions', require('./action.routes'));
router.use('/chqdetails', require('./chqdetails.routes'));
router.use('/members', require('./mem.routes'));
router.use('/transactions', require('./trans.routes'));
router.use('/transDesc', require('./trans_desc_tb.routes'));

module.exports = router;
