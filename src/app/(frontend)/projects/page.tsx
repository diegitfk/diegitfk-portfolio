import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Project, Media } from "@/payload-types";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Metadata } from 'next';
import { Github, ExternalLink, Lock, Code2, Cpu, Layers, Rocket, FlaskConical, Sparkles } from "lucide-react";
import { PostgreSQL, MongoDB, Docker, Kubernetes, Redis } from "@ridemountainpig/svgl-react";
import { Python, TypeScript, PnpmLight, Nodejs, ReactLight, Nextjs } from "@ridemountainpig/svgl-react";
import { Supabase } from "@ridemountainpig/svgl-react";
import { OpenAILight, Gemini, QwenLight } from "@ridemountainpig/svgl-react";
import { AmazonWebServicesLight } from "@ridemountainpig/svgl-react";

export const metadata: Metadata = {
  title: 'Projects | Engineering Dashboard',
  description: 'Explora mi portafolio de proyectos: arquitecturas cloud, sistemas backend escalables, frontends modernos y agentes de IA.',
};

// Helper type guard
function isMedia(media: unknown): media is Media {
  return media !== null && typeof media === 'object' && 'url' in media;
}

// Status badge configuration
const statusConfig = {
  production: { label: 'Production', color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: Rocket },
  mvp: { label: 'MVP', color: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', icon: Sparkles },
  rnd: { label: 'R&D', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30', icon: FlaskConical },
};

// Project type badge configuration
const typeConfig = {
  backend: { label: 'Backend', icon: Cpu },
  frontend: { label: 'Frontend', icon: Layers },
  'full-stack': { label: 'Full Stack', icon: Code2 },
};

// Tech stack icons mapping
const techIcons: Record<string, React.ReactNode> = {
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
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', { 
    month: 'short', 
    year: 'numeric' 
  }).replace('.', '');
};

// Stats calculation
function calculateStats(projects: Project[]) {
  const linesOfCode = projects.length * 14000; // Estimación promedio
  const cloudArchitectures = projects.filter(p => 
    p.tech_stack?.some(t => ['aws', 'docker', 'kubernetes', 'supabase'].includes(t))
  ).length;
  const aiAgents = projects.filter(p => 
    p.tech_stack?.some(t => ['openai', 'gemini', 'qwen'].includes(t))
  ).length;
  
  return { linesOfCode, cloudArchitectures, aiAgents, totalProjects: projects.length };
}

