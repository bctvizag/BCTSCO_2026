import { useState, useEffect, useLayoutEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

export default function ComboSearchBox({
  items,
  value,
  onSearch,
  onSelect,
  placeholder = 'Search...',
  searchFields,
  displayFields,
  fieldLabels = {},
  valueField,
  maxResults = 50,
  highlightField,
  showResultsCount = true,
  disabled = false,
  className = '',
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [isOpen, setIsOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0, isReady: false })

  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)
  const rowRefs = useRef([])
  const prevQueryRef = useRef(query)

  // Sync external value to local state query
  useEffect(() => {
    const stringVal = value !== null && value !== undefined ? String(value) : ''
    if (stringVal !== query) {
      setQuery(stringVal)
      // Update results if value changes externally
      if (stringVal === '') {
        setResults([])
      }
    }
  }, [value])

  // Initialize or resize the rowRefs array when results change
  useEffect(() => {
    rowRefs.current = rowRefs.current.slice(0, results.length)
  }, [results])

  // Search logic
  useEffect(() => {
    if (prevQueryRef.current === query) {
      return
    }

    prevQueryRef.current = query

    if (query.trim() === '') {
      setResults([])
      return
    }

       
    const searchTerms = query
      .toLowerCase()
      .split(' ')
      .filter((term) => term.length > 0)

    const filteredResults = items
      .filter((item) => {
        return searchTerms.every((term) =>
          searchFields.some((field) => {
            const val = String(item[field] || '').toLowerCase()
            return val.includes(term)
          })
        )
      })
      .slice(0, maxResults)
      
    setResults(filteredResults)
    setSelectedIndex(-1)

    if (onSearch) {
      onSearch(query, filteredResults)
    }
  }, [query, items, searchFields, maxResults, onSearch])

  // Position dropdown based on available space and viewport bounds
  useLayoutEffect(() => {
    if (!isOpen || !containerRef.current) {
      if (coords.isReady) {
        setCoords((prev) => ({ ...prev, isReady: false }))
      }
      return
    }

    const updatePosition = () => {
      if (!containerRef.current) return
      const rect = containerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const spaceBelow = viewportHeight - rect.bottom
      const spaceAbove = rect.top
      
      const dropdownHeight = dropdownRef.current ? dropdownRef.current.offsetHeight : 200

      let top
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        top = rect.top - dropdownHeight - 4
      } else {
        top = rect.bottom + 4
      }

      setCoords({
        top: top,
        left: rect.left,
        width: rect.width,
        isReady: true,
      })
    }

    updatePosition()

    let resizeObserver
    if (dropdownRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updatePosition()
      })
      resizeObserver.observe(dropdownRef.current)
    }

    // Use capture phase to catch scroll events from parent elements
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)

    return () => {
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
    }
  }, [isOpen, results.length])

  // Handle clicks outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        (!dropdownRef.current || !dropdownRef.current.contains(event.target))
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Scroll selected item into view
  useEffect(() => {
    if (selectedIndex >= 0 && rowRefs.current[selectedIndex] && dropdownRef.current) {
      const selectedRow = rowRefs.current[selectedIndex]
      const container = dropdownRef.current.querySelector('.dropdown-scroll-container')

      if (selectedRow && container) {
        const containerTop = container.scrollTop
        const containerBottom = containerTop + container.clientHeight

        const rowTop = selectedRow.offsetTop
        const rowBottom = rowTop + selectedRow.clientHeight

        if (rowTop < containerTop) {
          container.scrollTop = rowTop
        } else if (rowBottom > containerBottom) {
          container.scrollTop = rowBottom - container.clientHeight
        }
      }
    }
  }, [selectedIndex])

  const handleKeyDown = (e) => {
    if (disabled) return  
    

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!isOpen) {
        setIsOpen(true)
      } else if (results.length > 0) {
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev))
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (isOpen && results.length > 0) {
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : prev))
      }
    } else if (e.key === 'Enter' && selectedIndex >= 0 && isOpen) {
      e.preventDefault()
      const selected = results[selectedIndex]
      if (selected) {
        handleItemSelect(selected)
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setSelectedIndex(-1)
    } else if (e.key === 'Tab') {
      setIsOpen(false)
    }
  }

  const handleInputChange = (e) => {
    if (disabled) return

    const val = e.target.value
    setQuery(val)
    if (onSearch) {
      onSearch(val, [])
    }
    if (!isOpen && val.trim()) {
      setIsOpen(true)
    }
  }

  const handleInputFocus = () => {
    if (disabled) return

    if (query.trim() && results.length > 0) {
      setIsOpen(true)
    }
  }

  const handleItemSelect = (item) => {
    const selectedValue = valueField
      ? String(item[valueField] || '')
      : String(item[displayFields[0]] || '')

    setQuery(selectedValue)
    setIsOpen(false)
    setSelectedIndex(-1)

    if (onSelect) {
      onSelect(item)
    }

    if (onSearch) {
      onSearch(selectedValue, [item])
    }
  }

  const toggleDropdown = () => {
    if (disabled) return

    if (!isOpen && query.trim() && results.length > 0) {
      setIsOpen(true)
    } else {
      setIsOpen(!isOpen)
    }
  }

  const highlightMatch = (text, queryText) => {
    if (!queryText.trim()) return text

    const terms = queryText
      .split(' ')
      .filter((term) => term.length > 0)
      .map((term) => term.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')) // escape regex chars

    if (terms.length === 0) return text

    const regex = new RegExp(`(${terms.join('|')})`, 'gi')
    const parts = text.split(regex)

    return parts.map((part, index) =>
      regex.test(part) ? (
        <span key={`highlight-${index}`} className="bg-amber-200 font-semibold text-slate-900 rounded-[2px] px-[2px]">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  const getFieldLabel = (field) => {
    return fieldLabels[field] || field.replace(/([A-Z])/g, ' $1').trim()
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Input Container */}
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
          className={`input pl-7 pr-12 text-xs select-none ${
            disabled ? 'bg-slate-100 cursor-not-allowed text-slate-400' : ''
          } ${isOpen ? 'ring-2 ring-primary-400 border-transparent' : ''}`}
        />

        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
          <Search
            size={11}
            className={disabled ? 'text-slate-300' : 'text-slate-400'}
          />
        </div>

        {/* Clear Button */}
        {query && !disabled && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              if (onSearch) onSearch('', [])
              setIsOpen(false)
              setSelectedIndex(-1)
              inputRef.current?.focus()
            }}
            className="absolute inset-y-0 right-7 flex items-center px-1 text-slate-400 hover:text-slate-600"
          >
            <span className="text-sm font-semibold">×</span>
          </button>
        )}

        {/* Dropdown Toggle */}
        <button
          type="button"
          onClick={toggleDropdown}
          disabled={disabled}
          className={`absolute inset-y-0 right-0 flex items-center px-2.5 ${
            disabled
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-slate-400 hover:text-slate-600'
          }`}
        >
          {isOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
        </button>
      </div>

      {/* Dropdown Overlay */}
      {isOpen && createPortal(
        <div
          ref={dropdownRef}
          className="fixed z-[9999] bg-white border border-slate-200 rounded-md shadow-lg overflow-hidden transition-opacity duration-75"
          style={{
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            width: `${coords.width}px`,
            opacity: coords.isReady ? 1 : 0,
            pointerEvents: coords.isReady ? 'auto' : 'none',
          }}
        >
          {/* Results Count */}
          {showResultsCount && query.trim() && (
            <div className="px-2.5 py-1 text-3xs font-semibold text-slate-400 bg-slate-50 border-b border-slate-100 tracking-wider uppercase">
              {results.length > 0
                ? `${results.length} result${results.length === 1 ? '' : 's'} found`
                : 'No results found'}
            </div>
          )}

          {/* Results Table */}
          {results.length > 0 ? (
            <div className="dropdown-scroll-container overflow-y-auto max-h-48 scrollbar-thin">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-100 sticky top-0 z-10">
                  <tr>
                    {displayFields.map((field, index) => (
                      <th
                        key={`header-${field}-${index}`}
                        className="px-2 py-1.5 text-3xs font-bold text-slate-500 uppercase tracking-wide"
                      >
                        {getFieldLabel(field)}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map((item, index) => {
                    const rowKey = `row-${index}-${item[valueField] || index}`
                    return (
                      <tr
                        ref={(el) => (rowRefs.current[index] = el)}
                        key={rowKey}
                        className={`cursor-pointer transition-colors duration-75 text-3xs ${
                          index === selectedIndex
                            ? 'bg-primary-50 text-primary-900'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                        onClick={() => handleItemSelect(item)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        {displayFields.map((field, fieldIndex) => {
                          const cellValue = String(item[field] || '')
                          const isHighlighted =
                            highlightField === field || !highlightField

                          return (
                            <td key={`cell-${rowKey}-${fieldIndex}`} className="px-2 py-1">
                              {isHighlighted
                                ? highlightMatch(cellValue, query)
                                : cellValue}
                            </td>
                          )
                        })}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : query.trim() ? (
            <div className="px-3 py-4 text-2xs text-slate-400 text-center">
              No results matching "{query}"
            </div>
          ) : (
            <div className="px-3 py-4 text-2xs text-slate-400 text-center">
              Type to search...
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  )
}
