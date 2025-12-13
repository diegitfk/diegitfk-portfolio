
import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { blogAgent } from './agents/blog-agent';
import { chatRoute } from "@mastra/ai-sdk";
import path from 'path';

export const mastra = new Mastra({
  //workflows: {  }, <- Se deben agregar los futuros workflows definidos.
  agents: { blogAgent },
  storage: new LibSQLStore({
    // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
  telemetry: {
    // Telemetry is deprecated and will be removed in the Nov 4th release
    enabled: false, 
  },
  observability: {
    // Enables DefaultExporter and CloudExporter for AI tracing
    default: { enabled: false }, 
  },
  server : {
    apiRoutes : [
      chatRoute({
        path : "/chat",
        agent : blogAgent
      })
    ]
  }
});
