import { getPayload } from "payload";
import configPromise from "@payload-config";
import { Project } from "@/payload-types";
import { Metadata } from 'next';
import { ProjectsGrid } from "@/components/projects/projects-grid";

export const metadata: Metadata = {
  title: 'Projects | Engineering Dashboard',
  description: 'Explora mi portafolio de proyectos: arquitecturas cloud, sistemas backend escalables, frontends modernos y agentes de IA.',
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

          <ProjectsGrid projects={projects} />

        </div>
      </div>
    </section>
  );
}