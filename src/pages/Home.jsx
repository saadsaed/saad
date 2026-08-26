import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, FolderGit, Cpu } from 'lucide-react';
import * as Icons from 'lucide-react';
import { supabase } from '../lib/supabase';

// Helper component to render dynamic icons by string name
const DynamicIcon = ({ name, ...props }) => {
  const Icon = Icons[name] || Cpu; // default to Cpu if icon not found
  return <Icon {...props} />;
};

export default function Home() {
  const [content, setContent] = useState({
    hero_subtitle: '01 / Introduction',
    hero_heading: 'Building Intelligent Systems & Modern Interfaces.',
    hero_description: 'I am a specialized developer automating workflows, deploying agents, and crafting custom React platforms. I bridge the gap between AI automation and high-end frontend systems.',
    cta_1_label: 'Explore Work',
    cta_1_url: '/work',
    cta_2_label: 'Get in touch',
    cta_2_url: '/contact',
    intro_text: 'I build custom integrations that connect business applications directly to automated LLM reasoning loops.'
  });
  
  const [services, setServices] = useState([
    { id: '1', title: 'AI Agents & Workflows', short_desc: 'Design autonomous pipelines connecting lead capturing systems to LLMs for auto-enrichment, qualification, and routing.', icon_name: 'Cpu' },
    { id: '2', title: 'React & Web Development', short_desc: 'Create fast, highly interactive user experiences styled with modern design tokens and cinematic page flow animations.', icon_name: 'Briefcase' }
  ]);


  useEffect(() => {
    async function loadPageData() {
      try {
        // Load homepage content
        const { data: homeRes } = await supabase
          .from('homepage_content')
          .select('*')
          .eq('id', true)
          .single();

        if (homeRes) {
          setContent(homeRes);
        }

        // Load active services
        const { data: servicesRes } = await supabase
          .from('services')
          .select('*')
          .eq('is_published', true);

        if (servicesRes && servicesRes.length > 0) {
          setServices(servicesRes);
        }
      } catch (err) {
        console.error('Failed to load dynamic homepage content:', err);
      }
    }

    loadPageData();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="container mx-auto max-w-6xl px-6 py-12 md:py-24 flex flex-col gap-24 md:gap-36"
    >
      {/* 01 // HERO SECTION */}
      <motion.section variants={itemVariants} className="flex flex-col gap-6 max-w-3xl">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-600">
          <span>{content.hero_subtitle}</span>
          <span className="w-12 h-[1px] bg-neutral-300" />
        </div>
        <h1 className="text-4xl sm:text-6xl font-display font-bold tracking-tight text-neutral-900 leading-[1.05]">
          {content.hero_heading}
        </h1>
        <p className="text-lg text-neutral-600 leading-relaxed font-sans max-w-xl">
          {content.hero_description}
        </p>
        <div className="flex gap-4 mt-2">
          {content.cta_1_label && (
            <a
              href={content.cta_1_url || '/work'}
              className="bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-semibold px-6 py-3 rounded-xs transition-colors inline-flex items-center gap-2"
            >
              {content.cta_1_label}
              <FolderGit size={16} />
            </a>
          )}
          {content.cta_2_label && (
            <a
              href={content.cta_2_url || '/contact'}
              className="border border-neutral-300 hover:bg-neutral-50 text-neutral-900 text-sm font-semibold px-6 py-3 rounded-xs transition-colors inline-flex items-center gap-2"
            >
              {content.cta_2_label}
              <ArrowUpRight size={16} />
            </a>
          )}
        </div>
      </motion.section>

      {/* 02 // SERVICES GRID */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-12 border-t border-neutral-200/80 pt-12">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-600">02 / Expertise</span>
          <h2 className="text-2xl font-display font-bold text-neutral-900">What I Solve.</h2>
          <p className="text-sm text-neutral-500 max-w-sm">
            {content.intro_text}
          </p>
        </div>
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service) => (
            <div 
              key={service.id} 
              className="border border-neutral-200 p-6 bg-white hover:border-neutral-950 transition-colors flex flex-col gap-4"
            >
              <DynamicIcon name={service.icon_name} className="text-accent-600" size={24} />
              <h3 className="font-bold text-neutral-900">{service.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {service.short_desc}
              </p>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 03 // TECHNICAL BLUEPRINT PREVIEW */}
      <motion.section variants={itemVariants} className="border-t border-neutral-200/80 pt-12 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-600">03 / Blueprints</span>
            <h2 className="text-2xl font-display font-bold text-neutral-900">Automation Blueprints</h2>
          </div>
          <span className="text-xs font-medium text-neutral-400">CONNECTING APIS & REASONING AGENTS</span>
        </div>

        <div className="border border-neutral-200 rounded-lg p-6 bg-white overflow-x-auto">
          <div className="min-w-[600px] flex items-center justify-between px-8 py-4 relative">
            <div className="absolute top-1/2 left-0 right-0 h-[1.5px] bg-neutral-200 -translate-y-1/2 z-0" />
            
            <div className="z-10 bg-white border border-neutral-200 p-3 rounded-lg flex flex-col items-center gap-1 shadow-xs text-xs font-semibold">
              <span className="text-neutral-400 uppercase text-[9px]">Trigger</span>
              <span>Webhooks / Chat</span>
            </div>

            <div className="z-10 bg-accent-600 text-white p-3 rounded-lg flex flex-col items-center gap-1 shadow-xs text-xs font-semibold">
              <span className="text-accent-100 uppercase text-[9px]">n8n / Flow</span>
              <span>Enrichment & Rules</span>
            </div>

            <div className="z-10 bg-white border border-neutral-200 p-3 rounded-lg flex flex-col items-center gap-1 shadow-xs text-xs font-semibold">
              <span className="text-neutral-400 uppercase text-[9px]">Agent</span>
              <span>GPT-4 / Claude</span>
            </div>

            <div className="z-10 bg-white border border-neutral-950 p-3 rounded-lg flex flex-col items-center gap-1 shadow-xs text-xs font-semibold">
              <span className="text-accent-600 uppercase text-[9px]">Action</span>
              <span>CRM Sync / Notify</span>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  );
}
