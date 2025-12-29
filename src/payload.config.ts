// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { s3Storage } from '@payloadcms/storage-s3'
import { mcpPlugin } from '@payloadcms/plugin-mcp'
import { lexicalEditor , BlocksFeature } from '@payloadcms/richtext-lexical'

import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Collections Import
import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Posts } from './collections/Posts'
import { TreeNodes } from './collections/TreeNodes'
import { KnowledgeProject } from './collections/KnowledgeProjects'

// Blocks Import
import { FileTreeBlock } from './blocks/FileTreeBlock/config'
import { CodeBlock } from './blocks/CodeBlock/config'
import { AnimatedTabsBlock } from './blocks/AnimatedTabsBlock/config'
import { MermaidBlock } from './blocks/MermaidBlock/config'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const DATABASE_URI = process.env.NODE_ENV === 'production'
  ? process.env.DATABASE_URI_POOL || process.env.DATABASE_URI_DIRECT
  : process.env.DATABASE_URI_DIRECT;

console.log(DATABASE_URI , process.env.NODE_ENV)


export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Projects, Posts, TreeNodes , KnowledgeProject],
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      ...defaultFeatures,
      // This is incredibly powerful. You can re-use your Payload blocks
      // directly in the Lexical editor as follows:
      BlocksFeature({
        blocks: [FileTreeBlock, CodeBlock , AnimatedTabsBlock, MermaidBlock],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: DATABASE_URI,
      max : process.env.NODE_ENV === 'production' ? 10 : 2,
      idleTimeoutMillis : 30000
    },
    push : process.env.NODE_ENV !== 'production',
  }),
  sharp,
  plugins: [
    //MCP Plugin
    mcpPlugin(
      {
        collections : {
          projects : {
            description : `
            # Colección _projects_ 
            Esta colección contiene información detallada sobre los 
            proyectos realizados, incluyendo títulos, descripciones técnicas, 
            tecnologías utilizadas y estados de desarrollo. 
            Es la fuente principal para consultar el portafolio de trabajos y casos de estudio.
            # Relaciones
              1. Esta colección tiene una relación con la colección knowledge_project en esta relación
              se puede acceder a documentos relevantes asociados al proyecto.
            
            `,
            enabled : {
              find : true,
              create : false,
              update : false,
              delete : false,
            },
          },
          knowledge_project : {
            description : `
            # Colección _knowledge_project_
            Esta colección actúa como una base de conocimientos técnica vinculada a los proyectos.
            Contiene documentación detallada, guías de implementación, especificaciones y 
            recursos adicionales que complementan la información general de cada proyecto.
            # Relaciones
              1. Esta colección tiene una relación directa con la colección projects, 
              permitiendo vincular documentos técnicos específicos con su proyecto de origen.
            `,
            enabled : {
              find : true,
              create : false,
              update : false,
              delete : false,
            },
          },
          posts : {
            description : `
            # Colección _posts_
            Esta colección gestiona las publicaciones del blog y artículos informativos. 
            Contiene el contenido editorial, incluyendo títulos, resúmenes, contenido extenso 
            y metadatos asociados. Es la fuente principal para acceder a noticias, 
            tutoriales y actualizaciones del sitio.
            `,
            enabled : {
              find : true,
              create : false,
              update : false,
              delete : false,
            },
          },
          users : {
            enabled : false
          },
          media : {
            enabled : false
          },
          "tree-nodes" : {
            enabled : false
          },
        },
        mcp : {
          handlerOptions : {
            verboseLogs : true,
          },
        },
      }
    ),
    //Payload Cloud Plugin
    payloadCloudPlugin(),
    // Storage Supabase Config Plugin
    s3Storage({
      collections : {
        media : {
          prefix : 'media'
        },
        knowledge_project : {
          prefix : 'knowledge_project'
        }
      },
      bucket : process.env.S3_BUCKET || '',
      config : {
        forcePathStyle : true,
        credentials : {
          accessKeyId : process.env.S3_ACCESS_KEY_ID || '',
          secretAccessKey : process.env.S3_SECRET_ACCESS_KEY || ''
        },
        region : process.env.S3_REGION,
        endpoint : process.env.S3_ENDPOINT,
      }
    })
  ],
})
