"use client";

import { useState, memo, useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import type { UIMessage } from "ai";
import { Bot, X, MessageCircle, CheckCircle, Clock, Circle, XCircle, Wrench, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
  ConversationEmptyState,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningTrigger,
  ReasoningContent,
} from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";
import {
  PromptInput,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputTools,
  PromptInputSubmit,
} from "@/components/ai-elements/prompt-input";
import { MermaidDiagram } from "@/components/render-blocks/Mermaid";

// Componente Tool simplificado sin animaciones pesadas
type SimpleToolState = "input-streaming" | "input-available" | "output-available" | "output-error";

const SimpleToolBadge = memo(function SimpleToolBadge({ state }: { state: SimpleToolState }) {
  const config = {
    "input-streaming": { icon: Circle, label: "Pending", className: "" },
    "input-available": { icon: Clock, label: "Running", className: "animate-pulse" },
    "output-available": { icon: CheckCircle, label: "Completed", className: "text-green-600" },
    "output-error": { icon: XCircle, label: "Error", className: "text-red-600" },
  };
  const { icon: Icon, label, className } = config[state];
  return (
    <Badge className="gap-1.5 rounded-full text-xs" variant="secondary">
      <Icon className={cn("size-3", className)} />
      {label}
    </Badge>
  );
});

const SimpleToolJson = memo(function SimpleToolJson({ data }: { data: Record<string, unknown> }) {
  const jsonString = useMemo(() => JSON.stringify(data, null, 2), [data]);
  return (
    <pre className="text-xs p-2 bg-gray-800 text-gray-300 rounded overflow-x-auto max-h-32 overflow-y-auto">
      <code>{jsonString}</code>
    </pre>
  );
});

// Tipos para los parts
type PartAny = { 
  type: string; 
  id?: string; 
  delta?: string; 
  text?: string;
  toolCallId?: string;
  state?: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
};

// Función para procesar parts de un mensaje - fuera del componente para evitar recreación
function processMessageParts(parts: UIMessage["parts"]) {
  const textParts: { id: string; text: string }[] = [];
  const toolParts: { 
    toolCallId: string; 
    toolName: string; 
    type: string;
    state: string; 
    input?: Record<string, unknown>; 
    output?: Record<string, unknown>; 
  }[] = [];
  const reasoningParts: { index: number; text: string }[] = [];
  
  const textMap = new Map<string, string>();
  const toolMap = new Map<string, typeof toolParts[0]>();
  const statePriority: Record<string, number> = {
    'input-streaming': 1,
    'input-available': 2,
    'output-available': 3,
    'result': 3,
  };
  
  parts.forEach((p, index) => {
    const part = p as PartAny;
    
    if (part.type === "text-delta" && part.id && part.delta) {
      const existing = textMap.get(part.id) || "";
      textMap.set(part.id, existing + part.delta);
    } else if (part.type === "text" && part.text) {
      textParts.push({ id: `static-${index}`, text: part.text });
    } else if (part.type === "reasoning" && part.text) {
      reasoningParts.push({ index, text: part.text });
    } else if (part.type.startsWith("tool-") && part.toolCallId) {
      const existing = toolMap.get(part.toolCallId);
      const currentPriority = statePriority[part.state || ''] || 0;
      const existingPriority = statePriority[existing?.state || ''] || 0;
      
      if (!existing || currentPriority >= existingPriority) {
        toolMap.set(part.toolCallId, {
          toolCallId: part.toolCallId,
          toolName: part.type.replace("tool-", ""),
          type: part.type,
          state: part.state || 'call',
          input: part.input || existing?.input,
          output: part.output || existing?.output,
        });
      }
    }
  });
  
  // Convertir textMap a array
  textMap.forEach((text, id) => {
    textParts.unshift({ id, text });
  });
  
  // Convertir toolMap a array
  toolMap.forEach((tool) => {
    toolParts.push(tool);
  });
  
  return { textParts, toolParts, reasoningParts };
}

// Función para extraer bloques mermaid del texto
function extractMermaidBlocks(text: string): { parts: Array<{ type: 'text' | 'mermaid'; content: string }>} {
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
  const parts: Array<{ type: 'text' | 'mermaid'; content: string }> = [];
  let lastIndex = 0;
  let match;

  while ((match = mermaidRegex.exec(text)) !== null) {
    // Añadir texto antes del bloque mermaid
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index).trim();
      if (textBefore) {
        parts.push({ type: 'text', content: textBefore });
      }
    }
    // Añadir el bloque mermaid
    parts.push({ type: 'mermaid', content: match[1].trim() });
    lastIndex = match.index + match[0].length;
  }

  // Añadir texto restante después del último bloque mermaid
  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex).trim();
    if (textAfter) {
      parts.push({ type: 'text', content: textAfter });
    }
  }

  // Si no hay bloques mermaid, devolver el texto completo
  if (parts.length === 0 && text.trim()) {
    parts.push({ type: 'text', content: text.trim() });
  }

  return { parts };
}

