"use client";

import { motion, useInView } from "framer-motion";
import { Bot, ThumbsUp, ThumbsDown, Copy, MoreHorizontal } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Reasoning, ReasoningTrigger, ReasoningContent } from "@/components/ai-elements/reasoning";
import { Loader } from "@/components/ai-elements/loader";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  reasoning?: string;
  thinkTime?: number;
  workTime?: number;
}

interface StreamingMessage extends ChatMessage {
  displayedContent: string;
  displayedReasoning: string;
  isComplete: boolean;
}

const demoConversation: ChatMessage[] = [
  {
    id: "1",
    role: "user",
    content: "Hola, necesito ayuda para mejorar mis técnicas de venta. ¿Cómo puedo cerrar más tratos con clientes indecisos?",
  },
  {
    id: "2",
    role: "assistant",
    content: "Para cerrar tratos con clientes indecisos, te recomiendo usar la técnica del 'cierre por alternativa': en lugar de preguntar si quieren comprar, ofrece dos opciones. Por ejemplo: '¿Prefiere el plan mensual o anual?'",
    reasoning: "Analizando técnicas de cierre de ventas efectivas para clientes indecisos...",
    thinkTime: 3,
    workTime: 5,
  },
  {
    id: "3",
    role: "user",
    content: "Interesante. ¿Y qué hago si el cliente dice que necesita pensarlo?",
  },
  {
    id: "4",
    role: "assistant",
    content: "Cuando un cliente dice 'necesito pensarlo', pregunta: '¿Qué aspecto específico le gustaría considerar?' Esto te ayuda a identificar objeciones ocultas y abordarlas directamente.",
    reasoning: "Evaluando estrategias para manejar la objeción 'necesito pensarlo'...",
    thinkTime: 2,
    workTime: 4,
  },
  {
    id: "5",
    role: "user",
    content: "¿Cómo puedo generar urgencia sin parecer agresivo?",
  },
  {
    id: "6",
    role: "assistant",
    content: "Crea urgencia genuina mencionando beneficios limitados en el tiempo: 'Este precio especial está disponible hasta el viernes' o destaca el costo de la inacción: 'Cada día sin esta solución representa X en pérdidas potenciales'.",
    reasoning: "Considerando técnicas de urgencia ética en ventas...",
    thinkTime: 3,
    workTime: 6,
  },
];

