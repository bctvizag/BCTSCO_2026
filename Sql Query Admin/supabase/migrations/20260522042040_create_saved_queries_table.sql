/*
  # Create saved_queries table

  1. New Tables
    - `saved_queries`
      - `id` (uuid, primary key)
      - `description` (text) - Description of the SQL query
      - `sql_query` (text) - The SQL query text
      - `created_at` (timestamp) - When query was saved
      - `updated_at` (timestamp) - When query was last updated
  
  2. Security
    - Enable RLS on `saved_queries` table
    - Allow public access for this demo (can be restricted to authenticated users)
*/

CREATE TABLE IF NOT EXISTS saved_queries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  description text NOT NULL DEFAULT '',
  sql_query text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE saved_queries ENABLE ROW LEVEL SECURITY;

-- Allow all operations for now (demo purposes)
CREATE POLICY "Allow public read access"
  ON saved_queries FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow public insert"
  ON saved_queries FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Allow public update"
  ON saved_queries FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow public delete"
  ON saved_queries FOR DELETE
  TO public
  USING (true);

-- Create index for common queries
CREATE INDEX IF NOT EXISTS idx_saved_queries_created_at ON saved_queries(created_at DESC);
