import { getPayload } from 'payload'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 1. CARGAR VARIABLES DE ENTORNO PRIMERO
// Esto debe suceder antes de importar la configuración de Payload
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

// Validación extra para asegurar que se cargaron
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ ERROR CRÍTICO: No se encontró PAYLOAD_SECRET en las variables de entorno.')
  console.error('   Asegúrate de que el archivo .env está en la raíz y tiene la clave correcta.')
  process.exit(1)
}

// 🔌 Parche para conexión directa a Supabase (evita errores de puerto 6543)
if (!process.env.DATABASE_URI && process.env.DATABASE_URI_DIRECT) {
  process.env.DATABASE_URI = process.env.DATABASE_URI_DIRECT
  console.log('🔌 Configurando DATABASE_URI con la conexión directa...')
}

const fixVersions = async () => {
  console.log('--- 🛠️  Iniciando Script de Reparación ---')

  // 2. IMPORTACIÓN DINÁMICA (LA SOLUCIÓN AL ERROR)
  // Usamos 'await import' en lugar de 'import' arriba para asegurar que
  // las variables de entorno ya existan cuando se lea este archivo.
  // Nota: Ajusta la ruta '../src/payload.config' si tu archivo tiene otro nombre.
  const { default: config } = await import('../src/payload.config')

  console.log('✅ Configuración cargada. Inicializando Payload...')

  // 3. Inicializar Payload
  const payload = await getPayload({ config })

  // 4. Buscar Posts
  const posts = await payload.find({
    collection: 'posts',
    limit: 5000,
    depth: 0,
    overrideAccess: true,
  })

  console.log(`📊 Encontrados: ${posts.totalDocs} posts. Procesando...`)

  let successCount = 0
  let errorCount = 0

  for (const doc of posts.docs) {
    process.stdout.write(`.`) 

    try {
      await payload.update({
        collection: 'posts',
        id: doc.id,
        data: {
          _status: 'published',
        },
        overrideAccess: true,
        context : {
            skipRevalidate: true
        }
      })
      successCount++
    } catch (error) {
      console.error(`\n❌ Falló ID ${doc.id}:`, error)
      errorCount++
    }
  }

  console.log('\n\n--- RESUMEN ---')
  console.log(`✅ Reparados: ${successCount}`)
  console.log(`❌ Fallidos:  ${errorCount}`)
  
  process.exit(0)
}

fixVersions()