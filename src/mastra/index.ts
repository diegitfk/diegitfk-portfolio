import { Mastra } from '@mastra/core';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { WebPageAgent } from '@/mastra/agents/web-page-agent';

export const mastra = new Mastra({
  agents: { WebPageAgent },
  storage: new LibSQLStore({
    id: 'libsql-storage',
    url: ":memory:",
  }),
  logger: new PinoLogger({
    name: 'Mastra',
    level: 'info',
  }),
});
