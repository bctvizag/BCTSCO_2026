import { useState, useCallback } from 'react';
import { Play, Save, Database, AlertCircle, CheckCircle, Loader2, History } from 'lucide-react';
import { QueryEditor } from './components/QueryEditor';
import { ResultsTable } from './components/ResultsTable';
import { SavedQueriesList } from './components/SavedQueriesList';
import { executeQuery, testConnection } from './lib/api';
import { supabase } from './lib/supabase';
import type { SavedQuery } from './lib/supabase';

function App() {
  const [description, setDescription] = useState('');
  const [sqlQuery, setSqlQuery] = useState('SELECT TOP 100 * FROM INFORMATION_SCHEMA.TABLES');
  const [results, setResults] = useState<{ columns: string[]; rows: Record<string, unknown>[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error' | 'unknown'>('unknown');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [activeTab, setActiveTab] = useState<'editor' | 'saved'>('editor');

  const checkConnection = useCallback(async () => {
    setConnectionStatus('checking');
    try {
      const result = await testConnection();
      setConnectionStatus(result.success ? 'connected' : 'error');
    } catch {
      setConnectionStatus('error');
    }
  }, []);

  const handleExecute = async () => {
    if (!sqlQuery.trim()) {
      setError('Please enter a SQL query');
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const result = await executeQuery(sqlQuery);
      if (result.success) {
        setResults({ columns: result.columns, rows: result.rows });
      } else {
        setError(result.error || 'Query execution failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute query');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!sqlQuery.trim()) {
      alert('Please enter a SQL query to save');
      return;
    }

    const desc = description.trim() || 'Untitled Query';

    setSaving(true);
    try {
      const { error } = await supabase.from('saved_queries').insert({
        description: desc,
        sql_query: sqlQuery,
      });

      if (error) throw error;

      setDescription('');
      setRefreshTrigger((prev) => prev + 1);
      alert('Query saved successfully!');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save query');
    } finally {
      setSaving(false);
    }
  };

  const handleSelectSaved = (query: SavedQuery) => {
    setDescription(query.description);
    setSqlQuery(query.sql_query);
    setActiveTab('editor');
  };

  const handleExecuteSaved = async (query: SavedQuery) => {
    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const result = await executeQuery(query.sql_query);
      if (result.success) {
        setResults({ columns: result.columns, rows: result.rows });
      } else {
        setError(result.error || 'Query execution failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to execute query');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-3">
              <Database className="w-6 h-6 text-blue-600" />
              <h1 className="text-lg font-semibold text-gray-900">SQL Query Executor</h1>
            </div>

            <div className="flex items-center gap-2">
              {connectionStatus === 'unknown' && (
                <button
                  onClick={checkConnection}
                  className="text-xs text-gray-500 hover:text-gray-700 px-3 py-1 rounded border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  Check Connection
                </button>
              )}
              {connectionStatus === 'checking' && (
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Checking...
                </span>
              )}
              {connectionStatus === 'connected' && (
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Connected to MSSQL
                </span>
              )}
              {connectionStatus === 'error' && (
                <span className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Connection Failed
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
              <div className="border-b border-gray-200 flex">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`px-4 py-2 text-sm font-medium transition-colors ${
                    activeTab === 'editor'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  Query Editor
                </button>
                <button
                  onClick={() => setActiveTab('saved')}
                  className={`px-4 py-2 text-sm font-medium transition-colors flex items-center gap-1.5 ${
                    activeTab === 'saved'
                      ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <History className="w-4 h-4" />
                  Saved Queries
                </button>
              </div>

              {activeTab === 'editor' && (
                <div className="p-4 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter a description for this query..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      SQL Query
                    </label>
                    <div className="border border-gray-300 rounded-md overflow-hidden">
                      <QueryEditor value={sqlQuery} onChange={setSqlQuery} />
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleExecute}
                      disabled={loading}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Executing...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Run Query
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 text-white rounded-md hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" />
                          Save Query
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'saved' && (
                <div className="p-4">
                  <SavedQueriesList
                    onSelect={handleSelectSaved}
                    onExecute={handleExecuteSaved}
                    refreshTrigger={refreshTrigger}
                  />
                </div>
              )}
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800">Query Error</h3>
                    <p className="mt-1 text-sm text-red-700 font-mono whitespace-pre-wrap">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {results && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2">Results</h2>
                <ResultsTable columns={results.columns} rows={results.rows} />
              </div>
            )}

            {!results && !error && (
              <div className="bg-gray-100 border border-gray-200 rounded-lg p-8 text-center">
                <Database className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500">
                  Enter a SQL query and click "Run Query" to see results
                </p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4 sticky top-20">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Tips</h3>
              <ul className="text-xs text-gray-600 space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">1.</span>
                  Write your SQL query in the editor
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">2.</span>
                  Click "Run Query" to execute against MSSQL
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">3.</span>
                  Use column filters to search results
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">4.</span>
                  Export to CSV or Excel files
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">5.</span>
                  Save frequently used queries
                </li>
              </ul>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  <strong>Target:</strong> localhost\SQLEXPRESS
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  <strong>Database:</strong> PCSC
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
