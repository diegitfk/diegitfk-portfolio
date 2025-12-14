import { createTool } from "@mastra/core";
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
    execute : async (ctx) => {
        const {thought} = ctx.context;
        console.log(thought)
        return {
            thought
        }
    }
})