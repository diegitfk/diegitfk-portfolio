import { MCPClient } from "@mastra/mcp";

const PAYLOAD_MCP_TOKEN = process.env.PAYLOAD_MCP_TOKEN || '';
const IS_PROD = process.env.NODE_ENV === 'production';
const BASE_URL = IS_PROD 
  ? (process.env.NEXT_PUBLIC_URL_DOMAIN || "http://localhost:3000")
  : "http://localhost:3000";

const MCP_URL = `${BASE_URL}/api/mcp`;

export const PortfolioMCPs = new MCPClient({
      id: "portfolio-mcps",
      timeout: 30000, // 30 second global timeout
      servers: {
        payload: {
          url: new URL(MCP_URL), 
          timeout: 30000, // 30 second server-specific timeout
          requestInit: {
            headers: {
              Authorization: `Bearer ${PAYLOAD_MCP_TOKEN}`,
            }
          }
        },
      },
  });