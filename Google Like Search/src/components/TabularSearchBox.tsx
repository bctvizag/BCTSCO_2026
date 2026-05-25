import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchItem {
  [key: string]: any;
}

interface TabularSearchBoxProps<T extends SearchItem> {
  items: T[];
  onSearch?: (query: string, results: T[]) => void;
  placeholder?: string;
  searchFields: string[];
  displayFields: string[];
  fieldLabels?: { [key: string]: string };
  valueField?: string;
  maxResults?: number;
  highlightField?: string;
  resizable?: boolean;
  minHeight?: number;
  maxHeight?: number;
  showResultsCount?: boolean;
}

function TabularSearchBox<T extends SearchItem>({
  items,
  onSearch,
  placeholder = "Search...",
  searchFields,
  displayFields,
  fieldLabels = {},
  valueField,
  maxResults = 50,
  highlightField,
  resizable = true,
  minHeight = 200,
  maxHeight = 600,
  showResultsCount = true
}: TabularSearchBoxProps<T>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tableHeight, setTableHeight] = useState(minHeight);
  const inputRef = useRef<HTMLInputElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const prevQueryRef = useRef<string>(query);

  // Initialize or resize the rowRefs array when results change
  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, results.length);
  }, [results]);

  useEffect(() => {
    // Skip if the query hasn't changed to prevent infinite loops
    if (prevQueryRef.current === query) {
      return;
    }
    
    prevQueryRef.current = query;

    if (query.trim() === '') {
      setResults([]);
      setIsExpanded(false);
      return;
    }

    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const filteredResults = items.filter(item => {
      return searchTerms.every(term => 
        searchFields.some(field => {
          const value = String(item[field] || '').toLowerCase();
          return value.includes(term);
        })
      );
    }).slice(0, maxResults);
    
    setResults(filteredResults);
    setIsExpanded(filteredResults.length > 0);
    setSelectedIndex(-1);
    
    if (onSearch) {
      onSearch(query, filteredResults);
    }
  }, [query, items, searchFields, maxResults, onSearch]);

  // Scroll the selected row into view when selectedIndex changes
  useEffect(() => {
    if (selectedIndex >= 0 && rowRefs.current[selectedIndex] && tableRef.current) {
      const selectedRow = rowRefs.current[selectedIndex];
      const container = tableRef.current;
      
      if (selectedRow) {
        const containerTop = container.scrollTop;
        const containerBottom = containerTop + container.clientHeight;
        
        const rowTop = selectedRow.offsetTop;
        const rowBottom = rowTop + selectedRow.clientHeight;
        
        if (rowTop < containerTop) {
          container.scrollTop = rowTop;
        } else if (rowBottom > containerBottom) {
          container.scrollTop = rowBottom - container.clientHeight;
        }
      }
    }
  }, [selectedIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isExpanded || results.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter' && selectedIndex >= 0) {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        setQuery(valueField ? String(selected[valueField] || '') : String(selected[displayFields[0]] || ''));
        setIsExpanded(false);
        if (onSearch) {
          onSearch(valueField ? String(selected[valueField] || '') : String(selected[displayFields[0]] || ''), [selected]);
        }
      }
    } else if (e.key === 'Escape') {
      setIsExpanded(false);
      setSelectedIndex(-1);
    }
  };

  const handleRowClick = (item: T, index: number) => {
    const selectedValue = valueField 
      ? String(item[valueField] || '') 
      : String(item[displayFields[0]] || '');
    setQuery(selectedValue);
    setIsExpanded(false);
    setSelectedIndex(-1);
    if (onSearch) {
      onSearch(selectedValue, [item]);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.split(' ').filter(term => term.length > 0).join('|')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? <span key={`highlight-${index}`} className="bg-yellow-200 font-medium">{part}</span> : part
    );
  };

  const getFieldLabel = (field: string) => {
    return fieldLabels[field] || field.replace(/([A-Z])/g, ' $1').trim();
  };

  const handleResize = (e: React.MouseEvent) => {
    if (!resizable) return;
    
    const startY = e.clientY;
    const startHeight = tableHeight;

    const handleMouseMove = (e: MouseEvent) => {
      const newHeight = Math.min(Math.max(startHeight + (e.clientY - startY), minHeight), maxHeight);
      setTableHeight(newHeight);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="w-full">
      {/* Input Box */}
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full px-4 py-3 pl-12 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsExpanded(false);
                setSelectedIndex(-1);
              }}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
            >
              <span className="text-xl font-medium">×</span>
            </button>
          )}
        </div>

        {/* Toggle Button */}
        {results.length > 0 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600"
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        )}
      </div>

      {/* Results Count */}
      {showResultsCount && query && (
        <div className="mt-2 text-sm text-gray-600">
          {results.length > 0 
            ? `${results.length} result${results.length === 1 ? '' : 's'} found`
            : 'No results found'
          }
        </div>
      )}

      {/* Tabular Results */}
      {isExpanded && results.length > 0 && (
        <div className="mt-3 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <div 
            ref={tableRef}
            className="overflow-auto"
            style={{ height: `${tableHeight}px` }}
          >
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  {displayFields.map((field, index) => (
                    <th
                      key={`header-${field}-${index}`}
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
                    >
                      {getFieldLabel(field)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.map((item, index) => {
                  const itemKey = `result-${index}-${item[displayFields[0]] || index}`;
                  
                  return (
                    <tr
                      ref={el => rowRefs.current[index] = el}
                      key={itemKey}
                      className={`cursor-pointer hover:bg-blue-50 transition-colors ${
                        index === selectedIndex ? 'bg-blue-100' : ''
                      }`}
                      onClick={() => handleRowClick(item, index)}
                    >
                      {displayFields.map((field, fieldIndex) => {
                        const cellKey = `${itemKey}-field-${fieldIndex}`;
                        const cellValue = String(item[field] || '');
                        
                        return (
                          <td
                            key={cellKey}
                            className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap"
                          >
                            {fieldIndex === 0 && highlightField 
                              ? highlightMatch(String(item[highlightField] || ''), query)
                              : fieldIndex === 0
                                ? highlightMatch(cellValue, query)
                                : cellValue
                            }
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Resize Handle */}
          {resizable && (
            <div
              className="h-2 bg-gray-100 cursor-ns-resize hover:bg-gray-200 transition-colors flex items-center justify-center"
              onMouseDown={handleResize}
            >
              <div className="w-8 h-1 bg-gray-400 rounded"></div>
            </div>
          )}
        </div>
      )}

      {/* No Results Message */}
      {isExpanded && query && results.length === 0 && (
        <div className="mt-3 p-4 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="text-sm text-gray-700 text-center">
            No results found matching "{query}"
          </div>
        </div>
      )}
    </div>
  );
}

export default TabularSearchBox;