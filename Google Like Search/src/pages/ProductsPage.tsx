import React, { useState } from 'react';
import SearchBox from '../components/SearchBox';
import TabularSearchBox from '../components/TabularSearchBox';
import ComboSearchBox from '../components/ComboSearchBox';
import ProductResults from '../components/ProductResults';
import { products, Product } from '../data';

const ProductsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);

  const handleProductSearch = (query: string, results: Product[]) => {
    setSearchQuery(query);
    setSearchResults(results);
  };

  return (
    <>
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Original SearchBox</h3>
        <SearchBox<Product>
          items={products}
          onSearch={handleProductSearch}
          placeholder="Search for products..."
          searchFields={['ItemName', 'UID', 'PID']}
          displayFields={['ItemName', 'PID', 'UID']}
          valueField="ItemName"
          highlightField="ItemName"
          rightField="Balance"
          rightFieldLabel="Stock"
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">New Tabular SearchBox</h3>
        <TabularSearchBox<Product>
          items={products}
          onSearch={handleProductSearch}
          placeholder="Search for products..."
          searchFields={['ItemName', 'UID', 'PID']}
          displayFields={['PID', 'UID', 'ItemName', 'Balance']}
          fieldLabels={{
            'PID': 'Product ID',
            'UID': 'Unique ID',
            'ItemName': 'Item Name',
            'Balance': 'Stock Balance'
          }}
          valueField="ItemName"
          highlightField="ItemName"
          resizable={true}
          minHeight={200}
          maxHeight={500}
          showResultsCount={true}
        />
      </div>
      
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Combo SearchBox (Select-style)</h3>
        <ComboSearchBox<Product>
          items={products}
          onSearch={handleProductSearch}
          onSelect={(item) => {
            console.log('Selected product:', item);
            handleProductSearch(item.ItemName, [item]);
          }}
          placeholder="Select or search for products..."
          searchFields={['ItemName', 'UID', 'PID']}
          displayFields={['PID', 'UID', 'ItemName', 'Balance']}
          fieldLabels={{
            'PID': 'Product ID',
            'UID': 'Unique ID',
            'ItemName': 'Item Name',
            'Balance': 'Stock Balance'
          }}
          valueField="ItemName"
          highlightField="ItemName"
          showResultsCount={true}
        />
      </div>
      
      <ProductResults 
        products={searchResults} 
        searchQuery={searchQuery} 
      />
    </>
  
  );
};

export default ProductsPage;