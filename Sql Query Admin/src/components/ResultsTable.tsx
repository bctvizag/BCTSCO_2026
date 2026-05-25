import { useMemo, useState } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { FileSpreadsheet, FileText } from 'lucide-react';

interface ResultsTableProps {
  columns: string[];
  rows: Record<string, unknown>[];
}

export function ResultsTable({ columns, rows }: ResultsTableProps) {
  const [filters, setFilters] = useState<Record<string, string>>({});

  const filteredRows = useMemo(() => {
    return rows.filter((row) => {
      return columns.every((column) => {
        const filterValue = filters[column]?.trim().toLowerCase();
        if (!filterValue) return true;
        const cellValue = String(row[column] ?? '').toLowerCase();
        return cellValue.includes(filterValue);
      });
    });
  }, [rows, filters, columns]);

  const exportToCSV = () => {
    if (filteredRows.length === 0) return;
    const csv = [
      columns.join(','),
      ...filteredRows.map((row) =>
        columns.map((col) => {
          const val = row[col];
          if (val === null || val === undefined) return '';
          const str = String(val);
          if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            return `"${str.replace(/"/g, '""')}"`;
          }
          return str;
        }).join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `query_results_${Date.now()}.csv`);
  };

  const exportToExcel = () => {
    if (filteredRows.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(filteredRows, { header: columns });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Results');
    XLSX.writeFile(wb, `query_results_${Date.now()}.xlsx`);
  };

  if (columns.length === 0) {
    return (
      <div className="bg-white border border-gray-300 rounded-sm p-8 text-center text-gray-500 text-sm">
        No results to display. Run a query to see results.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-300 rounded-sm overflow-hidden">
      <div className="bg-gray-100 border-b border-gray-300 px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            Results ({filteredRows.length} of {rows.length} rows)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={exportToCSV}
            disabled={filteredRows.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            Export CSV
          </button>
          <button
            onClick={exportToExcel}
            disabled={filteredRows.length === 0}
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-green-700 hover:bg-green-800 rounded-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export Excel
          </button>
        </div>
      </div>

      <div className="overflow-auto max-h-[500px]" style={{ fontSize: '8pt' }}>
        <table className="w-full border-collapse">
          <thead className="sticky top-0 z-10">
            <tr className="bg-gray-200">
              {columns.map((column) => {
                return (
                  <th
                    key={column}
                    className="border border-gray-300 px-2 py-1 text-left font-semibold text-gray-800 whitespace-nowrap bg-gray-200 relative"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="truncate">{column}</span>
                    </div>
                  </th>
                );
              })}
            </tr>
            <tr className="bg-slate-100">
              {columns.map((column) => (
                <th
                  key={`${column}-filter`}
                  className="border border-gray-200 px-1 py-0.5 text-left bg-slate-100"
                >
                  <input
                    type="text"
                    value={filters[column] ?? ''}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        [column]: e.target.value,
                      }))
                    }
                    placeholder={`Filter ${column}`}
                    className="w-full px-1 py-0.5 text-[10px] border border-gray-200 rounded outline-none focus:border-blue-500 bg-white"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredRows.map((row, index) => (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="border border-gray-300 px-2 py-0.5 text-gray-800 whitespace-nowrap max-w-[300px] truncate"
                  >
                    {row[column] === null ? (
                      <span className="text-gray-400 italic">NULL</span>
                    ) : (
                      String(row[column] ?? '')
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {filteredRows.length === 0 && rows.length > 0 && (
          <div className="p-4 text-center text-gray-500 text-xs">
            No matching records found
          </div>
        )}
      </div>
    </div>
  );
}
