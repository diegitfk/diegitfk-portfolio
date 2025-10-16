// storage-adapter-import-placeholder
import { postgresAdapter } from '@payloadcms/db-postgres'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { s3Storage } from '@payloadcms/storage-s3'
import { lexicalEditor , BlocksFeature } from '@payloadcms/richtext-lexical'

import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Projects } from './collections/Projects'
import { Posts } from './collections/Posts'
import { TreeNodes } from './collections/TreeNodes'

import { FileTreeBlock } from './blocks/FileTreeBlock/config'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Projects, Posts, TreeNodes],
  editor: lexicalEditor({
    features: ({ defaultFeatures, rootFeatures }) => [
      ...defaultFeatures,
      // This is incredibly powerful. You can re-use your Payload blocks
      // directly in the Lexical editor as follows:
      BlocksFeature({
        blocks: [FileTreeBlock],
      }),
    ],
  }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [
    payloadCloudPlugin(),
    // Storage Supabase Config Plugin
    s3Storage({
      collections : {
        media : {
          prefix : 'media'
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
