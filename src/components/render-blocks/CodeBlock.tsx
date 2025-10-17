import React from 'react';
import {CodeBlock , CodeBlockCopyButton} from '@/components/ai-elements/code-block';

// Define el tipo para las props
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
  filename: string;
}

export const CodeBlockRenderer: React.FC<CodeBlockProps> = ({ code, language , filename }) => {
  return (
    <section className='w-full rounded-md'>
      <div className='flex flex-row justify-between'>
        {/* Se debe controlar si no se entrega un filename, en este caso toma el lenguaje y renderiza el svg del lenguaje que se utiliza */}
        {filename && (<span className='p-2'>
          <h2 className='text-gray-500'>{filename}</h2>
        </span>)}
        <CodeBlockCopyButton
            onCopy={() => console.log('Copied code to clipboard')}
            onError={() => console.error('Failed to copy code to clipboard')}
          />
      </div>
      <CodeBlock code={code} language={language} showLineNumbers={true}/>
    </section>
  );
};