// Componente para texto - memoizado, con soporte para mermaid
const TextPart = memo(function TextPart({ text }: { text: string }) {
  const cleanText = text.replace(/\{"name":\s*"[^"]*",\s*"arguments":\s*\{[\s\S]*?\}\}\s*_?\s*/g, '').trim();
  if (!cleanText) return null;
  
  const { parts } = extractMermaidBlocks(cleanText);
  
  return (
    <>
      {parts.map((part, index) => {
        if (part.type === 'mermaid') {
          return (
            <div key={index} className="my-4 w-full">
              <MermaidDiagram code={part.content} />
            </div>
          );
        }
        return <MessageResponse key={index} className="text-white">{part.content}</MessageResponse>;
      })}
    </>
  );
});

// Componente para reasoning - memoizado
const ReasoningPart = memo(function ReasoningPart({ 
  text, 
  isStreaming 
}: { 
  text: string; 
  isStreaming: boolean;
}) {
  return (
    <Reasoning isStreaming={isStreaming}>
      <ReasoningTrigger />
      <ReasoningContent>{text}</ReasoningContent>
    </Reasoning>
  );
});

// Componente para tools - simplificado y memoizado
const ToolPart = memo(function ToolPart({ 
  toolName,
  state,
  input,
  output,
}: { 
  toolCallId: string;
  toolName: string;
  type: string;
  state: string;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  let toolState: SimpleToolState = "input-streaming";
  if (state === "input-streaming" || state === "partial-call") {
    toolState = "input-streaming";
  } else if (state === "input-available") {
    toolState = "input-available";
  } else if (state === "output-available" || output) {
    toolState = "output-available";
  } else if (state === "error" || state === "output-error") {
    toolState = "output-error";
  }

  const hasInput = input && Object.keys(input).length > 0;
  const hasOutput = !!output;

  return (
    <div className="mb-3 w-full rounded-md border border-gray-700 bg-gray-900">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between gap-4 p-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Wrench className="size-4 text-gray-400" />
          <span className="font-medium text-sm text-white">{toolName}</span>
          <SimpleToolBadge state={toolState} />
        </div>
        <ChevronDown className={cn("size-4 text-gray-400 transition-transform", isOpen && "rotate-180")} />
      </button>
      {isOpen && (
        <div className="border-t border-gray-700">
          {hasInput && (
            <div className="p-3 space-y-1">
              <h4 className="font-medium text-gray-400 text-xs uppercase">Parameters</h4>
              <SimpleToolJson data={input} />
            </div>
          )}
          {hasOutput && (
            <div className="p-3 space-y-1 border-t border-gray-700">
              <h4 className="font-medium text-gray-400 text-xs uppercase">
                {toolState === "output-error" ? "Error" : "Result"}
              </h4>
              <SimpleToolJson data={output} />
            </div>
          )}
        </div>
      )}
    </div>
  );
});

// Componente principal para el contenido del mensaje
const ChatMessageContent = memo(function ChatMessageContent({ 
  message, 
  isLoading 
}: { 
  message: UIMessage; 
  isLoading: boolean;
}) {
  const { textParts, toolParts, reasoningParts } = processMessageParts(message.parts);
  
  return (
    <>
      {/* Tools primero - aparecen encima del texto */}
      {toolParts.map((part) => (
        <ToolPart 
          key={part.toolCallId}
          toolCallId={part.toolCallId}
          toolName={part.toolName}
          type={part.type}
          state={part.state}
          input={part.input}
          output={part.output}
        />
      ))}
      {/* Reasoning después de tools */}
      {reasoningParts.map((part) => (
        <ReasoningPart 
          key={part.index} 
          text={part.text} 
          isStreaming={isLoading && part.index === message.parts.length - 1} 
        />
      ))}
      {/* Texto al final - el streaming aparece debajo de las tools */}
      {textParts.map((part) => (
        <TextPart key={part.id} text={part.text} />
      ))}
    </>
  );
});

interface ChatBotProps {
  visible?: boolean;
}

export function ChatBot({ visible = true }: ChatBotProps) {
  const [isOpen, setIsOpen] = useState(false);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";

  if (!visible) return null;

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <button
              onClick={() => setIsOpen(true)}
              className="group relative size-14 rounded-full border border-gray-700/50 backdrop-blur-sm bg-black/80 hover:bg-black/90 transition-all duration-300 shadow-[0_0_30px_rgba(34,197,94,0.15)] hover:shadow-[0_0_40px_rgba(34,197,94,0.25)]"
            >
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-green-500 animate-pulse" />
              <MessageCircle className="size-6 text-gray-300 group-hover:text-white transition-colors mx-auto" />
              <span className="sr-only">Abrir chat</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Modal - Desktop: centered modal, Mobile: bottom panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay for desktop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm hidden md:block"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className={cn(
                "fixed z-50 flex flex-col rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-gray-700/50 bg-black/95 backdrop-blur-xl",
                // Mobile: bottom right panel
                "bottom-6 right-6 w-[380px] h-[520px]",
                // Desktop: centered modal with larger size
                "md:bottom-auto md:right-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-[600px] md:h-[700px] md:max-h-[85vh]"
              )}
            >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700/50 bg-black/80">
              <div className="flex items-center gap-3">
                <div className="relative size-10 rounded-full border border-gray-700/50 bg-black/50 flex items-center justify-center">
                  <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
                  <Bot className="size-5 text-gray-300" />
                </div>
                <div>
                  <h3 className="font-medium text-white text-sm">Diego Cancino</h3>
                  <p className="text-xs text-gray-500 font-mono">Full Stack Developer & AI Engineer</p>
                </div>
              </div>
              <button
                className="size-8 rounded-lg border border-gray-700/50 bg-black/50 text-gray-400 hover:text-white hover:bg-gray-800/50 transition-colors flex items-center justify-center"
                onClick={() => setIsOpen(false)}
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Conversation */}
            <Conversation className="flex-1 bg-black/50">
              <ConversationContent className="p-4">
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    icon={<MessageCircle className="size-8 text-gray-500" />}
                    title="¡Hola! Soy Diego"
                    description="Pregúntame sobre mi experiencia, proyectos o tecnologías que uso."
                    className="text-gray-400"
                  />
                ) : (
                  messages.map((message) => (
                    <Message key={message.id} from={message.role}>
                      <MessageContent>
                        <ChatMessageContent message={message} isLoading={isLoading} />
                      </MessageContent>
                    </Message>
                  ))
                )}

                {isLoading && messages[messages.length - 1]?.role === "user" && (
                  <Message from="assistant">
                    <MessageContent>
                      <div className="flex items-center gap-2 text-gray-400">
                        <Loader size={16} />
                        <span className="text-sm font-mono">Escribiendo...</span>
                      </div>
                    </MessageContent>
                  </Message>
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>

            {/* Input */}
            <div className="border-t border-gray-700/50 bg-black/80 p-3">
              <PromptInput
                onSubmit={({ text }) => {
                  if (text.trim()) {
                    sendMessage({ text });
                  }
                }}
                className="bg-black/50 rounded-xl border border-gray-700/50"
              >
                <PromptInputTextarea
                  placeholder="Escribe tu mensaje..."
                  className="min-h-10 max-h-24 bg-transparent border-none focus:ring-0 text-white placeholder:text-gray-500"
                />
                <PromptInputFooter>
                  <PromptInputTools />
                  <PromptInputSubmit
                    status={status}
                    onClick={isLoading ? stop : undefined}
                    className="bg-white text-black hover:bg-gray-200 border-none transition-colors"
                  />
                </PromptInputFooter>
              </PromptInput>
            </div>
          </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
