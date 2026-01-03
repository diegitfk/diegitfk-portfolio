import React from "react";
import { Code2, Cpu, Layers, Rocket, FlaskConical, Sparkles } from "lucide-react";
import { PostgreSQL, MongoDB, Docker, Kubernetes, Redis } from "@ridemountainpig/svgl-react";
import { Python, TypeScript, PnpmLight, Nodejs, ReactLight, Nextjs } from "@ridemountainpig/svgl-react";
import { Supabase } from "@ridemountainpig/svgl-react";
import { OpenAILight, Gemini, QwenLight } from "@ridemountainpig/svgl-react";
import { AmazonWebServicesLight } from "@ridemountainpig/svgl-react";
import { Media } from "@/payload-types";

// Helper type guard
export function isMedia(media: unknown): media is Media {
return media !== null && typeof media === 'object' && 'url' in media;
}

// Status badge configuration
export const statusConfig = {
production: { label: 'Production', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: Rocket },
mvp: { label: 'MVP', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Sparkles },
rnd: { label: 'R&D', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: FlaskConical },
};

// Project type badge configuration
export const typeConfig = {
backend: { label: 'Backend', icon: Cpu },
frontend: { label: 'Frontend', icon: Layers },
'full-stack': { label: 'Full Stack', icon: Code2 },
};

// Tech stack icons mapping
export const techIcons: Record<string, React.ReactNode> = {
react: <ReactLight className="w-4 h-4" />,
nextjs: <Nextjs className="w-4 h-4" />,
typescript: <TypeScript className="w-4 h-4" />,
python: <Python className="w-4 h-4" />,
node: <Nodejs className="w-4 h-4" />,
postgresql: <PostgreSQL className="w-4 h-4" />,
mongodb: <MongoDB className="w-4 h-4" />,
redis: <Redis className="w-4 h-4" />,
docker: <Docker className="w-4 h-4" />,
kubernetes: <Kubernetes className="w-4 h-4" />,
pnpm: <PnpmLight className="w-4 h-4" />,
openai: <OpenAILight className="w-4 h-4" />,
gemini: <Gemini className="w-4 h-4" />,
qwen: <QwenLight className="w-4 h-4" />,
supabase: <Supabase className="w-4 h-4" />,
aws : <AmazonWebServicesLight className="w-4 h-4" />,
};

// Format date helper
export const formatDate = (dateString: string) => {
const date = new Date(dateString);
return date.toLocaleDateString('es-ES', { 
    month: 'short', 
    year: 'numeric' 
}).replace('.', '');
};