export default async function ProjectsPage() {
  let projects: Project[] = [];
  
  try {
    const payload = await getPayload({ config: configPromise });
    const projectsData = await payload.find({
      collection: 'projects',
      limit: 100,
      depth: 2,
      sort: '-createdAt',
      where: {
        _status: {
          equals: "published"
        }
      }
    });
    projects = projectsData.docs;
  } catch (error) {
    console.error("Error fetching projects:", error);
  }

  const stats = calculateStats(projects);

  // Separate featured and regular projects
  const featuredProjects = projects.filter(p => p.is_featured);
  const regularProjects = projects.filter(p => !p.is_featured);
  
  // Interleave featured projects for bento effect
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return 0;
  });

  return (
    <section className="min-h-screen w-full bg-black text-white overflow-hidden">
      {/* Content */}
      <div className="pt-32 pb-20 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          
          {/* Header Section */}
          <div className="mb-12">
            <p className="text-sm font-medium text-gray-400 mb-4 tracking-wide uppercase">
              Engineering Dashboard
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              Proyectos
              <br />
              <span className="text-gray-400">&</span>
              <br />
              Arquitecturas
            </h1>
            <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">
              Explora mi portafolio de ingeniería: desde sistemas backend escalables 
              hasta frontends modernos y agentes de inteligencia artificial.
            </p>
          </div>

          {/* Stats Banner */}
          <div className="mb-12 p-6 rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-bold text-white">{(stats.linesOfCode / 1000).toFixed(0)}k+</p>
                <p className="text-sm text-gray-400 mt-1">Líneas de código</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-bold text-white">{stats.totalProjects}</p>
                <p className="text-sm text-gray-400 mt-1">Proyectos desplegados</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-bold text-white">{stats.cloudArchitectures || 3}+</p>
                <p className="text-sm text-gray-400 mt-1">Arquitecturas cloud</p>
              </div>
              <div className="text-center md:text-left">
                <p className="text-3xl md:text-4xl font-bold text-white">{stats.aiAgents || 2}+</p>
                <p className="text-sm text-gray-400 mt-1">Agentes IA activos</p>
              </div>
            </div>
          </div>

          {/* Filter Badges */}
          <div className="flex flex-wrap gap-3 mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full border border-white/20 bg-white/5 text-white">
              Todos
            </span>
            {Object.entries(statusConfig).map(([key, config]) => {
              const Icon = config.icon;
              return (
                <span 
                  key={key}
                  className={cn(
                    "inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full border cursor-pointer hover:opacity-80 transition-opacity",
                    config.color
                  )}
                >
                  <Icon size={14} />
                  {config.label}
                </span>
              );
            })}
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[300px] grid-flow-dense">
            {sortedProjects.map((project, index) => {
              const imageRepo = project.image_repo;
              const previewVideo = project.preview_video;
              const hasImage = isMedia(imageRepo);
              const hasVideo = isMedia(previewVideo);
              
              const imageUrl = hasImage && imageRepo.url
                ? (process.env.NEXT_PUBLIC_PAYLOAD_URL 
                    ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${imageRepo.url}` 
                    : imageRepo.url)
                : null;
              
              const videoUrl = hasVideo && previewVideo.url
                ? (process.env.NEXT_PUBLIC_PAYLOAD_URL 
                    ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${previewVideo.url}` 
                    : previewVideo.url)
                : null;

              const isFeatured = project.is_featured;
              const status = statusConfig[project.project_status as keyof typeof statusConfig] || statusConfig.production;
              const type = typeConfig[project.project_type as keyof typeof typeConfig] || typeConfig.backend;
              const StatusIcon = status.icon;
              const TypeIcon = type.icon;

              // Dynamic spanning logic for Bento effect
              const spanClasses = isFeatured 
                ? (index % 3 === 0 
                  ? "md:col-span-2 md:row-span-2" // Large square
                  : "md:col-span-2 md:row-span-1") // Wide rectangle
                : "col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 row-span-1"; // Wide on larger screens

              return (
                <div 
                  key={project.id}
                  className={cn(
                    "group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md transition-all duration-500 ease-out",
                    "hover:border-white/20 hover:shadow-[0_0_40px_-15px_rgba(255,255,255,0.1)] hover:-translate-y-1",
                    spanClasses,
                    "min-h-[300px] md:min-h-0" // Ensure a minimum height on mobile
                  )}
                >
                  {/* Main Project Link Overlay (Covers the whole card except buttons) */}
                  <Link 
                    href={`/projects/${project.slug}`}
                    className="absolute inset-0 z-10"
                    aria-label={`Ver detalles de ${project.name}`}
                  />

                  {/* Background Image/Video with Overlay */}
                  {(hasImage || hasVideo) && (
                    <div className="absolute inset-0 z-0">
                      {/* Static Image */}
                      {hasImage && imageUrl && (
                        <Image
                          src={imageUrl}
                          alt={project.name}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 70vw, 50vw"
                          quality={100}
                          className={cn(
                            "object-cover transition-all duration-700",
                            hasVideo ? "group-hover:opacity-0" : "group-hover:scale-110 opacity-50 group-hover:opacity-70"
                          )}
                        />
                      )}
                      
                      {/* Video on Hover */}
                      {hasVideo && videoUrl && (
                        <video
                          src={videoUrl}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                        />
                      )}
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent z-10" />
                    </div>
                  )}

                  {/* Glass Header (Status & Date) */}
                  <div className="absolute top-0 left-0 right-0 z-20 p-4 sm:p-5 flex items-center justify-between pointer-events-none overflow-hidden">
                    <div className="flex items-center gap-2 min-w-0">
                       <span className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full border backdrop-blur-md shrink-0",
                        status.color
                      )}>
                        <StatusIcon size={10} />
                        {status.label}
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider rounded-full border border-white/10 bg-black/40 text-gray-400 backdrop-blur-md shrink-0">
                        <TypeIcon size={10} />
                        {type.label}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-white/40 tracking-widest hidden sm:block shrink-0">
                      {formatDate(project.createdAt)}
                    </span>
                  </div>

                  {/* Content Container */}
                  <div className="relative z-20 h-full flex flex-col justify-end p-5 sm:p-6 md:p-8 pointer-events-none overflow-hidden">
                    {/* Text Content Block */}
                    <div className="space-y-2 md:space-y-2.5 min-w-0 transition-all duration-500 ease-out md:translate-y-10 md:group-hover:translate-y-0 relative z-10">
                      <h2 className={cn(
                        "font-bold text-white transition-all duration-300 truncate",
                        isFeatured ? "text-xl sm:text-2xl md:text-3xl leading-tight" : "text-lg sm:text-xl leading-snug"
                      )}>
                        {project.name}
                      </h2>
                      
                      <p className={cn(
                        "text-gray-400 leading-relaxed transition-all duration-300",
                        isFeatured ? "line-clamp-2 md:line-clamp-3 text-xs sm:text-sm max-w-xl" : "line-clamp-2 text-[11px] sm:text-xs"
                      )}>
                        {project.description}
                      </p>
                    </div>
                    
                    {/* Action Links & Tech Stack Footer */}
                    <div className="mt-4 sm:mt-5 pt-4 sm:pt-4 border-t border-white/5 flex flex-col gap-3.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-500 ease-out md:translate-y-4 md:group-hover:translate-y-0 pointer-events-auto relative z-0">
                      
                      {/* Integrated Footer Row */}
                      <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
                        {/* Tech Stack */}
                        {project.tech_stack && project.tech_stack.length > 0 && (
                          <div className="flex items-center gap-1.5 min-w-0 mr-2">
                            {project.tech_stack.slice(0, isFeatured ? 6 : 3).map((tech, techIndex) => (
                              <div 
                                key={techIndex}
                                className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-xs opacity-70 group-hover:opacity-100 transition-all duration-300 shrink-0"
                                title={tech}
                              >
                                {techIcons[tech] ? (
                                  <div className="scale-[0.7]">{techIcons[tech]}</div>
                                ) : (
                                  <span className="text-[9px] font-bold">{tech.charAt(0).toUpperCase()}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-3 relative z-30 ml-auto min-w-0">
                          {project.link_github && (
                            <a 
                              href={project.link_github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors shrink-0"
                            >
                              <Github size={14} />
                              <span className="hidden sm:inline">Code</span>
                            </a>
                          )}
                          
                          {project.link_live_demo && (
                            <a 
                              href={project.link_live_demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors shrink-0"
                            >
                              <ExternalLink size={14} />
                              <span className="hidden sm:inline">Demo</span>
                            </a>
                          )}
                          
                          <Link 
                            href={`/projects/${project.slug}`}
                            className="flex items-center gap-1.5 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white hover:text-white/80 transition-colors bg-white/10 px-3 py-1.5 rounded-full border border-white/5 shrink-0"
                          >
                            Details <span className="text-gray-500">→</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-br from-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                </div>
              );
            })}
          </div>
          
          {/* Empty State */}
          {projects.length === 0 && (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Code2 className="w-10 h-10 text-gray-500 group-hover:text-white transition-colors" />
              </div>
              <p className="text-2xl font-bold text-white mb-3">No hay proyectos publicados aún</p>
              <p className="text-gray-500 text-center max-w-sm leading-relaxed">
                Estamos preparando contenido increíble. Vuelve pronto para descubrir nuevos proyectos y arquitecturas.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}