const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3001';

export interface QueryResult {
  success: boolean;
  columns: string[];
  rows: Record<string, unknown>[];
  rowCount: number;
  error?: string;
}

export async function executeQuery(sql: string): Promise<QueryResult> {
  const response = await fetch(`${SERVER_URL}/execute`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql }),
  });

  const data = await response.json();
  return data;
}

export async function testConnection(): Promise<{ success: boolean; message: string; server?: string; database?: string; error?: string }> {
  const response = await fetch(`${SERVER_URL}/test-connection`);
  return response.json();
}

export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  const response = await fetch(`${SERVER_URL}/health`);
  return response.json();
}
