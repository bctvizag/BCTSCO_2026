import * as XLSX from 'xlsx'

/**
 * Exports JSON data to a downloadable Excel (.xlsx) file.
 * @param {Array<Object>} data - Array of flat objects to export.
 * @param {string} filename - Output filename (defaults to 'export.xlsx').
 * @param {string} sheetName - Excel worksheet name (defaults to 'Sheet1').
 */
export function exportToExcel(data, filename = 'export.xlsx', sheetName = 'Sheet1') {
  if (!data || data.length === 0) {
    return
  }
  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
  XLSX.writeFile(workbook, filename)
}
