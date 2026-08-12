// Small helpers used by controllers to preserve the original API behavior
// while converting query-string values to Prisma-friendly types.

const INT_FIELDS = new Set([
  'ACID', 'MemID', 'MEMID', 'ActionID', 'Trans_des_ID', 'Trans_ID',
  'ChqID', 'Period', 'Days', 'T_Order'
]);

const BOOL_FIELDS = new Set(['Closed']);

const DECIMAL_FIELDS = new Set([
  'Amt', 'prn', 'int', 'rate',
  'Chqamt',
  'Cash_amt', 'Chq_amt', 'Adj_amt', 'Total_amt',
  'PRN', 'PRN_D', 'PRN_C', 'PRN_B',
  'INT', 'INT_D', 'INT_C', 'INT_B', 'INT_M'
]);

const DATE_FIELDS = new Set([
  'DOC', 'CloseDT', 'DOB', 'DOA', 'DOR', 'DOM',
  'ChqDt', 'VrDt', 'CrDt', 'Trans_dt', 'CB_dt',
  'ActionDT', 'CreatedOn', 'ModifiedOn'
]);

function convertValue(key, value) {
  if (value === null || value === undefined || value === '') return value;

  if (INT_FIELDS.has(key)) {
    const n = Number(value);
    if (!Number.isInteger(n)) throw new Error(`Invalid integer value for ${key}`);
    return n;
  }

  if (BOOL_FIELDS.has(key)) {
    if (value === true || value === 'true' || value === '1') return true;
    if (value === false || value === 'false' || value === '0') return false;
    throw new Error(`Invalid boolean value for ${key}`);
  }

  if (DECIMAL_FIELDS.has(key)) {
    const n = Number(value);
    if (!Number.isFinite(n)) throw new Error(`Invalid numeric value for ${key}`);
    return n;
  }

  if (DATE_FIELDS.has(key)) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) throw new Error(`Invalid date value for ${key}`);
    return date;
  }

  return value;
}

function buildWhere(query, allowedFields) {
  const where = {};

  for (const [key, rawValue] of Object.entries(query)) {
    if (rawValue === undefined || rawValue === '' || key === 'orderBy' || key === 'order') {
      continue;
    }

    if (!allowedFields.has(key)) {
      continue;
    }

    where[key] = convertValue(key, rawValue);
  }

  return where;
}

function pickBody(body, allowedFields) {
  const data = {};

  for (const [key, value] of Object.entries(body || {})) {
    if (allowedFields.has(key)) data[key] = convertValue(key, value);
  }

  return data;
}

module.exports = {
  INT_FIELDS,
  BOOL_FIELDS,
  DECIMAL_FIELDS,
  DATE_FIELDS,
  convertValue,
  buildWhere,
  pickBody,
};
