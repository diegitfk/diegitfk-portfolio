"use client";

import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { useCallback, useEffect, useState, useRef } from "react";

const reasoningSteps = [
  "Pienso en cada capa del sistema: Backend, Frontend y agentes de IA. Mis herramientas esenciales son Python, JavaScript y TypeScript.",,
  "He construido backends ágiles con FastAPI, Hono y Elysia. En la superficie, React y Next.js para experiencias fluidas.",
  "Aplico LangChain y Agno para crear software agentico. en los datos tengo experiencia sólida con PostgreSQL, MySQL, Oracle y Supabase.",
].join("\n\n");

interface ReasoningSectionProps {
  isStreaming: boolean;
  setIsStreaming: (isStreaming: boolean) => void;
}

const ReasoningSection = ({ isStreaming, setIsStreaming }: ReasoningSectionProps) => {
  const [content, setContent] = useState("");
  // Removed local isStreaming state
  const [currentTokenIndex, setCurrentTokenIndex] = useState(0);
  const [tokens, setTokens] = useState<string[]>([]);

  // Function to chunk text into fake tokens of 3-4 characters
  const chunkIntoTokens = useCallback((text: string): string[] => {
    const tokens: string[] = [];
    let i = 0;
    while (i < text.length) {
      const chunkSize = Math.floor(Math.random() * 2) + 3; // Random size between 3-4
      tokens.push(text.slice(i, i + chunkSize));
      i += chunkSize;
    }
    return tokens;
  }, []);

  useEffect(() => {
    const tokenizedSteps = chunkIntoTokens(reasoningSteps);
    setTokens(tokenizedSteps);
    setContent("");
    setCurrentTokenIndex(0);
    setIsStreaming(true);
  }, [chunkIntoTokens, setIsStreaming]);

  useEffect(() => {
    // Prevent premature completion if tokens haven't been generated yet
    if (tokens.length === 0) return;

    if (!isStreaming || currentTokenIndex >= tokens.length) {
      if (isStreaming) {
        setIsStreaming(false);
      }
      return;
    }

    const timer = setTimeout(() => {
      setContent((prev) => prev + tokens[currentTokenIndex]);
      setCurrentTokenIndex((prev) => prev + 1);
    }, 25); // Faster interval since we're streaming smaller chunks

    return () => clearTimeout(timer);
  }, [isStreaming, currentTokenIndex, tokens, setIsStreaming]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <Reasoning className="w-full mt-4" isStreaming={isStreaming}>
      <ReasoningTrigger className="text-zinc-400 hover:text-zinc-100" />
      <ReasoningContent ref={scrollRef} className="max-h-[70px] overflow-y-auto pr-2 text-zinc-300 custom-scrollbar">
        {content}
      </ReasoningContent>
    </Reasoning>
  );
};

export default ReasoningSection;
