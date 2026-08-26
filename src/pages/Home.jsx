import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Cpu, Briefcase, Sparkles, Terminal, Code } from 'lucide-react';
import { supabase } from '../lib/supabase';
import bannerImage from '../assets/hero_banner.jpg';

const IconMap = {
  Cpu,
  Briefcase,
  Sparkles,
  Terminal,
  Code
};

const DynamicIcon = ({ name, ...props }) => {
  const IconComponent = IconMap[name] || Sparkles;
  return <IconComponent {...props} />;
};

export default function Home() {
  const [content, setContent] = useState({
    hero_subtitle: '01 / Introduction',
    hero_heading: 'AI AUTOMATION & WORKFLOW DEVELOPER',
    hero_description: 'Computer Science student with hands-on project experience in AI automation, workflow development, API integration, and Python scripting. Seeking an entry-level or internship opportunity in AI Automation, Python Automation, or Workflow Automation.',
    cta_1_label: 'Explore Work',
    cta_1_url: '/work',
    cta_2_label: 'Get in touch',
    cta_2_url: '/contact',
    intro_text: 'I design and build autonomous pipelines connecting webhooks, APIs, and LLMs for auto-enrichment, qualification, and routing.'
  });
  
  const [services, setServices] = useState([
    { id: '1', title: 'AI Automation & Workflows', short_desc: 'Design autonomous pipelines connecting lead capturing systems to LLMs using n8n and Make.com.', icon_name: 'Cpu' },
    { id: '2', title: 'API Integration', short_desc: 'Connect REST APIs, Webhooks, WhatsApp Business API, and structured data pipelines.', icon_name: 'Briefcase' },
    { id: '3', title: 'Data & Web Scraping', short_desc: 'Extract and parse web data into structured JSON or CSV format using BeautifulSoup.', icon_name: 'Terminal' }
  ]);

  const [projects, setProjects] = useState([]);
  const [profilePic, setProfilePic] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80');
  const [loading, setLoading] = useState(true);

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

        // Load projects
        const { data: projectsRes } = await supabase
          .from('projects')
          .select('*')
          .eq('is_published', true);

        if (projectsRes && projectsRes.length > 0) {
          setProjects(projectsRes);
        }

        // Load profile picture from about_content
        const { data: aboutRes } = await supabase
          .from('about_content')
          .select('*, profile_media:profile_media_id(*)')
          .eq('id', true)
          .single();

        if (aboutRes && aboutRes.profile_media) {
          const path = aboutRes.profile_media.storage_path;
          const publicUrl = supabase.storage.from('media').getPublicUrl(path).data.publicUrl;
          setProfilePic(publicUrl);
        }
      } catch (err) {
        console.error('Failed to load dynamic homepage content:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPageData();
  }, []);

  const featuredProjects = projects.filter(p => p.is_featured).slice(0, 2);
  // If there are no explicitly featured projects, take the first two
  const mainFeatured = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 2);
  const sideProjects = projects.filter(p => !mainFeatured.includes(p));

  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col justify-center items-center py-24 animate-pulse">
        <div className="h-48 w-full bg-neutral-100 mb-8" />
        <div className="h-6 w-32 bg-neutral-200 rounded mb-4" />
        <div className="h-10 w-2/3 bg-neutral-200 rounded" />
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Cover Banner Illustration */}
      <div className="w-full h-48 sm:h-72 overflow-hidden bg-neutral-100">
        <img 
          src={bannerImage} 
          className="w-full h-full object-cover filter brightness-[0.98]" 
          alt="Misty Mountains Ink Landscape" 
        />
      </div>

      {/* Profile Overlap Info Area */}
      <div className="relative px-6 sm:px-12 pb-12 border-b border-neutral-900/10">
        <div className="relative -mt-16 sm:-mt-24 mb-6 inline-block">
          <img 
            src={profilePic} 
            className="w-32 h-32 sm:w-44 sm:h-44 rounded-full border-4 border-white object-cover shadow-sm bg-white" 
            alt="Saad Saeed"
          />
          {/* Online green indicator dot */}
          <span className="absolute bottom-3 right-3 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-neutral-950 uppercase">
              Saad Saeed
            </h1>
            <p className="text-xs font-bold text-accent-600 uppercase mt-1.5 tracking-wider">
              Software Developer & AI Integrator
            </p>
            <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1 tracking-widest">
              Lahore, Pakistan
            </p>
          </div>

          {/* Call-to-actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 border border-neutral-200 hover:border-neutral-950 text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors"
            >
              Github
            </a>
            <a 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 border border-neutral-200 hover:border-neutral-950 text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors"
            >
              LinkedIn
            </a>
            <Link 
              to="/contact" 
              className="px-5 py-2.5 bg-neutral-950 text-white hover:bg-neutral-900 text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors"
            >
              Get in touch
            </Link>
          </div>
        </div>
      </div>

      {/* 01 // Introduction (About bio) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">01 / Introduction</span>
          <h2 className="text-lg font-bold uppercase mt-4 text-neutral-950 tracking-tight">About Me</h2>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 dot-grid flex flex-col gap-6">
          <p className="text-xl sm:text-2xl font-bold text-neutral-950 leading-[1.25] tracking-tight max-w-2xl">
            Hey there. I'm Saad — a developer crafting digital automation pipelines and premium user interfaces.
          </p>
          <p className="text-sm text-neutral-500 leading-relaxed max-w-2xl">
            {content.hero_description}
          </p>
        </div>
      </div>

      {/* 02 // Expertise (Services) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">02 / Expertise</span>
          <h2 className="text-lg font-bold uppercase mt-4 text-neutral-950 tracking-tight">Services</h2>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 flex flex-col divide-y divide-dashed divide-neutral-900/10">
          {services.map((service) => {
            // Split the short description into separate bullets
            const rawBullets = service.short_desc
              ? service.short_desc.split(/(?:\. |, | and )/g).filter(b => b.trim().length > 10)
              : [];
            const bullets = rawBullets.length > 0 ? rawBullets : [service.short_desc];

            return (
              <div key={service.id} className="py-8 first:pt-0 last:pb-0 flex flex-col gap-3">
                {/* Logo/Icon */}
                <div className="text-neutral-950 w-8 h-8 flex items-center justify-start">
                  <DynamicIcon name={service.icon_name} size={22} strokeWidth={1.5} />
                </div>
                
                {/* Title & Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
                  <h3 className="text-sm font-bold uppercase tracking-tight text-neutral-950">
                    {service.title}
                  </h3>
                  
                  {/* Status badge */}
                  <span className="px-3 py-1.5 border border-neutral-200 text-[9px] font-bold rounded-full uppercase tracking-wider text-neutral-600 bg-neutral-50 flex items-center gap-1.5 self-start sm:self-auto">
                    <span className="w-1.5 h-1.5 bg-neutral-950 rounded-full" />
                    Core Service
                  </span>
                </div>

                {/* Bullets List */}
                <ul className="mt-3 flex flex-col gap-2 text-xs text-slate-550 font-medium tracking-wide">
                  {bullets.map((bullet, bIdx) => (
                    <li key={bIdx} className="flex items-start gap-2.5">
                      <span className="text-neutral-300 select-none">•</span>
                      <span className="first-letter:uppercase">{bullet.trim()}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* 03 // Selected Works (Featured Work) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">03 / Selected Works</span>
            <h2 className="text-lg font-bold uppercase mt-4 text-neutral-950 tracking-tight">Featured Work</h2>
          </div>
          <Link 
            to="/work"
            className="group inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-950 hover:opacity-85 transition-opacity mt-8 lg:mt-0"
          >
            View all projects
            <ArrowUpRight size={14} className="arrow-hover-icon" />
          </Link>
        </div>
        
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 divide-neutral-900/10">
          {mainFeatured.map((project, idx) => (
            <div 
              key={project.id} 
              className={`p-6 sm:p-12 flex flex-col justify-between h-[360px] ${idx === 1 ? 'sm:border-l border-neutral-900/10' : ''}`}
            >
              <div>
                <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-wider">{project.category || 'CASE STUDY'}</span>
                <h3 className="text-md font-bold uppercase tracking-tight text-neutral-950 mt-3 hover:text-accent-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-neutral-500 mt-2.5 leading-relaxed line-clamp-5">
                  {project.short_desc}
                </p>
              </div>
              
              <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Active</span>
                <a 
                  href={project.live_url || project.github_url || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-neutral-950 hover:opacity-80 transition-opacity"
                >
                  Explore 
                  <ArrowUpRight size={12} className="arrow-hover-icon" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 04 // Labs (Side Projects List) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">04 / Labs</span>
          <h2 className="text-lg font-bold uppercase mt-4 text-neutral-950 tracking-tight">Side Projects</h2>
        </div>
        <div className="lg:col-span-8 divide-y divide-neutral-900/10">
          {sideProjects.length === 0 ? (
            <div className="p-6 sm:p-12 text-neutral-400 text-xs font-semibold uppercase tracking-wider">
              Additional modules coming soon.
            </div>
          ) : (
            sideProjects.map((project) => (
              <a 
                key={project.id} 
                href={project.live_url || project.github_url || '#'}
                target="_blank" 
                rel="noopener noreferrer"
                className="group p-6 sm:p-8 flex items-center justify-between hover:bg-neutral-50 transition-colors"
              >
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-tight text-neutral-950 group-hover:text-accent-600 transition-colors">
                    {project.title}
                  </h4>
                  <p className="text-[9px] text-neutral-450 mt-1 uppercase font-bold tracking-wider">{project.category || 'Utility Lab'}</p>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">
                    Code
                  </span>
                  <ArrowUpRight size={14} className="arrow-hover-icon text-neutral-450 group-hover:text-neutral-950 transition-transform" />
                </div>
              </a>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