export function AIChatPreview() {
  const [visibleMessages, setVisibleMessages] = useState<StreamingMessage[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: false, amount: 0.3 });
  const wasInViewRef = useRef(false);

  // Reset conversation when entering viewport
  useEffect(() => {
    if (isInView && !wasInViewRef.current) {
      // Entering viewport - restart conversation
      setVisibleMessages([]);
      setCurrentIndex(0);
      setIsTyping(false);
      setStreamingMessageId(null);
    }
    wasInViewRef.current = isInView;
  }, [isInView]);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  }, [visibleMessages, isTyping]);

  // Streaming effect for assistant messages
  useEffect(() => {
    if (!streamingMessageId || !isInView) return;

    const messageIndex = visibleMessages.findIndex(m => m.id === streamingMessageId);
    if (messageIndex === -1) return;

    const message = visibleMessages[messageIndex];
    if (message.isComplete) {
      setStreamingMessageId(null);
      return;
    }

    const fullContent = demoConversation.find(m => m.id === message.id)?.content || "";
    const fullReasoning = demoConversation.find(m => m.id === message.id)?.reasoning || "";

    // Stream reasoning first, then content
    const isReasoningComplete = message.displayedReasoning.length >= fullReasoning.length;
    
    if (!isReasoningComplete && fullReasoning) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => prev.map(m => 
          m.id === streamingMessageId 
            ? { ...m, displayedReasoning: fullReasoning.slice(0, m.displayedReasoning.length + 3) }
            : m
        ));
      }, 20);
      return () => clearTimeout(timer);
    }

    if (message.displayedContent.length < fullContent.length) {
      const timer = setTimeout(() => {
        setVisibleMessages(prev => prev.map(m => 
          m.id === streamingMessageId 
            ? { ...m, displayedContent: fullContent.slice(0, m.displayedContent.length + 2) }
            : m
        ));
      }, 15);
      return () => clearTimeout(timer);
    }

    // Mark as complete
    setVisibleMessages(prev => prev.map(m => 
      m.id === streamingMessageId ? { ...m, isComplete: true } : m
    ));
  }, [streamingMessageId, visibleMessages, isInView]);

  // Main conversation flow - only runs when in view
  useEffect(() => {
    if (!isInView) return;

    if (currentIndex >= demoConversation.length) {
      const resetTimer = setTimeout(() => {
        setVisibleMessages([]);
        setCurrentIndex(0);
      }, 4000);
      return () => clearTimeout(resetTimer);
    }

    const message = demoConversation[currentIndex];
    
    if (message.role === "assistant") {
      setIsTyping(true);
      const typingTimer = setTimeout(() => {
        setIsTyping(false);
        const newMessage: StreamingMessage = {
          ...message,
          displayedContent: "",
          displayedReasoning: "",
          isComplete: false
        };
        setVisibleMessages(prev => [...prev, newMessage]);
        setStreamingMessageId(message.id);
        setCurrentIndex(prev => prev + 1);
      }, 1000);
      return () => clearTimeout(typingTimer);
    } else {
      const timer = setTimeout(() => {
        const newMessage: StreamingMessage = {
          ...message,
          displayedContent: message.content,
          displayedReasoning: message.reasoning || "",
          isComplete: true
        };
        setVisibleMessages(prev => [...prev, newMessage]);
        setCurrentIndex(prev => prev + 1);
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [currentIndex, isInView]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[400px] sm:h-[450px] md:h-[500px] flex items-center justify-center"
      style={{ perspective: "1500px", perspectiveOrigin: "center center" }}
    >
      {/* Chat container with 3D perspective - Linear style */}
      <motion.div
        className="relative w-[320px] sm:w-[400px] md:w-[500px] lg:w-[550px] h-[300px] sm:h-[340px] md:h-[400px]"
        initial={{ 
          opacity: 0, 
          y: 50,
          rotateX: 0,
          rotateY: 0,
          rotateZ: 0
        }}
        animate={{ 
          opacity: 1, 
          y: 0,
          rotateX: 20,
          rotateY: -30,
          rotateZ: 10
        }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Main chat window - v0/Claude style */}
        <div className="absolute inset-0 bg-black rounded-xl border border-white/10 overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)]">
          {/* Messages container */}
          <div 
            ref={messagesContainerRef}
            className="flex flex-col gap-6 p-4 sm:p-5 h-full overflow-y-auto scroll-smooth custom-scrollbar"
          >
            {visibleMessages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="w-full"
              >
                {message.role === "user" ? (
                  /* User message - card style with orange dot */
                  <div className="relative bg-zinc-900/80 rounded-lg border border-zinc-700/50 p-3 sm:p-4">
                    {/* Orange indicator dot */}
                    <div className="absolute top-3 right-3 w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <p className="text-[10px] sm:text-xs text-gray-200 leading-relaxed pr-6 whitespace-pre-line">
                      {message.displayedContent}
                    </p>
                  </div>
                ) : (
                  /* Assistant message - clean text style */
                  <div className="space-y-3">
                    {/* Thought indicator */}
                    {message.displayedReasoning && (
                      <Reasoning 
                        isStreaming={!message.isComplete && message.displayedContent.length === 0} 
                        defaultOpen={!message.isComplete}
                        className="not-prose"
                      >
                        <ReasoningTrigger className="text-[10px] sm:text-xs text-gray-500 gap-1.5 [&>svg]:w-3.5 [&>svg]:h-3.5">
                          <Bot size={14} className="text-gray-500" />
                          <span>Thought for {message.thinkTime || 4}s</span>
                        </ReasoningTrigger>
                        <ReasoningContent className="text-[10px] sm:text-xs text-gray-500 mt-2 pl-5 border-l border-zinc-700">
                          {message.displayedReasoning}
                        </ReasoningContent>
                      </Reasoning>
                    )}
                    
                    {/* Main response */}
                    <p className="text-[10px] sm:text-xs text-gray-300 leading-relaxed">
                      {message.displayedContent}
                      {!message.isComplete && message.displayedContent.length > 0 && (
                        <span className="inline-block w-0.5 h-3 bg-gray-400 ml-0.5 animate-pulse" />
                      )}
                    </p>

                    {/* Work time and actions - only show when complete */}
                    {message.isComplete && (
                      <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-1.5 text-[9px] sm:text-[10px] text-gray-600">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                          <span>Worked for {message.workTime || 10}s</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
                            <ThumbsUp size={12} className="text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
                            <ThumbsDown size={12} className="text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
                            <Copy size={12} className="text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-zinc-800 rounded transition-colors">
                            <MoreHorizontal size={12} className="text-gray-600" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ))}

            {/* Typing/Loading indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-gray-500"
              >
                <Bot size={14} />
                <Loader className="scale-75" />
              </motion.div>
            )}
          </div>
        </div>

        {/* Glow effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-white/20 via-gray-400/10 to-white/20 blur-[80px] -z-10"
          style={{ transform: "translateZ(-80px) scale(1.3)" }}
        />

        {/* Reflection/shadow underneath */}
        <div
          className="absolute -bottom-4 left-4 right-4 h-20 bg-gradient-to-t from-black/80 to-transparent blur-xl -z-10"
          style={{ transform: "translateZ(-100px) rotateX(60deg)" }}
        />
      </motion.div>

      {/* Ambient light effect on the left side - external */}
      <div
        className="absolute left-0 top-1/4 bottom-1/4 w-1/3 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(ellipse at left, rgba(255,255,255,0.15) 0%, transparent 70%)",
        }}
      />
    </div>
  );
}
