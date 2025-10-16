import type { Block } from 'payload';

export const CodeBlock: Block = {
  slug: 'codeBlock',
  interfaceName: 'CodeBlock',
  fields: [
    {
      name: 'language',
      label: 'Lenguaje',
      type: 'select',
      required: true,
      options: [
        // Opciones anteriores
        { label: 'Plain Text', value: 'text' },
        { label: 'JavaScript', value: 'javascript' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'JSON', value: 'json' },
        { label: 'CSS', value: 'css' },
        { label: 'HTML', value: 'html' },
        { label: 'Markdown', value: 'markdown' },
        // 👇 Nuevas opciones añadidas
        { label: 'Python', value: 'python' },
        { label: 'SQL', value: 'sql' },
        { label: 'YAML', value: 'yaml' },
        { label: 'Bash / Shell', value: 'bash' },
      ],
      defaultValue: 'javascript',
      admin: {
        description: 'Selecciona el lenguaje para el resaltado de sintaxis.',
      },
    },
    {
      name: 'code',
      label: 'Block Code',
      type: 'code',
      required: true,
      admin: {
        language: 'ace/mode/javascript',
        description: 'Escribe o pega tu código aquí.',
      },
    },
  ],
};