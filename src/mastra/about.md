# Documentación de /mastra

## Descripción General

La carpeta `/mastra` es el punto de entrada central para toda la configuración y funcionalidad relacionada con el framework Mastra en este proyecto. Mastra es un framework **framework-agnostic** para construir agentes de IA, workflows y herramientas.

## Estructura del Proyecto

```
src/mastra/
├── agents/           # Agentes de IA configurados
├── tools/            # Herramientas reutilizables para agentes
├── workflows/        # Workflows multi-paso
├── index.ts          # Punto de entrada y configuración de Mastra
└── about.md          # Esta documentación
```

## Carpetas

### `/agents`
**Propósito:** Define y configura los agentes de IA que ejecutan tareas específicas.

**Contenido actual:**
- `blog-agent.ts` - Agente especializado para interactuar con contenido de blog

**Características:**
- Cada agente tiene un nombre, instrucciones y un modelo de IA asignado
- Los agentes pueden usar herramientas (tools) para realizar acciones
- Se configuran con modelos de diferentes proveedores (OpenAI, NVIDIA, Anthropic, etc.)

**Ejemplo de uso:**
```typescript
export const blogAgent = new Agent({
  name: "Blog Agent",
  instructions: `...`,
  model: nim.chatModel("nvidia/llama-3.3-70b-instruct"),
  tools: { searchTool, contentTool }
})
```

### `/tools`
**Propósito:** Contiene herramientas reutilizables que los agentes pueden invocar para realizar acciones específicas.

**Contenido actual:**
- `get_content_current_blog.ts` - Obtiene contenido completo de un blog
- `search_info_current_blog.ts` - Búsqueda semántica en blogs
- `weather-tool.ts` - Herramienta de ejemplo para obtener información del clima

**Características:**
- Cada tool define un schema de entrada/salida con Zod
- Tienen una función `execute` que implementa la lógica
- Son type-safe y auto-documentadas
- Pueden ser compartidas entre múltiples agentes

**Ejemplo de estructura:**
```typescript
export const myTool = createTool({
  id: "tool-id",
  description: "Descripción de la herramienta",
  inputSchema: z.object({ ... }),
  outputSchema: z.object({ ... }),
  execute: async ({ context }) => { ... }
})
```

### `/workflows`
**Propósito:** Define workflows multi-paso que orquestan agentes y herramientas de manera secuencial o paralela.

**Contenido actual:**
- `supervisor_blog/` - Workflow supervisor para operaciones de blog

**Características:**
- Los workflows definen pasos (steps) que se ejecutan en orden
- Pueden invocar agentes, herramientas u otros workflows
- Soportan manejo de errores y flujos condicionales
- Útiles para procesos complejos que requieren múltiples interacciones

**Ejemplo de estructura:**
```typescript
export const myWorkflow = createWorkflow({
  name: "workflow-name",
  triggerSchema: z.object({ ... }),
  outputSchema: z.object({ ... }),
  execute: async ({ inputData, mastra }) => { ... }
})
```

### `index.ts`
**Propósito:** Archivo de configuración central que registra y exporta la instancia de Mastra.

**Responsabilidades:**
- Registra todos los agentes disponibles
- Registra todos los workflows disponibles
- Configura storage (LibSQL, Postgres, etc.)
- Configura logging (Pino, Console, etc.)
- Configura observabilidad y telemetría
- Exporta la instancia `mastra` para uso en la aplicación

**Configuración actual:**
```typescript
export const mastra = new Mastra({
  agents: { blogAgent },
  storage: new LibSQLStore({ url: ":memory:" }),
  logger: new PinoLogger({ name: 'Mastra', level: 'info' }),
  observability: { default: { enabled: false } },
})
```

## Principios de Organización

1. **Framework Agnostic**: El código en `/mastra` debe ser independiente del framework frontend (Next.js, Astro, etc.)
2. **Centralización**: Toda la lógica de IA debe vivir en esta carpeta
3. **Modularidad**: Cada agente, tool y workflow es un módulo independiente
4. **Type Safety**: Todo está tipado con TypeScript y Zod
5. **Reutilización**: Los tools pueden ser compartidos entre múltiples agentes

## Integración con Next.js

### ⚠️ Sobre la carpeta `actions/`

La carpeta `actions/` **NO se incluye** en la estructura de `/mastra` por las siguientes razones:

#### ❌ **Por qué NO incluirla aquí:**

1. **Violación de Separación de Concerns**
   - La carpeta `/mastra` debe contener código framework-agnostic
   - Server Actions son específicas de Next.js (requieren `"use server"`)
   - Mezclar código específico de framework rompe la portabilidad

2. **Patrón Recomendado por Mastra**
   - La [documentación oficial](https://mastra.ai/docs/frameworks/web-frameworks/next-js) muestra las actions dentro de las rutas de Next.js
   - Ejemplo oficial: `app/test/action.ts` (no `mastra/actions/action.ts`)
   - Las actions deben estar colocadas cerca de donde se usan (colocation pattern)

3. **Mantenibilidad**
   - Facilita distinguir qué código es de Mastra y qué es de Next.js
   - Permite migrar a otro framework sin afectar `/mastra`
   - Evita confusión sobre dependencias

#### ✅ **Estructura Recomendada:**

```
src/
├── app/                          # Next.js App Router
│   ├── (frontend)/
│   │   └── test/
│   │       ├── page.tsx         # Página
│   │       ├── form.tsx         # Componente cliente
│   │       └── actions.ts       # Server Actions aquí ✓
│   └── api/                     # API Routes (alternativa)
│
├── mastra/                       # Framework-agnostic
│   ├── agents/                  # Agentes de IA
│   ├── tools/                   # Herramientas
│   ├── workflows/               # Workflows
│   └── index.ts                 # Configuración
```

#### 📝 **Uso Correcto de Server Actions:**

```typescript
// ✓ CORRECTO: src/app/(frontend)/blog/actions.ts
"use server"

import { mastra } from "@/mastra/index";

export async function getBlogInfo(formData: FormData) {
  const slug = formData.get("slug")?.toString();
  const agent = mastra.getAgent("blogAgent");
  const result = await agent.generate(`...`);
  return result.text;
}
```

## Referencias

- [Documentación Oficial de Mastra](https://mastra.ai/docs)
- [Estructura de Proyecto Recomendada](https://mastra.ai/docs/getting-started/project-structure)
- [Integración con Next.js](https://mastra.ai/docs/frameworks/web-frameworks/next-js)
- [API Reference](https://mastra.ai/docs/reference/core/mastra-class)

## Flujo de Trabajo

1. **Definir Tools** en `/tools` con schemas claros
2. **Crear Agentes** en `/agents` asignándoles tools
3. **Registrar en `index.ts`** para hacerlos disponibles
4. **Usar en la App** mediante `mastra.getAgent()` desde Server Actions o API Routes
5. **(Opcional) Crear Workflows** para procesos complejos

## Convenciones

- Nombres de archivos en kebab-case: `blog-agent.ts`
- Nombres de exports en camelCase: `blogAgent`
- IDs de tools/workflows en kebab-case: `"get-content-blog"`
- Siempre usar Zod para schemas de entrada/salida
- Documentar descripciones claras en cada tool/agent

## Próximos Pasos

- [ ] Implementar lógica real en `get_content_current_blog.ts` usando Payload CMS
- [ ] Implementar búsqueda semántica en `search_info_current_blog.ts` con Supabase
- [ ] Registrar workflows en `index.ts` cuando estén listos
- [ ] Configurar variables de entorno para modelos de IA
- [ ] Considerar agregar scorers para evaluación de agentes
