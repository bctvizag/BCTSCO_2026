const sequelize = require('../config/database');
const AC_tb = require('./AC_tb');
const Action_TB = require('./Action_TB');
const Chqdetails = require('./Chqdetails');
const mem_tb = require('./mem_tb');
const trans_tb = require('./trans_tb');
const Trans_desc_tb = require('./trans_desc_tb');

// Define associations (optional - extend as needed)
// mem_tb -> AC_tb
mem_tb.hasMany(AC_tb, { foreignKey: 'MemID', as: 'accounts' });
AC_tb.belongsTo(mem_tb, { foreignKey: 'MemID', as: 'member' });

// mem_tb -> trans_tb
mem_tb.hasMany(trans_tb, { foreignKey: 'MemID', as: 'transactions' });
trans_tb.belongsTo(mem_tb, { foreignKey: 'MemID', as: 'member' });

// AC_tb -> Chqdetails
AC_tb.hasMany(Chqdetails, { foreignKey: 'ACID', as: 'cheques' });
Chqdetails.belongsTo(AC_tb, { foreignKey: 'ACID', as: 'account' });

// AC_tb -> trans_tb
AC_tb.hasMany(trans_tb, { foreignKey: 'ACID', as: 'transactions' });
trans_tb.belongsTo(AC_tb, { foreignKey: 'ACID', as: 'account' });

// trans_tb -> Chqdetails
trans_tb.hasMany(Chqdetails, { foreignKey: 'Trans_ID', as: 'cheques' });
Chqdetails.belongsTo(trans_tb, { foreignKey: 'Trans_ID', as: 'transaction' });

module.exports = {
  sequelize,
  AC_tb,
  Action_TB,
  Chqdetails,
  mem_tb,
  trans_tb,
  Trans_desc_tb,  
};
