import type { Block } from 'payload'

export const FileTreeBlock: Block = {
  slug: 'fileTree',
  interfaceName: 'FileTreeBlockType',
  labels: {
    singular: 'File Tree',
    plural: 'File Trees',
  },
  fields: [
    {
      name: 'initialSelectedId',
      type: 'text',
      label: 'ID del archivo seleccionado inicialmente',
      admin: {
        description: 'Ejemplo: "3" para que un archivo específico aparezca seleccionado',
      },
    },
    {
      name: 'showIndicator',
      type: 'checkbox',
      label: 'Mostrar líneas de conexión',
      defaultValue: true,
      admin: {
        description: 'Las líneas verticales que conectan carpetas y archivos',
      },
    },
    {
      name: 'rootNodes',
      type: 'relationship',
      relationTo: 'tree-nodes',
      hasMany: true,
      label: 'Nodos Raíz',
      admin: {
        description: 'Selecciona los archivos y carpetas que aparecerán en el nivel raíz del árbol.',
      },
    },
  ],
}