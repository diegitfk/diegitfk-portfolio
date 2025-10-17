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
      name  : "filename",
      label : "Nombre del archivo",
      type  : "text",
    },
    {
      name : "iconReference",
      label : "Icono de referencia para el bloque de código",
      type : "select",
      options : [
        // Lenguajes de programación
        { label: 'JavaScript', value: 'javascript' },
        { label: 'TypeScript', value: 'typescript' },
        { label: 'Python', value: 'python' },
        
        // Frameworks y librerías frontend
        { label: 'React', value: 'react' },
        { label: 'Next.js', value: 'nextjs' },
        { label: 'Astro', value: 'astro' },
        
        // Backend frameworks
        { label : 'Honojs' , value : 'honojs' },
        { label: 'FastAPI', value: 'fastapi' },
        
        // Bases de datos
        { label: 'MongoDB', value: 'mongodb' },
        { label: 'PostgreSQL', value: 'postgresql' },
        { label: 'MySQL', value: 'mysql' },
        { label: 'Redis', value: 'redis' },
        
        // DevOps y Cloud
        { label: 'Docker', value: 'docker' },
        { label: 'Docker Compose', value: 'docker-compose' },
        { label: 'Kubernetes', value: 'kubernetes' },
        { label: 'Terraform', value: 'terraform' },
        
        // Herramientas y utilidades
        { label: 'pnpm', value: 'pnpm' },
        
        // Formatos de archivo y configuración
        { label: 'JSON', value: 'json' },
        { label: 'YAML', value: 'yaml' },
        { label: 'TOML', value: 'toml' },
        
        // Shell y scripts
        { label: 'Bash', value: 'bash' },
        
        // Otros
        { label: 'Plain Text', value: 'text' },
      ],
      admin: {
        description: 'Selecciona la tecnología para mostrar el icono correspondiente.',
      },
    }
    ,
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