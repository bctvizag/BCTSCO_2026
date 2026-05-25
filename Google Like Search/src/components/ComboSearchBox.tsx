import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchItem {
  [key: string]: any;
}

interface ComboSearchBoxProps<T extends SearchItem> {
  items: T[];
  onSearch?: (query: string, results: T[]) => void;
  onSelect?: (item: T) => void;
  placeholder?: string;
  searchFields: string[];
  displayFields: string[];
  fieldLabels?: { [key: string]: string };
  valueField?: string;
  maxResults?: number;
  highlightField?: string;
  showResultsCount?: boolean;
  disabled?: boolean;
  className?: string;
}

function ComboSearchBox<T extends SearchItem>({
  items,
  onSearch,
  onSelect,
  placeholder = "Search...",
  searchFields,
  displayFields,
  fieldLabels = {},
  valueField,
  maxResults = 50,
  highlightField,
  showResultsCount = true,
  disabled = false,
  className = ""
}: ComboSearchBoxProps<T>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<T[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'below' | 'above'>('below');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  const prevQueryRef = useRef<string>(query);

  // Initialize or resize the rowRefs array when results change
  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, results.length);
  }, [results]);

  // Search logic
  useEffect(() => {
    if (prevQueryRef.current === query) {
      return;
    }
    
    prevQueryRef.current = query;

    if (query.trim() === '') {
      setResults([]);
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
    setSelectedIndex(-1);
    
    if (onSearch) {
      onSearch(query, filteredResults);
    }
  }, [query, items, searchFields, maxResults, onSearch]);

  // Position dropdown based on available space
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;
      const dropdownHeight = Math.min(400, results.length * 40 + 100); // Estimate dropdown height
      
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition('above');
      } else {
        setDropdownPosition('below');
      }
    }
  }, [isOpen, results.length]);

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && rowRefs.current[selectedIndex] && dropdownRef.current) {
      const selectedRow = rowRefs.current[selectedIndex];
      const container = dropdownRef.current.querySelector('.dropdown-scroll-container');
      
      if (selectedRow && container) {
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
    if (disabled) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (!isOpen) {
        setIsOpen(true);
      } else if (results.length > 0) {
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev));
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (isOpen && results.length > 0) {
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev));
      }
    } else if (e.key === 'Enter' && selectedIndex >= 0 && isOpen) {
      e.preventDefault();
      const selected = results[selectedIndex];
      if (selected) {
        handleItemSelect(selected);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setSelectedIndex(-1);
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    
    setQuery(e.target.value);
    if (!isOpen && e.target.value.trim()) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (disabled) return;
    
    if (query.trim() && results.length > 0) {
      setIsOpen(true);
    }
  };

  const handleItemSelect = (item: T) => {
    const selectedValue = valueField 
      ? String(item[valueField] || '') 
      : String(item[displayFields[0]] || '');
    
    setQuery(selectedValue);
    setIsOpen(false);
    setSelectedIndex(-1);
    
    if (onSelect) {
      onSelect(item);
    }
    
    if (onSearch) {
      onSearch(selectedValue, [item]);
    }
  };

  const toggleDropdown = () => {
    if (disabled) return;
    
    if (!isOpen && query.trim() && results.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(!isOpen);
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

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Container */}
      <div className="relative">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-4 py-3 pl-12 pr-10 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm transition-colors ${
              disabled ? 'bg-gray-100 cursor-not-allowed' : 'hover:border-gray-400'
            } ${isOpen ? 'ring-2 ring-blue-500 border-transparent' : ''}`}
          />
          
          {/* Search Icon */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className={`w-5 h-5 ${disabled ? 'text-gray-300' : 'text-gray-400'}`} />
          </div>
          
          {/* Clear Button */}
          {query && !disabled && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setIsOpen(false);
                setSelectedIndex(-1);
                inputRef.current?.focus();
              }}
              className="absolute inset-y-0 right-10 flex items-center pr-1 text-gray-400 hover:text-gray-600"
            >
              <span className="text-xl font-medium">×</span>
            </button>
          )}
          
          {/* Dropdown Toggle */}
          <button
            type="button"
            onClick={toggleDropdown}
            disabled={disabled}
            className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
              disabled ? 'text-gray-300 cursor-not-allowed' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Dropdown Overlay */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute left-0 right-0 z-50 bg-white border border-gray-300 rounded-lg shadow-lg ${
            dropdownPosition === 'above' ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
          style={{ minWidth: '100%' }}
        >
          {/* Results Count */}
          {showResultsCount && query && (
            <div className="px-4 py-2 text-sm text-gray-600 bg-gray-50 border-b border-gray-200">
              {results.length > 0 
                ? `${results.length} result${results.length === 1 ? '' : 's'} found`
                : 'No results found'
              }
            </div>
          )}

          {/* Results Table */}
          {results.length > 0 ? (
            <div className="dropdown-scroll-container overflow-auto max-h-80">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    {displayFields.map((field, index) => (
                      <th
                        key={`header-${field}-${index}`}
                        className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200"
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
                        onClick={() => handleItemSelect(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        {displayFields.map((field, fieldIndex) => {
                          const cellKey = `${itemKey}-field-${fieldIndex}`;
                          const cellValue = String(item[field] || '');
                          
                          return (
                            <td
                              key={cellKey}
                              className="px-4 py-2 text-sm text-gray-900 whitespace-nowrap"
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
          ) : query ? (
            <div className="px-4 py-6 text-sm text-gray-500 text-center">
              No results found matching "{query}"
            </div>
          ) : (
            <div className="px-4 py-6 text-sm text-gray-500 text-center">
              Start typing to search...
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ComboSearchBox;