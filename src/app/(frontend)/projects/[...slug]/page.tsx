import { getProjectBySlug } from "@/actions/get-project";
import { RichTextRender } from "@/components/RichTextRender";
import { Media, Post } from "@/payload-types";
import { Metadata } from 'next';
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github, ExternalLink, Lock, ArrowLeft, Rocket, FlaskConical, Sparkles, Cpu, Layers, Code2, BookOpen, Lightbulb, Wrench } from "lucide-react";
import { PostgreSQL , MongoDB , Docker , Kubernetes , Redis , Nginx, OpenAIDark } from "@ridemountainpig/svgl-react";
import { Python , TypeScript , PnpmLight , Nodejs , ReactLight , Nextjs } from "@ridemountainpig/svgl-react";
import { PayloadCMSDark , Strapi } from "@ridemountainpig/svgl-react";
import { Gemini, QwenLight } from "@ridemountainpig/svgl-react";
import { Supabase, AmazonWebServicesLight } from "@ridemountainpig/svgl-react";
// Helper to check if field is a Media object
function isMedia(media: unknown): media is Media {
  return media !== null && typeof media === 'object' && 'url' in media;
}

// Helper to check if field is a Post object
function isPost(post: unknown): post is Post {
  return post !== null && typeof post === 'object' && 'title' in post && 'slug' in post;
}

// Status badge configuration
const statusConfig = {
  production: { label: 'Production', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: Rocket },
  mvp: { label: 'MVP', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Sparkles },
  rnd: { label: 'R&D', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: FlaskConical },
};

// Project type configuration
const typeConfig = {
  backend: { label: 'Backend', icon: Cpu },
  frontend: { label: 'Frontend', icon: Layers },
  'full-stack': { label: 'Full Stack', icon: Code2 },
};

