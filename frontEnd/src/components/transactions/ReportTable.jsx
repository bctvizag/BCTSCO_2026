import React, { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { ChevronDown, X, Search, Download } from "lucide-react";

/**
 * Column shape (documented for reference, no longer enforced by the type system):
 * {
 *   key: string,
 *   header: string,
 *   width?: number,
 *   format?: (value: any, row?: any) => ReactNode,
 *   hideColumn?: boolean,
 *   hideFilter?: boolean,
 *   isDate?: boolean,
 *   summary?: 'sum' | 'count' | 'avg',  // shown in the footer row (displayFooter must be true)
 * }
 */

function isNumericValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === "number") return Number.isFinite(value);
  const s = String(value).toString().trim().replace(/,/g, "");
  return s !== "" && !isNaN(Number(s));
}

function toNumber(value) {
  if (typeof value === "number") return value;
  const s = String(value).toString().trim().replace(/,/g, "");
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
}

// When customColumns is provided, it is the single source of truth for
// which columns render and in what order — we no longer merge in extra
// columns based on the data's own key order.

export const ReportTable = ({
  data,
  title,
  customColumns,
  enableFilters = true,
  initialFilters = {},
  defaultAlign = "left",
  displayFooter = true,
  initialRowCount = 100,
  incrementRowCount = 50,
  enableExport = true,
  exportFilename = "report.csv",
  // Array of { when: (row) => boolean, style?: object, className?: string }.
  // Rules are evaluated in order and the first matching rule wins.
  // Example:
  //   conditionalRowStyles={[
  //     { when: (row) => row.CB_side === 'P', style: { backgroundColor: 'lightgreen', color: 'red' } },
  //   ]}
  conditionalRowStyles = [],
}) => {
  const [sortCol, setSortCol] = useState(null);
  const [sortDir, setSortDir] = useState("asc");
  const [displayedRowCount, setDisplayedRowCount] = useState(initialRowCount);
  const [filters, setFilters] = useState(() => {
    const initial = {};
    Object.entries(initialFilters).forEach(([col, value]) => {
      initial[col] = { column: col, type: "text", value };
    });
    return initial;
  });
  const [openFilterColumn, setOpenFilterColumn] = useState(null);
  const [searchTexts, setSearchTexts] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [dateFilters, setDateFilters] = useState({});

  const tableContainerRef = useRef(null);
  const filterDropdownRefs = useRef({});

  const columnDefinitions = useMemo(() => {
    if (!data || data.length === 0) return [];
    if (customColumns && customColumns.length > 0) {
      // Use customColumns as-is: exact set, exact order.
      return customColumns;
    }
    const dataKeys = Object.keys(data[0]);
    return dataKeys.map((key) => ({ key, header: key }));
  }, [data, customColumns]);

  const columns = useMemo(() => columnDefinitions.map((col) => col.key), [columnDefinitions]);

  const numericColumns = useMemo(() => {
    const map = {};
    for (const col of columns) {
      const sample = data.slice(0, 50).map((row) => row[col]);
      const nonEmpty = sample.filter((v) => v !== null && v !== undefined && String(v).trim() !== "");
      const numericCount = nonEmpty.filter((v) => isNumericValue(v)).length;
      map[col] = nonEmpty.length > 0 && numericCount / nonEmpty.length >= 0.8;
    }
    return map;
  }, [columns, data]);

  const getColumnUniqueValues = useMemo(() => {
    const uniqueValues = {};
    columns.forEach((col) => {
      const values = Array.from(
        new Set(data.map((row) => String(row[col] ?? "")).filter((val) => val.trim() !== ""))
      ).sort();
      uniqueValues[col] = values;
    });
    return uniqueValues;
  }, [columns, data]);

  // Initialize selected values for all columns
  useEffect(() => {
    const initial = {};
    columns.forEach((col) => {
      const values = getColumnUniqueValues[col] || [];
      initial[col] = new Set(values);
    });
    setSelectedValues(initial);
  }, [columns, getColumnUniqueValues]);

  const filteredData = useMemo(() => {
    return data.filter((row) => {
      // Check checkbox filters
      const checkboxMatch = columns.every((col) => {
        const colDef = columnDefinitions.find((c) => c.key === col);
        if (colDef?.isDate) return true; // Skip date columns for checkbox filter

        const selected = selectedValues[col];
        const allValues = getColumnUniqueValues[col] || [];
        if (!selected || selected.size === 0 || selected.size === allValues.length) {
          return true;
        }
        const cellValue = String(row[col] ?? "");
        return selected.has(cellValue);
      });

      // Check date filters
      const dateMatch = columns.every((col) => {
        const colDef = columnDefinitions.find((c) => c.key === col);
        if (!colDef?.isDate) return true; // Skip non-date columns

        const dateFilter = dateFilters[col];
        if (!dateFilter || (!dateFilter.startDate && !dateFilter.endDate)) {
          return true;
        }

        const cellValue = row[col];
        if (!cellValue) return false;

        // Parse the date from the cell
        const cellDate = new Date(cellValue);
        if (isNaN(cellDate.getTime())) return false;

        // Check start date
        if (dateFilter.startDate) {
          const startDate = new Date(dateFilter.startDate);
          startDate.setHours(0, 0, 0, 0);
          cellDate.setHours(0, 0, 0, 0);
          if (cellDate < startDate) return false;
        }

        // Check end date
        if (dateFilter.endDate) {
          const endDate = new Date(dateFilter.endDate);
          endDate.setHours(23, 59, 59, 999);
          const checkDate = new Date(cellValue);
          checkDate.setHours(0, 0, 0, 0);
          if (checkDate > endDate) return false;
        }

        return true;
      });

      return checkboxMatch && dateMatch;
    });
  }, [data, selectedValues, dateFilters, columns, getColumnUniqueValues, columnDefinitions]);

  const sortedData = useMemo(() => {
    if (!sortCol) return filteredData;
    const copy = [...filteredData];
    const isNumeric = numericColumns[sortCol];
    copy.sort((a, b) => {
      const va = a[sortCol];
      const vb = b[sortCol];
      if (isNumeric) {
        const na = toNumber(va);
        const nb = toNumber(vb);
        return sortDir === "asc" ? na - nb : nb - na;
      }
      const sa = String(va ?? "").toLowerCase();
      const sb = String(vb ?? "").toLowerCase();
      if (sa < sb) return sortDir === "asc" ? -1 : 1;
      if (sa > sb) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return copy;
  }, [filteredData, sortCol, sortDir, numericColumns]);

  const displayedData = useMemo(() => {
    return sortedData.slice(0, displayedRowCount);
  }, [sortedData, displayedRowCount]);

  const totals = useMemo(() => {
    const t = {};
    for (const colDef of columnDefinitions) {
      const col = colDef.key;
      // Explicit summary wins; otherwise fall back to the old behavior
      // (auto-sum for columns that look numeric).
      const summaryType = colDef.summary || (numericColumns[col] ? "sum" : null);
      if (!summaryType) {
        t[col] = "";
        continue;
      }
      const rawValues = sortedData.map((row) => row[col]);
      if (summaryType === "count") {
        t[col] = rawValues.filter((v) => v !== null && v !== undefined && String(v).trim() !== "").length;
      } else {
        const sum = rawValues.reduce((acc, v) => acc + toNumber(v), 0);
        t[col] = summaryType === "avg" ? (rawValues.length > 0 ? sum / rawValues.length : 0) : sum;
      }
    }
    return t;
  }, [columnDefinitions, sortedData, numericColumns]);

  const handleScroll = useCallback(() => {
    if (!tableContainerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
    const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100;
    if (isNearBottom && displayedRowCount < sortedData.length) {
      setDisplayedRowCount((prev) => Math.min(prev + incrementRowCount, sortedData.length));
    }
  }, [displayedRowCount, sortedData.length, incrementRowCount]);

  useEffect(() => {
    setDisplayedRowCount(Math.min(initialRowCount, sortedData.length));
  }, [sortedData.length, initialRowCount, selectedValues, sortCol, sortDir]);

  useEffect(() => {
    const container = tableContainerRef.current;
    if (!container) return;
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openFilterColumn && filterDropdownRefs.current[openFilterColumn]) {
        const dropdown = filterDropdownRefs.current[openFilterColumn];
        if (!dropdown.contains(event.target)) {
          setOpenFilterColumn(null);
        }
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [openFilterColumn]);

  const toggleSort = (col) => {
    if (sortCol !== col) {
      setSortCol(col);
      setSortDir("asc");
    } else {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    }
  };

  const toggleFilterDropdown = (col) => {
    setOpenFilterColumn(openFilterColumn === col ? null : col);
  };

  const handleSelectAll = (col) => {
    const values = getColumnUniqueValues[col] || [];
    setSelectedValues((prev) => ({
      ...prev,
      [col]: new Set(values),
    }));
  };

  const handleClearAll = (col) => {
    setSelectedValues((prev) => ({
      ...prev,
      [col]: new Set(),
    }));
  };

  const handleUpdateDateFilter = (col, startDate, endDate) => {
    setDateFilters((prev) => {
      if (!startDate && !endDate) {
        const newFilters = { ...prev };
        delete newFilters[col];
        return newFilters;
      }
      return {
        ...prev,
        [col]: { startDate, endDate },
      };
    });
  };

  const handleClearDateFilter = (col) => {
    setDateFilters((prev) => {
      const newFilters = { ...prev };
      delete newFilters[col];
      return newFilters;
    });
  };

  const clearAllFilters = () => {
    const initial = {};
    columns.forEach((col) => {
      const values = getColumnUniqueValues[col] || [];
      initial[col] = new Set(values);
    });
    setSelectedValues(initial);
    setDateFilters({});
  };

  const getFilteredUniqueValues = (col) => {
    const searchText = searchTexts[col] || "";
    const values = getColumnUniqueValues[col] || [];
    if (!searchText) return values;
    return values.filter((val) => val.toLowerCase().includes(searchText.toLowerCase()));
  };

  const handleToggleValue = (col, value) => {
    setSelectedValues((prev) => {
      const newSet = new Set(prev[col] || []);
      if (newSet.has(value)) {
        newSet.delete(value);
      } else {
        newSet.add(value);
      }
      return { ...prev, [col]: newSet };
    });
  };

  const renderExcelFilter = (colDef) => {
    if (colDef.hideFilter) return null;

    const isOpen = openFilterColumn === colDef.key;
    const isDateColumn = colDef.isDate;
    const uniqueValues = getFilteredUniqueValues(colDef.key);
    const selected = selectedValues[colDef.key] || new Set();
    const allValues = getColumnUniqueValues[colDef.key] || [];
    const dateFilter = dateFilters[colDef.key];
    const hasFilter = isDateColumn
      ? dateFilter && (dateFilter.startDate || dateFilter.endDate)
      : selected.size < allValues.length;

    return (
      <div
        className="relative inline-block"
        ref={(el) => {
          if (el) filterDropdownRefs.current[colDef.key] = el;
        }}
      >
        <button
          onClick={() => toggleFilterDropdown(colDef.key)}
          className={`p-1 hover:bg-gray-200 rounded ${hasFilter ? "text-blue-600" : "text-gray-500"}`}
          title="Filter"
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        {isOpen && (
          <div
            className="absolute top-full left-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50"
            style={{ minWidth: "220px", maxWidth: "300px" }}
          >
            {isDateColumn ? (
              // Date Filter UI
              <>
                <div className="p-3 border-b border-gray-200">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Date Range Filter</div>
                  <div className="space-y-2">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">From Date:</label>
                      <input
                        type="date"
                        value={dateFilter?.startDate || ""}
                        onChange={(e) =>
                          handleUpdateDateFilter(colDef.key, e.target.value, dateFilter?.endDate || "")
                        }
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">To Date:</label>
                      <input
                        type="date"
                        value={dateFilter?.endDate || ""}
                        onChange={(e) =>
                          handleUpdateDateFilter(colDef.key, dateFilter?.startDate || "", e.target.value)
                        }
                        className="w-full px-2 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-2 border-t border-gray-200 flex justify-between gap-2">
                  <button
                    onClick={() => handleClearDateFilter(colDef.key)}
                    className="px-3 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Clear
                  </button>
                  <button
                    onClick={() => setOpenFilterColumn(null)}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    OK
                  </button>
                </div>
              </>
            ) : (
              // Regular Checkbox Filter UI
              <>
                <div className="p-2 border-b border-gray-200">
                  <div className="relative">
                    <Search className="absolute left-2 top-2 h-3.5 w-3.5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchTexts[colDef.key] || ""}
                      onChange={(e) => setSearchTexts((prev) => ({ ...prev, [colDef.key]: e.target.value }))}
                      className="w-full pl-8 pr-2 py-1.5 text-xs border border-gray-300 rounded focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="p-2 border-b border-gray-200 flex gap-2">
                  <button
                    onClick={() => handleSelectAll(colDef.key)}
                    className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Select All
                  </button>
                  <button
                    onClick={() => handleClearAll(colDef.key)}
                    className="flex-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 rounded"
                  >
                    Clear All
                  </button>
                </div>

                <div className="max-h-64 overflow-y-auto p-1">
                  {uniqueValues.length === 0 ? (
                    <div className="p-2 text-xs text-gray-500 text-center">No items found</div>
                  ) : (
                    uniqueValues.map((value) => (
                      <label key={value} className="flex items-center px-2 py-1.5 hover:bg-gray-50 cursor-pointer text-xs">
                        <input
                          type="checkbox"
                          checked={selected.has(value)}
                          onChange={() => handleToggleValue(colDef.key, value)}
                          className="mr-2 h-3.5 w-3.5"
                        />
                        <span className="truncate" title={value}>
                          {value || "(Blank)"}
                        </span>
                      </label>
                    ))
                  )}
                </div>

                <div className="p-2 border-t border-gray-200 flex justify-end">
                  <button
                    onClick={() => setOpenFilterColumn(null)}
                    className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    OK
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    );
  };

  const getMatchedRowRule = (row) => {
    if (!conditionalRowStyles || conditionalRowStyles.length === 0) return null;
    return (
      conditionalRowStyles.find((rule) => {
        try {
          return rule.when(row);
        } catch {
          return false;
        }
      }) || null
    );
  };

  const renderCellContent = (row, colDef) => {
    const value = row[colDef.key];
    if (colDef.format) {
      return colDef.format(value, row);
    }
    if (numericColumns[colDef.key]) {
      return new Intl.NumberFormat().format(toNumber(value));
    }
    return String(value ?? "");
  };

  const renderFooterContent = (colDef, idx) => {
    if (idx === 0) return "Totals";
    const summaryType = colDef.summary || (numericColumns[colDef.key] ? "sum" : null);
    if (!summaryType) return "";
    const totalValue = totals[colDef.key];
    if (summaryType === "count") {
      return new Intl.NumberFormat().format(totalValue);
    }
    if (summaryType === "avg") {
      return new Intl.NumberFormat(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(totalValue);
    }
    return new Intl.NumberFormat().format(toNumber(totalValue));
  };

  function toCsvValue(value) {
    if (value === null || value === undefined) return "";
    const str = String(value);
    if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  }

  function convertToCSV(data, columnDefinitions) {
    if (data.length === 0) return "";
    const visibleColumns = columnDefinitions.filter((col) => !col.hideColumn);
    const headers = visibleColumns.map((col) => toCsvValue(col.header));
    const csvContent = [headers.join(",")];
    data.forEach((row) => {
      const rowData = visibleColumns.map((col) => toCsvValue(row[col.key]));
      csvContent.push(rowData.join(","));
    });
    return csvContent.join("\n");
  }

  function downloadCSV(csvContent, filename) {
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", filename);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }

  const handleExportCSV = () => {
    try {
      const csvContent = convertToCSV(sortedData, columnDefinitions);
      const timestamp = new Date().toISOString().split("T")[0];
      const baseFilename = exportFilename || (title ? title.replace(/[^a-z0-9]/gi, "_").toLowerCase() : "report");
      const filename = exportFilename || `${baseFilename}_${timestamp}.csv`;
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      alert("Error exporting CSV. Please try again.");
    }
  };

  if (!data || data.length === 0) {
    return <div className="text-sm text-gray-600 p-4">No data available</div>;
  }

  const hasMoreRows = displayedRowCount < sortedData.length;
  const visibleColumns = columnDefinitions.filter((col) => !col.hideColumn);
  const activeFilterCount = columns.filter((col) => {
    const colDef = columnDefinitions.find((c) => c.key === col);
    if (colDef?.isDate) {
      const dateFilter = dateFilters[col];
      return dateFilter && (dateFilter.startDate || dateFilter.endDate);
    }
    const selected = selectedValues[col];
    const all = getColumnUniqueValues[col];
    return selected && selected.size < all.length;
  }).length;

  return (
    <div className="w-full bg-white">
      <div className="flex items-center justify-between p-3 border-b border-gray-300">
        <div>
          {title && <div className="text-base font-semibold text-gray-800">{title}</div>}
          <div className="text-xs text-gray-600 mt-0.5">
            {displayedData.length} of {sortedData.length} rows
            {sortedData.length !== data.length && ` (${data.length} total)`}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {enableExport && sortedData.length > 0 && (
            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-green-600 hover:bg-green-700 text-white rounded"
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          )}

          {enableFilters && activeFilterCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded"
            >
              Clear Filters ({activeFilterCount})
            </button>
          )}
        </div>
      </div>

      <div ref={tableContainerRef} className="overflow-auto" style={{ maxHeight: "600px" }}>
        <table className="w-full border-collapse text-xs">
          <thead className="bg-gray-50 sticky top-0 z-10">
            <tr>
              {visibleColumns.map((colDef) => (
                <th
                  key={colDef.key}
                  className="border border-gray-300 bg-gray-50 font-semibold text-gray-700"
                  style={{ width: colDef.width ? `${colDef.width}px` : undefined }}
                >
                  <div className="flex items-center justify-between px-2 py-1.5">
                    <button
                      onClick={() => toggleSort(colDef.key)}
                      className="flex-1 flex items-center gap-1 hover:text-blue-600 text-left"
                    >
                      <span>{colDef.header}</span>
                      {sortCol === colDef.key && (
                        <span className="text-blue-600 font-bold">{sortDir === "asc" ? "↑" : "↓"}</span>
                      )}
                    </button>
                    {enableFilters && renderExcelFilter(colDef)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayedData.map((row, i) => {
              const matchedRule = getMatchedRowRule(row);
              return (
              <tr
                key={i}
                className={`hover:bg-blue-50 ${matchedRule?.className || ""}`}
                style={matchedRule?.style}
              >
                {visibleColumns.map((colDef) => (
                  <td key={colDef.key} className={`border border-gray-300 px-2 py-1 text-${defaultAlign}`}>
                    {renderCellContent(row, colDef)}
                  </td>
                ))}
              </tr>
              );
            })}
            {hasMoreRows && (
              <tr>
                <td
                  colSpan={visibleColumns.length}
                  className="text-center text-gray-400 py-2 border border-gray-300"
                >
                  Loading more rows…
                </td>
              </tr>
            )}
          </tbody>
          {displayFooter && (
            <tfoot className="bg-gray-50 sticky bottom-0 font-semibold">
              <tr>
                {visibleColumns.map((colDef, idx) => (
                  <td key={colDef.key} className={`border border-gray-300 px-2 py-1.5 text-${defaultAlign}`}>
                    {renderFooterContent(colDef, idx)}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};

export default ReportTable;