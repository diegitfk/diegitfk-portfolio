import {Agent} from "@mastra/core/agent";
import {createOpenAICompatible} from "@ai-sdk/openai-compatible";

import { createStep ,  createWorkflow } from "@mastra/core/workflows"
import z from "zod";
const nim = createOpenAICompatible({
    name: 'nim',
    baseURL: 'https://integrate.api.nvidia.com/v1',
    headers: {
      Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
    },
  });


const BlogAgentStep = createStep({
    id : "blog-agent-step",
    inputSchema : z.object({
        message_user : z.string(),
        slug_blog : z.string(),
        title : z.string(),
        description : z.string()
    }),
    outputSchema : z.object({
        response_message : z.string() //Todo lo que sale aquí es AI type, dado que es el resultado de la respuesta de un modelo de AI
    }),
    execute : async ({inputData , mastra}) => {
        //Step que invoca al agente de blog, para resolver dudas del usuario vía busqueda semántica , etc.
        const agent = mastra?.getAgent("blogAgent"); // <- Se debe agregar a mastra.
        return {
            response_message : ""
        }
    }
})
