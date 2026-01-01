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
import { z } from 'zod'

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

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Projects, Posts, TreeNodes , KnowledgeProject],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => [
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
      // Increase connection limit in dev to prevent hangs during revalidation/HMR
      max : process.env.NODE_ENV === 'production' ? 10 : 5, 
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
          tools : [
            {
              name : "getContentKnowledgeProject",
              description : "Obtiene el contenido en bruto (raw) de un archivo de la base de conocimientos técnica de un proyecto.",
              parameters : z.object({
                filename: z.string().describe("Nombre del archivo (ejemplo: 'cloud_proyect.md')")
              }).shape,
              handler : async (args , req) => {
                const { payload } = req;
                const { filename } = args as { filename: string };

                try {
                  const result = await payload.find({
                    collection: 'knowledge_project',
                    where: {
                      filename: {
                        equals: filename,
                      },
                    },
                    limit: 1,
                  });

                  if (!result.docs || result.docs.length === 0) {
                    return {
                      content: [
                        {
                          type: "text",
                          text: `No se encontró ningún archivo con el nombre "${filename}" en la base de conocimientos.`
                        }
                      ]
                    };
                  }

                  const doc = result.docs[0];
                  let fileUrl = doc.url;
                  
                  if (!fileUrl) {
                    return {
                      content: [
                        {
                          type: "text",
                          text: "El documento existe pero no tiene una URL asociada."
                        }
                      ]
                    };
                  }

                  // Si la URL es relativa, la convertimos en absoluta usando la información del servidor
                  if (fileUrl.startsWith('/')) {
                    const protocol = (req.protocol || 'http').replace(':', '');
                    const host = req.headers.get('host') || 'localhost:3000';
                    fileUrl = `${protocol}://${host}${fileUrl}`;
                  }

                  const response = await fetch(fileUrl);
                  
                  if (!response.ok) {
                    throw new Error(`Error al obtener el archivo: ${response.statusText}`);
                  }

                  const content = await response.text();

                  return {
                    content: [
                      {
                        type: "text",
                        text: content
                      }
                    ]
                  };
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
              } catch (error: any) {
                  return {
                    content: [
                      {
                        type: "text",
                        text: `Hubo un problema al procesar la solicitud: ${error.message}`
                      }
                    ]
                  };
                }
              }
            }
          ]
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
