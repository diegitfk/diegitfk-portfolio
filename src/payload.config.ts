// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { s3Storage } from '@payloadcms/storage-s3'
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
