import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Zap, Award, ArrowUpRight, Play } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Automation() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAutomations() {
      try {
        const { data, error } = await supabase
          .from('automations')
          .select('*')
          .eq('is_published', true);

        if (error) throw error;
        setAutomations(data || []);
      } catch (err) {
        console.error('Failed to load automations:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAutomations();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.12 }
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
          <span>AI Agents & n8n</span>
          <span className="w-12 h-[1px] bg-neutral-300" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-neutral-900 tracking-tight leading-none">
          Autonomous Pipelines
        </h1>
        <p className="text-neutral-500 font-sans mt-2">
          Automating enterprise integrations, connecting CRM fields, webhooks, and custom vector search agents to custom frontends.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-8">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-64 bg-neutral-100 border border-neutral-250 rounded-lg animate-pulse" />
          ))}
        </div>
      ) : automations.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-neutral-200 rounded-lg bg-neutral-50/50">
          <p className="text-neutral-500 font-medium">No automation pipelines are currently active. Check back later!</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-12"
        >
          {automations.map((auto) => (
            <motion.div
              key={auto.id}
              variants={itemVariants}
              className="group border border-neutral-200 rounded-lg bg-white overflow-hidden p-8 shadow-xs flex flex-col gap-6 hover:border-neutral-950 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-100 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-neutral-50 border border-neutral-150 rounded-lg text-neutral-600">
                    <Cpu size={22} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-display text-neutral-900 group-hover:text-accent-600 transition-colors">
                      {auto.name}
                    </h3>
                    <p className="text-xs text-neutral-400 font-sans mt-0.5">{auto.description}</p>
                  </div>
                </div>

                <div className="flex gap-3 text-xs font-mono font-medium">
                  {auto.trigger_type && (
                    <span className="px-2.5 py-1 bg-neutral-50 border border-neutral-150 text-neutral-600 rounded">
                      Trigger: {auto.trigger_type}
                    </span>
                  )}
                  {auto.ai_model && (
                    <span className="px-2.5 py-1 bg-neutral-50 border border-neutral-150 text-neutral-600 rounded">
                      Model: {auto.ai_model}
                    </span>
                  )}
                </div>
              </div>

              {/* Problem/Solution side-by-side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-red-500">The Problem</span>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                    {auto.problem}
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-green-600">The Automation</span>
                  <p className="text-sm text-neutral-600 leading-relaxed font-sans">
                    {auto.solution}
                  </p>
                </div>
              </div>

              {/* Demo actions and results */}
              <div className="flex justify-between items-center border-t border-neutral-100 pt-4 mt-2">
                <div className="flex items-center gap-2">
                  <span className="p-1 bg-green-50 border border-green-200 text-green-700 rounded-full">
                    <Zap size={14} />
                  </span>
                  <span className="text-xs font-semibold text-neutral-800">
                    Result: <span className="font-bold text-neutral-900">{auto.result}</span>
                  </span>
                </div>

                {auto.demo_url && (
                  <a
                    href={auto.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 border border-neutral-300 rounded-md text-xs font-semibold hover:bg-neutral-50 transition-colors"
                  >
                    <Play size={12} fill="currentColor" />
                    Watch Demo
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
