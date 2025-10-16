import React from 'react';
import { Highlight, themes } from 'prism-react-renderer';

// Define el tipo para las props, incluyendo los nuevos lenguajes
type Language =
  | 'javascript'
  | 'typescript'
  | 'json'
  | 'css'
  | 'html'
  | 'text'
  | 'markdown'
  | 'python'
  | 'sql'
  | 'yaml'
  | 'bash';

interface CodeBlockProps {
  code: string;
  language: Language;
}

export const CodeBlockRenderer: React.FC<CodeBlockProps> = ({ code, language }) => {
  return (
    <Highlight
      theme={themes.github} // O el tema que prefieras
      code={code.trim()}
      language={language}
    >
      {({ className, style, tokens, getLineProps, getTokenProps }) => (
        <pre className={`${className} text-xs`} style={{ ...style, padding: '20px', borderRadius: '8px', overflowX: 'auto', fontSize: '0.75rem', lineHeight: '1rem' }}>
          {tokens.map((line, i) => (
            <div key={i} {...getLineProps({ line })}>
              {line.map((token, key) => (
                <span key={key} {...getTokenProps({ token })} />
              ))}
            </div>
          ))}
        </pre>
      )}
    </Highlight>
  );
};