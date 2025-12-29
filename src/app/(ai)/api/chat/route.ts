import { mastra } from "@/mastra";
import { createUIMessageStream, createUIMessageStreamResponse } from "ai";
import { toAISdkStream } from "@mastra/ai-sdk";
// Función para truncar outputs largos de las tools
function truncateToolOutput(part: Record<string, unknown>): Record<string, unknown> {
  if (!part.type || typeof part.type !== "string") return part;
  
  // Solo procesar parts de tools con output disponible
  if (part.type.startsWith("tool-") && part.state === "output-available" && part.output) {
    const output = part.output as Record<string, unknown>;
    const truncatedOutput: Record<string, unknown> = {};
    
    // Truncar según el tipo de tool
    if (part.type === "tool-projectListTool" && output.projects) {
      const projects = output.projects as Array<Record<string, unknown>>;
      truncatedOutput.projects = projects.map((p) => ({
        idProject: p.idProject,
        nameProject: p.nameProject,
        descriptionProject: typeof p.descriptionProject === "string" 
          ? p.descriptionProject.slice(0, 100) + (p.descriptionProject.length > 100 ? "..." : "")
          : p.descriptionProject,
        project_type: p.project_type,
      }));
      truncatedOutput._totalProjects = projects.length;
    } else if (part.type === "tool-projectInfoTool") {
      truncatedOutput.nameProject = output.nameProject;
      truncatedOutput.descriptionProject = typeof output.descriptionProject === "string"
        ? output.descriptionProject.slice(0, 150) + (output.descriptionProject.length > 150 ? "..." : "")
        : output.descriptionProject;
      truncatedOutput.project_type = output.project_type;
      if (output.knowledge_project && Array.isArray(output.knowledge_project)) {
        truncatedOutput.knowledge_project = (output.knowledge_project as Array<Record<string, unknown>>).map((k) => ({
          nameFile: k.nameFile,
          mimeType: k.mimeType,
        }));
        truncatedOutput._totalKnowledgeFiles = output.knowledge_project.length;
      }
    } else if (part.type === "tool-projectKnowledgeTool" && output.contentFile) {
      const content = output.contentFile as string;
      truncatedOutput.contentFile = content.slice(0, 300) + (content.length > 300 ? "..." : "");
      truncatedOutput._totalCharacters = content.length;
    } else {
      // Para otras tools, mantener el output original
      return part;
    }
    
    return { ...part, output: truncatedOutput };
  }
  
  return part;
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  const myAgent = mastra.getAgent("WebPageAgent");
  const stream = await myAgent.stream(
    messages , {
      providerOptions : {
        openai:{
          reasoningEffort : 'medium',
          reasoningSummary : 'concise',
        },
      }
    }, 
  );

  // Transform stream into AI SDK format and create UI messages stream
  const uiMessageStream = createUIMessageStream({
    execute: async ({ writer }) => {
      const aiSdkStream = toAISdkStream(stream, { from: "agent", sendReasoning : true });
      if (!aiSdkStream) {
        throw new Error("Failed to convert stream to AI SDK format");
      }
      for await (const part of (aiSdkStream as unknown as AsyncIterable<unknown>)) {
        // Truncar outputs largos de las tools
        const processedPart = truncateToolOutput(part as Record<string, unknown>);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        writer.write(processedPart as any);
      }
    },
  });
  // Create a Response that streams the UI message stream to the client
  return createUIMessageStreamResponse({
    stream: uiMessageStream,
  });
}
