import React from 'react';
import { Product } from '../data';

interface ProductResultsProps {
  products: Product[];
  searchQuery: string;
}

const ProductResults: React.FC<ProductResultsProps> = ({ products, searchQuery }) => {
  if (!products.length) {
    return (
      <div className="mt-8 text-center text-gray-500">
        {searchQuery ? 'No products found matching your search.' : 'Enter a search term to find products.'}
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">
        {products.length} {products.length === 1 ? 'Result' : 'Results'} {searchQuery && `for "${searchQuery}"`}
      </h2>
      
      <div className="overflow-hidden bg-white shadow-md rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                PID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                UID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Item Name
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Balance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.PID} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {product.PID}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {product.UID.trim()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {product.ItemName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    product.Balance > 10 
                      ? 'bg-green-100 text-green-800' 
                      : product.Balance > 0 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {product.Balance}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductResults;