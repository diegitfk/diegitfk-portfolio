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

export const blogAgent = new Agent({
    name : "Blog Agent",
    instructions : `
     ...
    `,
    model : nim.chatModel("nvidia/llama-3.3-70b-instruct"),
})