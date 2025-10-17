import React from 'react';
import { CodeBlockContext, CodeBlockCopyButton } from '@/components/ai-elements/code-block';
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  oneDark,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";
// Icons Imports
import { 
  JavaScript , TypeScript , Python , 
  ReactLight  , Nextjs , AstroLight , 
  Hono , FastAPI , MongoDB , PostgreSQL ,
   MySQL , Redis , Docker , Kubernetes , 
   Terraform  , PnpmLight
} from "@ridemountainpig/svgl-react";
import SettingIcon from "@/public/icons/settings-svgrepo-com.svg";

interface IconsReference {
  reference : string;
  icon : React.ReactNode;
}
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
  iconReference : string;
}

const iconsReference : IconsReference[] = [
  {
    reference : "javascript",
    icon : <JavaScript />
  },
  {
    reference : "typescript",
    icon : <TypeScript />
  },
  {
    reference : "python",
    icon : <Python />
  },
  {
    reference : "react" ,
    icon : <ReactLight />
  },
  {
    reference : "nextjs",
    icon : <Nextjs />
  },
  {
    reference : "astro",
    icon : <AstroLight />
  },
  {
    reference : "honojs",
    icon : <Hono/>
  },
  {
    reference : "fastapi",
    icon : <FastAPI/>
  },
  {
    reference : "mongodb",
    icon : <MongoDB/>
  },
  {
    reference : "postgresql",
    icon : <PostgreSQL/>
  },
  {
    reference : "mysql",
    icon : <MySQL/>
  },
  {
    reference : "redis",
    icon : <Redis/>
  },
  {
    reference : "docker",
    icon : <Docker/>
  },
  {
    reference : "docker-compose",
    icon : <Docker/>
  },
  {
    reference : "kubernetes",
    icon : <Kubernetes/>
  },
  {
    reference : "terraform",
    icon : <Terraform/>
  },
  {
    reference : "pnpm",
    icon : <PnpmLight/>
  },
  {
    reference : "toml" ,
    icon : <SettingIcon/>

  },
  {
    reference : "json",
    icon : <SettingIcon/>

  },
  {
    reference : "yaml",
    icon : <SettingIcon/>

  },
]

/**
 * Obtiene el icono correspondiente según la referencia de tecnología
 * @param reference - La referencia de la tecnología (ej: 'javascript', 'react', 'docker')
 * @returns El icono React correspondiente o null si no se encuentra
 */
const getIconByReference = (reference: string): React.ReactNode | null => {
  console.log(`Obteniendo icon : ${reference}`)
  const iconData = iconsReference.find(item => item.reference === reference);
  return iconData ? iconData.icon : null;
};

export const CodeBlockRenderer: React.FC<CodeBlockProps> = ({ code, language , filename , iconReference }) => {
  const icon = getIconByReference(iconReference);

  return (
    <CodeBlockContext.Provider value={{ code }}>
      <section className='w-full rounded-md'>
        {/* Header con icono, filename y botón de copiar */}
        <div className='flex flex-row justify-between items-center p-2 border-b bg-muted/50'>
          <span className='flex items-center gap-2'>
            {icon && (
              <div className='w-4 h-4 flex items-center justify-center'>
                {icon}
              </div>
            )}
            {filename && (
              <h2 className='text-sm text-muted-foreground font-mono pt-1'>{filename}</h2>
            )}
          </span>
          <CodeBlockCopyButton
            onCopy={() => console.log('Copied code to clipboard')}
            onError={(error) => console.error('Failed to copy code to clipboard', error)}
          />
        </div>
        
        {/* Bloque de código */}
        <div className="relative w-full overflow-hidden border bg-background text-foreground">
          <SyntaxHighlighter
            className="overflow-hidden dark:hidden"
            codeTagProps={{
              className: "font-mono text-sm",
            }}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
            }}
            language={language}
            lineNumberStyle={{
              color: "hsl(var(--muted-foreground))",
              paddingRight: "1rem",
              minWidth: "2.5rem",
            }}
            showLineNumbers={true}
            style={oneLight}
          >
            {code}
          </SyntaxHighlighter>
          <SyntaxHighlighter
            className="hidden overflow-hidden dark:block"
            codeTagProps={{
              className: "font-mono text-sm",
            }}
            customStyle={{
              margin: 0,
              padding: "1rem",
              fontSize: "0.875rem",
              background: "hsl(var(--background))",
              color: "hsl(var(--foreground))",
            }}
            language={language}
            lineNumberStyle={{
              color: "hsl(var(--muted-foreground))",
              paddingRight: "1rem",
              minWidth: "2.5rem",
            }}
            showLineNumbers={true}
            style={oneDark}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </section>
    </CodeBlockContext.Provider>
  );
};