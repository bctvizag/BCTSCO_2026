import { useEffect, useState, type MouseEvent } from 'react';
import { supabase, type SavedQuery } from '../lib/supabase';
import { Clock, Trash2, FileText, Play } from 'lucide-react';

interface SavedQueriesListProps {
  onSelect: (query: SavedQuery) => void;
  onExecute: (query: SavedQuery) => void;
  refreshTrigger: number;
}

export function SavedQueriesList({ onSelect, onExecute, refreshTrigger }: SavedQueriesListProps) {
  const [queries, setQueries] = useState<SavedQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQueries();
  }, [refreshTrigger]);

  const fetchQueries = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('saved_queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQueries(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch queries');
    } finally {
      setLoading(false);
    }
  };

  const deleteQuery = async (id: string, e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this query?')) return;

    try {
      const { error } = await supabase.from('saved_queries').delete().eq('id', id);
      if (error) throw error;
      setQueries((prev) => prev.filter((q) => q.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete query');
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        Loading saved queries...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-600 text-sm">
        Error: {error}
        <button onClick={fetchQueries} className="ml-2 text-blue-600 hover:underline">
          Retry
        </button>
      </div>
    );
  }

  if (queries.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 text-sm">
        No saved queries yet. Save a query to see it here.
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[400px] overflow-auto">
      {queries.map((query) => (
        <div
          key={query.id}
          onClick={() => onSelect(query)}
          className="p-3 bg-white border border-gray-200 rounded hover:border-blue-500 hover:shadow-sm cursor-pointer transition-all group"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                <span className="font-medium text-sm text-gray-800 truncate">
                  {query.description || 'Untitled Query'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {formatDate(query.created_at)}
              </div>
              <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded font-mono truncate">
                {query.sql_query}
              </div>
            </div>
            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExecute(query);
                }}
                className="p-1 text-green-600 hover:text-green-800 transition-colors"
                title="Execute query"
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => deleteQuery(query.id, e)}
                className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                title="Delete query"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
