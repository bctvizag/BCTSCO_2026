import React, { useState } from 'react';
import { ExternalLink, Loader } from 'lucide-react';

const ApiLinkChecker: React.FC = () => {
  const [apiUrl, setApiUrl] = useState<string>('');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiUrl(e.target.value);
  };

  const checkApiLink = async () => {
    if (!apiUrl) {
      setError('Please enter an API URL');
      return;
    }

    setLoading(true);
    setError(null);
    setApiResponse(null);

    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed with status: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Failed to fetch data'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      checkApiLink();
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
        <ExternalLink className="w-6 h-6 mr-2 text-blue-500" />
        API Link Checker
      </h2>
      
      <div className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={apiUrl}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Paste API URL here (e.g., https://api.example.com/data)"
            className="flex-grow px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            onClick={checkApiLink}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:bg-blue-300"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              'Check'
            )}
          </button>
        </div>
        {error && (
          <p className="mt-2 text-red-500 text-sm">{error}</p>
        )}
      </div>

      {apiResponse && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">API Response:</h3>
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-96">
            <pre className="text-sm whitespace-pre-wrap break-words text-gray-800">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <div className="mt-6 text-sm text-gray-500">
        <p>Instructions:</p>
        <ol className="list-decimal ml-5 space-y-1">
          <li>Paste an API URL in the input field above</li>
          <li>Click "Check" or press Enter to fetch the data</li>
          <li>The API response will be displayed below (if successful)</li>
        </ol>
      </div>
    </div>
  );
};

export default ApiLinkChecker;