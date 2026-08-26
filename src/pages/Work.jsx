import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Work() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProjects() {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true);

        if (error) throw error;
        setProjects(data || []);
      } catch (err) {
        console.error('Failed to load projects:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProjects();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col justify-center items-center py-24 animate-pulse">
        <div className="h-6 w-32 bg-neutral-200 rounded mb-4" />
        <div className="h-10 w-2/3 bg-neutral-200 rounded" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Title Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">Selected Works</span>
          <h1 className="text-xl font-bold uppercase mt-4 text-neutral-950 tracking-tight">Case Studies</h1>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 flex flex-col justify-center">
          <p className="text-sm text-neutral-500 leading-relaxed max-w-xl">
            Explore a curated selection of full-stack projects, AI agents, and integration flows designed to optimize software architecture and workflows.
          </p>
        </div>
      </div>

      {/* Projects Grid List */}
      {projects.length === 0 ? (
        <div className="p-12 text-center text-xs font-semibold uppercase tracking-wider text-neutral-450">
          No projects are currently published. Check back later!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 divide-neutral-900/10 border-b border-neutral-900/10">
          {projects.map((project, idx) => (
            <div 
              key={project.id} 
              className={`p-6 sm:p-12 flex flex-col justify-between h-[360px] bg-white group hover:bg-neutral-50/50 transition-colors border-b border-neutral-900/10 ${idx % 2 === 1 ? 'md:border-l' : ''}`}
            >
              <div>
                <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-wider">
                  {project.category || 'CASE STUDY'}
                </span>
                
                <h3 className="text-md font-bold uppercase tracking-tight text-neutral-950 mt-3 group-hover:text-accent-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-xs text-neutral-500 mt-2.5 leading-relaxed line-clamp-5">
                  {project.short_desc}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-neutral-100 pt-4 mt-6">
                <div className="flex gap-4">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 transition-colors"
                    >
                      Code
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[10px] font-bold uppercase tracking-wider text-neutral-500 hover:text-neutral-950 transition-colors"
                    >
                      Live Demo
                    </a>
                  )}
                </div>
                
                <span className="text-neutral-400 group-hover:text-neutral-950 transition-colors">
                  <ArrowUpRight size={16} className="arrow-hover-icon" />
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
