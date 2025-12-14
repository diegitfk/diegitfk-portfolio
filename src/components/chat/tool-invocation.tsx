"use client";

import { motion } from "motion/react";
import {
  FolderKanban,
  FileText,
  BookOpen,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProjectUITools } from "@/mastra/tools/projects_toolkit";

type ToolState = "call" | "input-streaming" | "result" | "error";

// Tipos específicos para cada tool
type ProjectListInput = ProjectUITools["projectListTool"]["input"];
type ProjectListOutput = ProjectUITools["projectListTool"]["output"];
type ProjectInfoInput = ProjectUITools["projectInfoTool"]["input"];
type ProjectInfoOutput = ProjectUITools["projectInfoTool"]["output"];
type ProjectKnowledgeInput = ProjectUITools["projectKnowledgeTool"]["input"];
type ProjectKnowledgeOutput = ProjectUITools["projectKnowledgeTool"]["output"];

interface ToolInvocationProps {
  toolName: string;
  state: ToolState;
  input?: ProjectListInput | ProjectInfoInput | ProjectKnowledgeInput;
  output?: ProjectListOutput | ProjectInfoOutput | ProjectKnowledgeOutput;
}

const TOOL_CONFIG: Record<
  string,
  {
    icon: React.ElementType;
    label: string;
    color: string;
    bgColor: string;
  }
> = {
  projectListTool: {
    icon: FolderKanban,
    label: "Buscando proyectos",
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
  },
  projectInfoTool: {
    icon: FileText,
    label: "Obteniendo detalles del proyecto",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
  },
  projectKnowledgeTool: {
    icon: BookOpen,
    label: "Leyendo documentación",
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
  },
};

const DEFAULT_TOOL_CONFIG = {
  icon: FileText,
  label: "Ejecutando herramienta",
  color: "text-gray-400",
  bgColor: "bg-gray-500/10",
};

export function ToolInvocation({
  toolName,
  state,
  input,
  output,
}: ToolInvocationProps) {
  const config = TOOL_CONFIG[toolName] || DEFAULT_TOOL_CONFIG;
  const Icon = config.icon;

  const isLoading = state === "call" || state === "input-streaming";
  const isComplete = state === "result";
  const isError = state === "error";

  const getStatusLabel = () => {
    if (isLoading) return config.label;
    if (isComplete) return "Completado";
    if (isError) return "Error";
    return config.label;
  };

  // Type guards para los outputs
  const isProjectListOutput = (o: unknown): o is ProjectListOutput => {
    return typeof o === "object" && o !== null && "projects" in o;
  };

  const isProjectInfoOutput = (o: unknown): o is ProjectInfoOutput => {
    return typeof o === "object" && o !== null && "nameProject" in o && "knowledge_project" in o;
  };

  const isProjectKnowledgeOutput = (o: unknown): o is ProjectKnowledgeOutput => {
    return typeof o === "object" && o !== null && "contentFile" in o;
  };

  const renderOutput = () => {
    if (!output || !isComplete) return null;

    if (toolName === "projectListTool" && isProjectListOutput(output)) {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 space-y-2"
        >
          {output.projects.map((project) => (
            <div
              key={project.idProject}
              className="p-2 rounded-lg bg-gray-800/50 border border-gray-700/50"
            >
              <div className="flex items-center gap-2">
                <FolderKanban className="size-3.5 text-blue-400" />
                <span className="text-sm font-medium text-white">
                  {project.nameProject}
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                {project.descriptionProject}
              </p>
              <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-300">
                {project.project_type}
              </span>
            </div>
          ))}
        </motion.div>
      );
    }

    if (toolName === "projectInfoTool" && isProjectInfoOutput(output)) {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50"
        >
          <div className="flex items-center gap-2">
            <FileText className="size-3.5 text-emerald-400" />
            <span className="text-sm font-medium text-white">
              {output.nameProject}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">
            {output.descriptionProject}
          </p>
          {output.knowledge_project && output.knowledge_project.length > 0 && (
            <div className="mt-2 pt-2 border-t border-gray-700/50">
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Archivos de conocimiento
              </span>
              <div className="mt-1 flex flex-wrap gap-1">
                {output.knowledge_project.map((file, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300"
                  >
                    {file.nameFile}
                  </span>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      );
    }

    if (toolName === "projectKnowledgeTool" && isProjectKnowledgeOutput(output)) {
      return (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-2 p-2 rounded-lg bg-gray-800/50 border border-gray-700/50"
        >
          <div className="flex items-center gap-2 mb-1">
            <BookOpen className="size-3.5 text-purple-400" />
            <span className="text-xs text-gray-400">Documento cargado</span>
          </div>
          <p className="text-[10px] text-gray-500 line-clamp-3 font-mono">
            {String(output.contentFile).slice(0, 200)}...
          </p>
        </motion.div>
      );
    }

    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-lg p-2.5 border border-gray-700/30",
        config.bgColor
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "size-6 rounded-md flex items-center justify-center",
            isComplete ? "bg-emerald-500/20" : isError ? "bg-red-500/20" : "bg-gray-700/50"
          )}
        >
          {isLoading ? (
            <Loader2 className={cn("size-3.5 animate-spin", config.color)} />
          ) : isComplete ? (
            <CheckCircle2 className="size-3.5 text-emerald-400" />
          ) : isError ? (
            <AlertCircle className="size-3.5 text-red-400" />
          ) : (
            <Icon className={cn("size-3.5", config.color)} />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-300">
              {getStatusLabel()}
            </span>
            {isLoading && (
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="text-[10px] text-gray-500"
              >
                •••
              </motion.span>
            )}
          </div>
          {input && Object.keys(input).length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {Object.entries(input).map(([key, value]) => (
                <span
                  key={key}
                  className="text-[10px] px-1.5 py-0.5 rounded bg-gray-700/50 text-gray-400"
                >
                  {key}: {String(value)}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {renderOutput()}
    </motion.div>
  );
}
