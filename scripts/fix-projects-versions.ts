import { getPayload } from 'payload'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 1. CARGAR VARIABLES DE ENTORNO PRIMERO
dotenv.config({
  path: path.resolve(__dirname, '../.env'),
})

// Validación extra
if (!process.env.PAYLOAD_SECRET) {
  console.error('❌ ERROR CRÍTICO: No se encontró PAYLOAD_SECRET en las variables de entorno.')
  process.exit(1)
}

// 🔌 Parche para conexión directa a Supabase
if (!process.env.DATABASE_URI && process.env.DATABASE_URI_DIRECT) {
  process.env.DATABASE_URI = process.env.DATABASE_URI_DIRECT
  console.log('🔌 Configurando DATABASE_URI con la conexión directa...')
}

const fixProjectsVersions = async () => {
  console.log('--- 🛠️  Iniciando Script de Reparación de Proyectos ---')

  // 2. IMPORTACIÓN DINÁMICA
  const { default: config } = await import('../src/payload.config')

  console.log('✅ Configuración cargada. Inicializando Payload...')

  // 3. Inicializar Payload
  const payload = await getPayload({ config })

  // 4. Buscar Proyectos
  const projects = await payload.find({
    collection: 'projects',
    limit: 5000,
    depth: 0,
    overrideAccess: true,
  })

  console.log(`📊 Encontrados: ${projects.totalDocs} proyectos. Procesando...`)

  let successCount = 0
  let errorCount = 0

  for (const doc of projects.docs) {
    process.stdout.write(`.`) 

    try {
      await payload.update({
        collection: 'projects',
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

fixProjectsVersions()
