import { createTool } from '@mastra/core/tools';
import z from "zod"

export const thinkTool = createTool({
    id : "thinkingTool",
    description : "Herramienta para reflexionar sobre la pregunta del usuario",
    inputSchema : z.object({
        thought : z.string().describe("Pensamiento reflexivo para responder una pregunta del usuario"),
    }),
    outputSchema : z.object({
        thought : z.string().describe("Pensamiento reflexivo para responder una pregunta del usuario"),
    }),
    execute : async (input) => {
        const {thought} = input;
        console.log(thought)
        return {
            thought
        }
    }
})