// Tech stack icons mapping
const techIcons: Record<string, React.ReactNode> = {
  react: <ReactLight className="w-5 h-5" />,
  nextjs: <Nextjs className="w-5 h-5" />,
  typescript: <TypeScript className="w-5 h-5" />,
  python: <Python className="w-5 h-5" />,
  node: <Nodejs className="w-5 h-5" />,
  postgresql: <PostgreSQL className="w-5 h-5" />,
  mongodb: <MongoDB className="w-5 h-5" />,
  redis: <Redis className="w-5 h-5" />,
  docker: <Docker className="w-5 h-5" />,
  kubernetes: <Kubernetes className="w-5 h-5" />,
  pnpm: <PnpmLight className="w-5 h-5" />,
  openai: <OpenAIDark className="w-5 h-5" />,
  gemini: <Gemini className="w-5 h-5" />,
  qwen: <QwenLight className="w-5 h-5" />,
  supabase: <Supabase className="w-5 h-5" />,
  aws: <AmazonWebServicesLight className="w-5 h-5" />,
  nginx: <Nginx className="w-5 h-5" />,
  payloadcms: <PayloadCMSDark className="w-5 h-5" />,
  strapi: <Strapi className="w-5 h-5" />,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  const { slug } = await params;
  const slugString = slug.join('/');
  
  const projectData = await getProjectBySlug(slugString, 1);

  if (!projectData) {
    return { title: 'Proyecto no encontrado' };
  }

  return {
    title: `${projectData.name} | Case Study`,
    description: projectData.description || `Explora el case study de ${projectData.name}.`,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const slugString = slug.join('/');

  const projectData = await getProjectBySlug(slugString, 3);

  if (!projectData) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Proyecto no encontrado</h1>
          <Link href="/projects" className="text-gray-400 hover:text-white transition-colors">
            ← Volver a proyectos
          </Link>
        </div>
      </div>
    );
  }

  // Extract image URL
  const imageRepo = projectData.image_repo;
  const hasImage = isMedia(imageRepo);
  const imageUrl = hasImage && imageRepo.url
    ? (process.env.NEXT_PUBLIC_PAYLOAD_URL 
        ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${imageRepo.url}` 
        : imageRepo.url)
    : null;

  // Get status and type config
  const status = statusConfig[(projectData.project_status as keyof typeof statusConfig) || 'production'];
  const type = typeConfig[(projectData.project_type as keyof typeof typeConfig) || 'backend'];
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;

  // Get related posts
  const relatedPosts = (projectData.related_posts || []).filter(isPost);

  return (
    <section className="min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Hero Section - Full Screen */}
      <header className="relative w-full min-h-screen flex items-center overflow-hidden">
        {/* Background Image */}
        {hasImage && imageUrl && (
          <div className="absolute inset-0 z-0">
            <Image
              src={imageUrl}
              alt={projectData.name}
              fill
              className="object-cover"
              priority
            />
            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/40" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          </div>
        )}

        {/* Back Button */}
        <Link 
          href="/projects"
          className="absolute top-24 left-6 lg:left-12 z-20 inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors rounded-full border border-white/10 hover:border-white/20 backdrop-blur-sm bg-black/30"
        >
          <ArrowLeft size={16} />
          Volver a proyectos
        </Link>

        {/* Hero Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-12 relative z-10 w-full pt-32">
          <div className="max-w-4xl">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <span className={cn(
                "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full border",
                status.color
              )}>
                <StatusIcon size={14} />
                {status.label}
              </span>
              <span className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-medium rounded-full border border-white/20 bg-white/5 text-gray-300">
                <TypeIcon size={14} />
                {type.label}
              </span>
            </div>

            {/* Project Title */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              {projectData.name}
            </h1>
            
            {/* Description */}
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
              {projectData.description}
            </p>

            {/* Tech Stack */}
            {projectData.tech_stack && projectData.tech_stack.length > 0 && (
              <div className="flex flex-wrap items-center gap-3 mb-10">
                {projectData.tech_stack.map((tech, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl bg-white/5 border border-white/10 text-gray-300"
                  >
                    {techIcons[tech] || <span className="text-lg">🔧</span>}
                    {tech}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              {projectData.link_github ? (
                <a
                  href={projectData.link_github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  <Github size={18} />
                  View Repository
                </a>
              ) : (
                <span className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 text-gray-400 rounded-lg font-medium cursor-not-allowed">
                  <Lock size={18} />
                  Private Repository
                </span>
              )}
              
              {projectData.link_live_demo && (
                <a
                  href={projectData.link_live_demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white rounded-lg font-medium hover:bg-white/5 transition-colors"
                >
                  <ExternalLink size={18} />
                  Live Demo
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
          <div className="flex flex-col items-center gap-2 text-gray-500">
            <span className="text-xs uppercase tracking-wider">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-gray-500 to-transparent" />
          </div>
        </div>
      </header>

      {/* Challenge & Solution Section */}
      {(projectData.challenge || projectData.solution) && (
        <div className="py-20 px-4 sm:px-6 lg:px-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-12 text-center">
              The Challenge & Solution
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-stretch">
              {/* Challenge Column */}
              {projectData.challenge && (
                <div className="p-8 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl flex flex-col h-full max-h-[400px]">
                  <div className="flex items-center gap-3 mb-6 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                      <Lightbulb className="w-6 h-6 text-red-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">El Desafío</h3>
                  </div>
                  <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
                    <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                      {projectData.challenge}
                    </p>
                  </div>
                </div>
              )}

              {/* Solution Column */}
              {projectData.solution && (
                <div className="p-8 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl flex flex-col h-full max-h-[400px]">
                  <div className="flex items-center gap-3 mb-6 shrink-0">
                    <div className="w-12 h-12 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                      <Wrench className="w-6 h-6 text-green-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white">La Solución</h3>
                  </div>
                  <div className="overflow-y-auto pr-2 custom-scrollbar flex-grow">
                    <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                      {projectData.solution}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Rich Text Content */}
      {projectData.richText && (
        <div className="py-20 px-4 sm:px-6 lg:px-12 border-t border-white/10">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-invert prose-lg max-w-none">
              <RichTextRender content={projectData.richText} />
            </article>
          </div>
        </div>
      )}

      {/* Related Blog Posts - Deep Dives Section */}
      {relatedPosts.length > 0 && (
        <div className="py-20 px-4 sm:px-6 lg:px-12 border-t border-white/10">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">Deep Dives Relacionados</h2>
                <p className="text-gray-400 text-sm mt-1">Lecciones aprendidas y artículos técnicos</p>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((post) => {
                const previewImage = post['preview-image'];
                const postHasImage = isMedia(previewImage);
                const postImageUrl = postHasImage && previewImage.url
                  ? (process.env.NEXT_PUBLIC_PAYLOAD_URL 
                      ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${previewImage.url}` 
                      : previewImage.url)
                  : null;

                return (
                  <Link 
                    href={`/blog/${post.slug}`} 
                    key={post.id}
                    className="group relative overflow-hidden rounded-2xl border border-white/10 backdrop-blur-xl transition-all duration-300 ease-out hover:border-white/30 hover:-translate-y-1 hover:shadow-2xl hover:shadow-white/5 bg-zinc-900/60"
                  >
                    {/* Background Image */}
                    {postHasImage && postImageUrl && (
                      <div className="aspect-video relative">
                        <Image
                          src={postImageUrl}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-bold text-lg text-white mb-2 leading-tight group-hover:text-gray-200 transition-colors line-clamp-2">
                        {post.title}
                      </h3>
                      
                      {post.description && (
                        <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                          {post.description}
                        </p>
                      )}
                      
                      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/60 opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
                        <span>Leer artículo</span>
                        <span>→</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="py-12 px-4 sm:px-6 lg:px-12 border-t border-white/10">
        <div className="max-w-7xl mx-auto flex justify-center">
          <Link 
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 text-gray-400 hover:text-white transition-colors rounded-full border border-white/10 hover:border-white/20"
          >
            <ArrowLeft size={18} />
            Ver todos los proyectos
          </Link>
        </div>
      </div>
    </section>
  );
}