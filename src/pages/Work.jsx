import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <div className="container mx-auto max-w-6xl px-6 py-12 md:py-24">
      <div className="flex flex-col gap-4 mb-16 max-w-2xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-600">
          <span>Selected Works</span>
          <span className="w-12 h-[1px] bg-neutral-300" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-neutral-900 tracking-tight leading-none">
          Portfolio & Case Studies
        </h1>
        <p className="text-neutral-500 font-sans mt-2">
          Explore a curated list of production-grade websites, fullstack web applications, and LLM-powered background pipelines.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-64 bg-neutral-100 border border-neutral-200 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-neutral-200 rounded-lg bg-neutral-50/50">
          <p className="text-neutral-500 font-medium">No projects are currently published. Check back later!</p>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {projects.map((project) => (
            <motion.div
              key={project.id}
              variants={itemVariants}
              className="group border border-neutral-200 rounded-lg bg-white overflow-hidden hover:border-neutral-950 transition-all flex flex-col justify-between h-[320px] p-8 shadow-xs"
            >
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-semibold px-3 py-1 bg-neutral-50 border border-neutral-150 rounded-full text-neutral-600 uppercase tracking-wider">
                    {project.category}
                  </span>
                  {project.is_featured && (
                    <span className="text-[10px] bg-amber-50 text-amber-700 font-bold px-2 py-0.5 rounded-full border border-amber-200 uppercase tracking-wider">
                      Featured
                    </span>
                  )}
                </div>
                
                <h3 className="text-2xl font-bold font-display text-neutral-900 group-hover:text-accent-600 transition-colors">
                  {project.title}
                </h3>
                
                <p className="text-sm text-neutral-500 line-clamp-3 leading-relaxed">
                  {project.short_desc}
                </p>
              </div>

              <div className="flex justify-between items-center border-t border-neutral-100 pt-4 mt-4">
                <div className="flex gap-4">
                  {project.github_url && (
                    <a
                      href={project.github_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Github size={16} />
                      Code
                    </a>
                  )}
                  {project.live_url && (
                    <a
                      href={project.live_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-neutral-500 hover:text-neutral-900 transition-colors flex items-center gap-1.5 text-xs font-semibold"
                    >
                      <Globe size={16} />
                      Live Demo
                    </a>
                  )}
                </div>
                
                <span className="text-neutral-400 group-hover:text-neutral-900 transition-colors transform group-hover:translate-x-1 duration-200">
                  <ArrowUpRight size={18} />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
