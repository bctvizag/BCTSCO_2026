const express = require('express');
const router = express.Router();

const acRoutes = require('./ac.routes');
const actionRoutes = require('./action.routes');
const chqdetailsRoutes = require('./chqdetails.routes');
const memRoutes = require('./mem.routes');
const transRoutes = require('./trans.routes');
const transDescRoutes = require('./trans_desc_tb.routes');


// Mount individual routers
router.use('/ac', acRoutes);
router.use('/actions', actionRoutes);
router.use('/chqdetails', chqdetailsRoutes);
router.use('/members', memRoutes);
router.use('/transactions', transRoutes);
router.use('/trans_desc_tb', transDescRoutes);

module.exports = router;
