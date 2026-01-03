import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Project } from "@/payload-types";
import { Github, ExternalLink } from "lucide-react";
import { ShineBorder } from "@/components/ui/shine-border";
import { statusConfig, typeConfig, techIcons, isMedia, formatDate } from "@/components/projects/project-constants";



export function ProjectCard({ project, className }: { project: Project; className?: string }) {
  const imageRepo = isMedia(project.image_repo) ? project.image_repo : null;
  const previewVideo = isMedia(project.preview_video) ? project.preview_video : null;
  
  const imageUrl = imageRepo?.url
    ? (process.env.NEXT_PUBLIC_PAYLOAD_URL 
        ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${imageRepo.url}` 
        : imageRepo.url)
    : null;
  
  const videoUrl = previewVideo?.url
    ? (process.env.NEXT_PUBLIC_PAYLOAD_URL 
        ? `${process.env.NEXT_PUBLIC_PAYLOAD_URL}${previewVideo.url}` 
        : previewVideo.url)
    : null;

  const hasImage = !!imageUrl;
  const hasVideo = !!videoUrl;

  const isFeatured = project.is_featured;
  const status = statusConfig[project.project_status as keyof typeof statusConfig] || statusConfig.production;
  const type = typeConfig[project.project_type as keyof typeof typeConfig] || typeConfig.backend;
  const StatusIcon = status.icon;
  const TypeIcon = type.icon;

  return (
    <div 
      className={cn(
        "group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 backdrop-blur-md transition-all duration-500 ease-out",
        "hover:border-white/20 hover:shadow-[0_0_40px_-15px_rgba(255,255,255,0.1)] hover:-translate-y-1",
        "min-h-[300px] md:min-h-0", // Ensure a minimum height on mobile
        className
      )}
    >
      <ShineBorder 
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        shineColor={["#ffffff", "#ffffff", "#ffffff"]}
        borderWidth={2}
      />
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
}
