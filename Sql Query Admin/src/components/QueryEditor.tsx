import Editor from '@monaco-editor/react';

interface QueryEditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function QueryEditor({ value, onChange }: QueryEditorProps) {
  return (
    <Editor
      height="250px"
      defaultLanguage="sql"
      value={value}
      onChange={(val) => onChange(val || '')}
      theme="vs-light"
      options={{
        minimap: { enabled: false },
        fontSize: 13,
        fontFamily: 'Consolas, "Courier New", monospace',
        lineNumbers: 'on',
        folding: true,
        automaticLayout: true,
        wordWrap: 'on',
        scrollBeyondLastLine: false,
        tabSize: 2,
        padding: { top: 10 },
      }}
    />
  );
}
