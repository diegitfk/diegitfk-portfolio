import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título del post',
    },
    {
      name : "description",
      type : "text",
      required : false,
      label : "Descripción del post"
    },
    {
      name : "preview-image",
      type : "upload",
      relationTo : "media",
      required : false,
      label : "Imagen previa"
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      label: 'URL',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name : "richText",
      type : "richText",
    }
  ],
}