import type { CollectionConfig, RichTextField } from 'payload'
import {
  convertLexicalToMarkdown,
  editorConfigFactory,
} from '@payloadcms/richtext-lexical'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { revalidatePath } from 'next/cache'


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
  hooks: {
    afterRead: [
      async ({ doc, req, collection }) => {
        if (req.payloadAPI === 'MCP' && doc.richText) {
          const field = collection.fields.find(
            (f) => 'name' in f && f.name === 'richText',
          ) as RichTextField

          if (field) {
            doc.richText = convertLexicalToMarkdown({
              data: doc.richText as SerializedEditorState,
              editorConfig: editorConfigFactory.fromField({
                field,
              }),
            })
          }
        }
        return doc
      },
    ],
    afterChange: [
      ({ doc }) => {
        revalidatePath('/blog')
        revalidatePath(`/blog/${doc.slug}`)
      },
    ],
    afterDelete: [
      ({ doc }) => {
        revalidatePath('/blog')
        revalidatePath(`/blog/${doc.slug}`)
      },
    ],
  },
}