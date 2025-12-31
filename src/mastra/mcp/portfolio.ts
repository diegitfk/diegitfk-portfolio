import { MCPClient } from "@mastra/mcp";

const PAYLOAD_MCP_TOKEN = process.env.PAYLOAD_MCP_TOKEN || '';

export const PortfolioMCPs = new MCPClient({
      id : "portfolio-mcps",
      servers: {
      payload : {
          url : new URL("http://localhost:3000/api/mcp"), 
          requestInit : {
              headers : {
                  Authorization: `Bearer ${PAYLOAD_MCP_TOKEN}`,
              }
          }
      },
    },
  });