"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Project } from "@/payload-types";
import { Code2 } from "lucide-react";
import { ProjectCard } from "./project-card";
import { statusConfig } from "./project-constants";

type FilterType = "all" | "production" | "mvp" | "rnd";

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [filter, setFilter] = useState<FilterType>("all");

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    return project.project_status === filter;
  });

  // Separate featured and regular projects from the filtered list
  // Note: sorting allows bento logic to work correctly by grouping featured ones if needed or interleaving them
  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (a.is_featured && !b.is_featured) return -1;
    if (!a.is_featured && b.is_featured) return 1;
    return 0;
  });

  return (
    <>
      {/* Filter Badges */}
      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => setFilter("all")}
          className={cn(
            "inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full border cursor-pointer transition-all duration-300",
            filter === "all" 
              ? "bg-white text-black border-white" 
              : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white"
          )}
        >
          Todos
        </button>
        {Object.entries(statusConfig).map(([key, config]) => {
          const Icon = config.icon;
          const isActive = filter === key;
          return (
            <button
              key={key}
              onClick={() => setFilter(key as FilterType)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-full border cursor-pointer transition-all duration-300",
                isActive 
                  ? config.color.replace('bg-', 'bg-opacity-100 bg-').replace('text-', 'text-').replace('border-', 'border-')
                  : "bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white",
                isActive && config.color
              )}
            >
              <Icon size={14} />
              {config.label}
            </button>
          );
        })}
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-[300px] grid-flow-dense">
        {sortedProjects.map((project, index) => {
          const isFeatured = project.is_featured;

          // Dynamic spanning logic for Bento effect
          const spanClasses = isFeatured 
            ? (index % 3 === 0 
              ? "md:col-span-2 md:row-span-2" // Large square
              : "md:col-span-2 md:row-span-1") // Wide rectangle
            : "col-span-1 md:col-span-1 lg:col-span-1 xl:col-span-2 row-span-1"; // Wide on larger screens

          return (
            <ProjectCard 
              key={project.id} 
              project={project} 
              className={spanClasses}
            />
          );
        })}
      </div>
      
      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32">
          <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <Code2 className="w-10 h-10 text-gray-500 group-hover:text-white transition-colors" />
          </div>
          <p className="text-2xl font-bold text-white mb-3">No hay proyectos encontrados</p>
          <p className="text-gray-500 text-center max-w-sm leading-relaxed">
            Intenta cambiar el filtro para ver más proyectos.
          </p>
        </div>
      )}
    </>
  );
}
