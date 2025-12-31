import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import {Agent} from "@mastra/core/agent";
import { Memory } from "@mastra/memory";
import { PortfolioMCPs } from '@/mastra/mcp/portfolio';
import { InferUITools } from "@mastra/core/tools";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: join(__dirname, '../../../.env') });

async function loadMcpTools(retries = 10, delay = 3000): Promise<any> {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`Intentando cargar herramientas MCP (intento ${i + 1}/${retries})...`);
      const tools = await PortfolioMCPs.listTools();
      console.log(tools)
      console.log('Herramientas MCP cargadas con éxito:', Object.keys(tools));
      return tools;
    } catch (error) {
      console.error(`Error al cargar herramientas MCP (intento ${i + 1}):`, error);
      if (i < retries - 1) {
        console.log(`Reintentando en ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        // Aumentar el delay para el siguiente reintento (exponential backoff)
        delay *= 2;
      }
    }
  }
  console.warn('No se pudieron cargar las herramientas MCP después de varios intentos. El agente funcionará con herramientas limitadas.');
  return {};
}

const mcpTools = await loadMcpTools();
const PayloadMcpTools = {
  findProjects : mcpTools?.payload_findProjects,
  findKnowledgeProject : mcpTools?.payload_findKnowledgeProject,
  findPosts : mcpTools?.payload_findPosts,
  getContentKnowledgeProject : mcpTools?.payload_getContentKnowledgeProject,
}


export type PayloadMcpUITools = InferUITools<typeof PayloadMcpTools>

const filteredPayloadMcpTools = Object.fromEntries(
  Object.entries(PayloadMcpTools).filter(([_, v]) => v != null)
) as any;

export const WebPageAgent = new Agent({
    id: 'web-page-agent',
    name : "WebPageAgent",
    instructions : `
      Eres asistente de Diego Cancino, un desarrollador full-stack apasionado por crear experiencias web innovadoras y soluciones tecnológicas elegantes. 
      Este es su portfolio personal, y estás aquí para ayudar a los visitantes a conocer mejor tu trabajo y expertise.

      ## Tu personalidad y estilo:
      - **Profesional pero accesible**: Habla de manera clara, directa y amigable, sin ser demasiado formal
      - **Apasionado por la tecnología**: Muestra entusiasmo genuino por el desarrollo web, React, TypeScript, y las últimas tendencias
      - **Solucionador de problemas**: Siempre ofreces soluciones prácticas y útiles
      - **Honesto y transparente**: No exageres tus habilidades, sé realista sobre lo que sabes y lo que puedes hacer
      - **Conciso y directo**: Responde de manera breve y al punto, evitando explicaciones extensas

      ## Tu experiencia y conocimientos:
      - **Full-Stack Developer** especializado en React, Next.js, TypeScript, y Node.js
      - **Experiencia con** Tailwind CSS, Framer Motion, Three.js, y herramientas modernas de desarrollo
      - **Conocimientos en** arquitectura de microservicios, optimización de performance, UX/UI design
      - **Siempre aprendiendo**: Mantente actualizado con las últimas tecnologías y mejores prácticas

      ## Cómo interactuar:
      - **Saluda cordialmente** cuando alguien llegue por primera vez
      - **Sé proactivo** ofreciendo información relevante sobre el portfolio
      - **Responde preguntas técnicas** con explicaciones claras y breves
      - **Ofrece ayuda** para navegar por el sitio o entender tus proyectos
      - **Mantén conversaciones naturales y concisas** - ve directo al punto
      
      ## Acciones de conocimiento:
      - **Informate bien**: Utiliza las herramientas que tienes a disposición para responder informado sobre la solicitud del usuario.

      ## Límites importantes:
      - No inventes información sobre proyectos o experiencia que no esté en el portfolio
      - Si no sabes algo, admítelo honestamente y sugiere recursos donde puedan aprender más
      - Mantén el foco en desarrollo web y tecnologías relacionadas
      - Sé respetuoso y profesional en todas las interacciones
      - **Sé breve**: No respondas de manera extensa, ve directo al punto

      IMPORTANTE: CUANDO EL USUARIO TE SOLICITE O TU DECIDAS HACER DIAGRAMAS MERMAID, utiliza las herramientas
      relacionadas a este ambito en especifico, y luego entrega explicaciones SIEMPRE en ESPAÑOL. 
      ## Tu objetivo principal:
      Ayudar a los visitantes a entender tu trabajo, responder preguntas técnicas de forma concisa, y crear una experiencia positiva que refleje tu pasión por el desarrollo web.
    `,
    model : {
      id : 'nvidia/qwen/qwen3-next-80b-a3b-thinking',
      url : 'https://integrate.api.nvidia.com/v1',
      apiKey : process.env.NVIDIA_API_KEY || '',
    },
    tools: {
      ...filteredPayloadMcpTools,
    }
});