"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Project } from "@/payload-types";
import { ProjectCard } from "@/components/projects/project-card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useInView } from "framer-motion";
import { getFeaturedProjects } from "@/actions/get-featured-projects";

export function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);
  
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  useEffect(() => {
    async function fetchProjects() {
      try {
        // Fetch featured projects using Server Action
        const docs = await getFeaturedProjects();
        setProjects(docs);
      } catch (error) {
        console.error("Failed to fetch featured projects", error);
      } finally {
        // Add a minimum delay to show the skeleton effect nicely if it loads too fast
        setTimeout(() => setIsLoading(false), 500); 
      }
    }

    if (isInView && !hasFetched) {
      setHasFetched(true);
      fetchProjects();
    }
  }, [isInView, hasFetched]);

  if (!isLoading && projects.length === 0) return null;

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden bg-black">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-7xl">
         <div className="mb-12 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60 mb-4 tracking-tight">
                Proyectos Destacados
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl font-light">
                Una selección de mis trabajos más recientes y relevantes en desarrollo y arquitectura.
            </p>
         </div>
         
         {/* Grid Layout matching the Bento Grid style */}
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 auto-rows-[300px] grid-flow-dense">
            {isLoading ? (
               // Skeletons
               Array.from({ length: 3 }).map((_, i) => {
                  // Mimic the bento layout for skeletons
                  const spanClasses = i % 3 === 0 
                     ? "md:col-span-2 md:row-span-2" 
                     : "md:col-span-2 md:row-span-1";
                  
                  return (
                     <div key={i} className={cn("rounded-3xl border border-white/5 bg-zinc-900/20 p-6 flex flex-col relative overflow-hidden", spanClasses)}>
                         <div className="flex justify-between items-start mb-4">
                            <Skeleton className="h-6 w-24 bg-white/5 rounded-full" />
                            <Skeleton className="h-4 w-16 bg-white/5 rounded-full" />
                         </div>
                         <div className="space-y-3 mt-auto relative z-10">
                            <Skeleton className="h-8 w-3/4 bg-white/5 rounded-lg" />
                            <Skeleton className="h-4 w-full bg-white/5 rounded" />
                            <Skeleton className="h-4 w-2/3 bg-white/5 rounded" />
                         </div>
                         {/* Tech stack skeleton */}
                         <div className="flex gap-2 mt-6 pt-4 border-t border-white/5">
                            <Skeleton className="h-8 w-8 bg-white/5 rounded-lg" />
                            <Skeleton className="h-8 w-8 bg-white/5 rounded-lg" />
                            <Skeleton className="h-8 w-8 bg-white/5 rounded-lg" />
                         </div>
                     </div>
                  );
               })
            ) : (
                projects.map((project, index) => {
                   // Dynamic spanning logic for Bento effect
                   // Since all are featured, we use the logic dedicated to featured items
                   const spanClasses = index % 3 === 0 
                      ? "md:col-span-2 md:row-span-2" // Large square
                      : "md:col-span-2 md:row-span-1"; // Wide rectangle
                      
                   return (
                      <ProjectCard 
                         key={project.id} 
                         project={project} 
                         className={spanClasses}
                      />
                   );
                })
            )}
         </div>

         {/* View All Projects Button */}
         <div className="mt-12 md:mt-16 flex justify-center">
            <Link 
              href="/projects"
              className="group relative inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
            >
              <Shimmer className="text-sm font-medium tracking-wide [--color-background:#ffffff] [--color-muted-foreground:#9ca3af]">
                Explorar todos los proyectos
              </Shimmer>
              <span className="text-gray-400 group-hover:text-white transition-colors duration-300">→</span>
            </Link>
         </div>
      </div>
    </section>
  )
}
