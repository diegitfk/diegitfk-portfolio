import type { CollectionConfig } from 'payload'

export const TreeNodes: CollectionConfig = {
  slug: 'tree-nodes',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'type'],
    group: '_FileTree', // Agrupa la colección en la UI de admin
    description: 'Nodos para construir árboles de archivos.',
  },
  access: {
    read: () => true, // Permitir lectura pública para que el frontend pueda acceder
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre del Nodo',
    },
    {
      name: 'type',
      type: 'select',
      options: [
        { label: 'Archivo', value: 'file' },
        { label: 'Carpeta', value: 'folder' },
      ],
      required: true,
    },
    {
      name: 'isSelectable',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'children',
      type: 'relationship',
      relationTo: 'tree-nodes',
      hasMany: true,
      label: 'Nodos Hijos',
      admin: {
        // Solo muestra este campo si el nodo es una carpeta
        condition: (_, { type }) => type === 'folder',
      },
    },
  ],
}
