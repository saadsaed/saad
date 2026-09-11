import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, Cpu, Briefcase, Sparkles, Terminal, Code, Download, ExternalLink, Award, CheckCircle2, Workflow, Database, Layers, ShieldCheck } from 'lucide-react';
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

const SKILL_CATEGORIES = [
  {
    category_name: "Automation & AI",
    skills: ["n8n", "Make.com", "Gemini AI"]
  },
  {
    category_name: "APIs & Integration",
    skills: ["REST APIs", "Webhooks", "WhatsApp Business API", "Postman"]
  },
  {
    category_name: "Programming & Databases",
    skills: ["Python", "SQL"]
  },
  {
    category_name: "Data & Web Scraping",
    skills: ["BeautifulSoup", "JSON", "CSV", "Web Scraping"]
  },
  {
    category_name: "Developer Tools & CMS",
    skills: ["Git", "GitHub", "VS Code", "WordPress"]
  }
];

const DETAILED_PROJECTS = [
  {
    id: "project-01",
    title: "AI-Powered Social Media Automation",
    tech_stack: ["Make.com", "Python", "AI", "REST APIs"],
    summary: "End-to-end automated pipeline to generate, format, schedule, and publish platform-specific content across multiple social media networks.",
    key_features: [
      "Automated content publishing across Facebook, Instagram, and LinkedIn.",
      "Integrated AI-powered caption generation tailored for platform-specific tone and style.",
      "Built a web-fetching pipeline to retrieve, parse, and process image assets from source URLs.",
      "Designed modular workflows incorporating scheduling, REST API integrations, and error handling."
    ],
    github_url: "https://github.com/saadsaed",
    workflow_steps: [
      { name: "Source URL", sub: "Web Asset Retrieval" },
      { name: "Python Web Fetcher", sub: "Parsing & Formatting" },
      { name: "Gemini AI Engine", sub: "Prompt & Caption Engine" },
      { name: "Social REST APIs", sub: "FB, Insta & LinkedIn" }
    ]
  },
  {
    id: "project-02",
    title: "AI-Driven WhatsApp Order & Lead Capture",
    tech_stack: ["n8n", "Gemini AI", "WhatsApp Business API", "CSV/JSON"],
    summary: "Intelligent conversational capture system that parses unstructured customer messages into structured business data.",
    key_features: [
      "Engineered an automated WhatsApp workflow for customer order capture and lead intake.",
      "Leveraged Gemini AI to extract customer names, contact info, and order requirements from natural language messages.",
      "Transformed unstructured customer replies into validated, strict JSON payloads.",
      "Automated lead and order synchronization directly into CSV records to eliminate manual entry."
    ],
    github_url: "https://github.com/saadsaed",
    workflow_steps: [
      { name: "WhatsApp Chat Bubble", sub: "Webhook Trigger" },
      { name: "n8n Canvas & Gemini AI", sub: "NLP Extraction Node" },
      { name: "Extracted JSON Payload", sub: "Strict JSON Validation" },
      { name: "Populated CSV Record", sub: "Automated Data Sync" }
    ]
  }
];

const CERTIFICATIONS = [
  {
    name: "Google AI Essentials",
    issuer: "Google",
    display_format: "Badge / Verifiable Credential Card"
  },
  {
    name: "Introduction to Agent Skills",
    issuer: "Industry Credential",
    display_format: "Badge / Verifiable Credential Card"
  },
  {
    name: "Crash Course on Python",
    issuer: "Online Certification",
    display_format: "Badge / Verifiable Credential Card"
  },
  {
    name: "AI Fundamentals",
    issuer: "Foundational AI Credential",
    display_format: "Badge / Verifiable Credential Card"
  }
];

export default function Home() {
  const [content, setContent] = useState({
    hero_subtitle: '01 / Introduction',
    hero_heading: 'AI AUTOMATION & WORKFLOW DEVELOPER',
    hero_description: 'Computer Science student specializing in AI automation, workflow orchestration, API integration, and Python scripting. Experienced in building automated pipelines with n8n, Make.com, Gemini AI, and REST APIs.',
    cta_1_label: 'View Projects',
    cta_1_url: '#projects',
    cta_2_label: 'Download CV',
    cta_2_url: '/Saad_Saeed_CV.pdf',
    intro_text: 'Computer Science student specializing in AI automation, workflow orchestration, API integration, and Python scripting.'
  });
  
  const [services, setServices] = useState([
    { id: '1', title: 'Automation & AI', short_desc: 'n8n, Make.com, Gemini AI', icon_name: 'Cpu' },
    { id: '2', title: 'APIs & Integration', short_desc: 'REST APIs, Webhooks, WhatsApp Business API, Postman', icon_name: 'Briefcase' },
    { id: '3', title: 'Data & Web Scraping', short_desc: 'BeautifulSoup, JSON, CSV, Web Scraping', icon_name: 'Terminal' }
  ]);

  const [profilePic, setProfilePic] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPageData() {
      try {
        const { data: homeRes } = await supabase
          .from('homepage_content')
          .select('*')
          .eq('id', true)
          .single();

        if (homeRes) {
          setContent(prev => ({ ...prev, ...homeRes }));
        }

        const { data: servicesRes } = await supabase
          .from('services')
          .select('*')
          .eq('is_published', true);

        if (servicesRes && servicesRes.length > 0) {
          setServices(servicesRes);
        }

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

  const scrollToProjects = (e) => {
    e.preventDefault();
    const el = document.getElementById('projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

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
        {/* Modern headshot framed with rounded-2xl borders and a subtle shadow against a dark theme background */}
        <div className="relative -mt-16 sm:-mt-24 mb-6 inline-block">
          <div className="p-1.5 rounded-2xl bg-neutral-950 shadow-md border border-neutral-800">
            <img 
              src={profilePic} 
              className="w-32 h-32 sm:w-44 sm:h-44 rounded-2xl object-cover" 
              alt="Saad Saeed"
            />
          </div>
          {/* Online green indicator dot */}
          <span className="absolute bottom-3 right-3 w-4 h-4 bg-emerald-500 rounded-full border-2 border-neutral-950 animate-pulse" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950 uppercase">
              Saad Saeed
            </h1>
            <p className="text-xs sm:text-sm font-bold text-accent-600 uppercase mt-1.5 tracking-wider">
              AI Automation & Workflow Developer
            </p>
            <p className="text-[10px] text-neutral-400 font-bold uppercase mt-1 tracking-widest flex items-center gap-1">
              <span>Lahore, Pakistan</span>
            </p>
          </div>

          {/* Call-to-actions */}
          <div className="flex flex-wrap items-center gap-3">
            <a 
              href="#projects" 
              onClick={scrollToProjects}
              className="px-5 py-2.5 bg-neutral-950 text-white hover:bg-neutral-900 text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors inline-flex items-center gap-1.5"
            >
              View Projects
            </a>
            <a 
              href="/Saad_Saeed_CV.pdf" 
              download
              className="px-4 py-2.5 border border-neutral-300 hover:border-neutral-950 text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 text-neutral-900"
            >
              <Download size={12} />
              Download CV
            </a>
            <a 
              href="mailto:m.saadsaeed7223@gmail.com" 
              className="px-4 py-2.5 border border-neutral-300 hover:border-neutral-950 text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors inline-flex items-center gap-1.5 text-neutral-900"
            >
              Contact Me
            </a>
            <a 
              href="https://github.com/saadsaed" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2.5 border border-neutral-200 hover:border-neutral-950 text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors text-neutral-600 hover:text-neutral-950"
            >
              Github
            </a>
            <a 
              href="https://linkedin.com/in/saadsaeed7" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2.5 border border-neutral-200 hover:border-neutral-950 text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors text-neutral-600 hover:text-neutral-950"
            >
              LinkedIn
            </a>
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
            Computer Science student specializing in AI automation, workflow orchestration, API integration, and Python scripting.
          </p>
          <p className="text-sm text-neutral-600 leading-relaxed max-w-2xl">
            Experienced in building automated pipelines with n8n, Make.com, Gemini AI, WhatsApp Business API, and REST APIs. Passionate about transforming manual processes into seamless autonomous workflows.
          </p>
        </div>
      </div>

      {/* 02 // Skills & Technologies (Categorized Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">02 / Technical Stack</span>
          <h2 className="text-lg font-bold uppercase mt-4 text-neutral-950 tracking-tight">Skills & Capabilities</h2>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="p-6 border border-neutral-900/10 bg-neutral-50/50 rounded-none flex flex-col justify-between hover:border-neutral-900/30 transition-colors">
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-450">0{idx + 1} / Category</span>
                <h3 className="text-sm font-bold uppercase tracking-tight text-neutral-950 mt-1 mb-4">
                  {cat.category_name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-900 text-xs font-semibold rounded-none tracking-wide shadow-2xs hover:border-neutral-950 transition-colors"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 03 // Projects Section */}
      <div id="projects" className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10 flex flex-col justify-between">
          <div>
            <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">03 / Selected Works</span>
            <h2 className="text-lg font-bold uppercase mt-4 text-neutral-950 tracking-tight">Automation Projects</h2>
          </div>
          <Link 
            to="/work"
            className="group inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-950 hover:opacity-85 transition-opacity mt-8 lg:mt-0"
          >
            View all projects
            <ArrowUpRight size={14} className="arrow-hover-icon" />
          </Link>
        </div>
        
        <div className="lg:col-span-8 divide-y divide-neutral-900/10">
          {DETAILED_PROJECTS.map((project) => (
            <div key={project.id} className="p-6 sm:p-12 flex flex-col gap-6 bg-white hover:bg-neutral-50/30 transition-colors">
              <div>
                <div className="flex flex-wrap gap-2 mb-3">
                  {project.tech_stack.map((tech, tIdx) => (
                    <span key={tIdx} className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800 border border-neutral-200">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-xl font-bold uppercase tracking-tight text-neutral-950">
                  {project.title}
                </h3>
                
                <p className="text-sm text-neutral-600 mt-2.5 leading-relaxed font-medium">
                  {project.summary}
                </p>
              </div>

              {/* Key Features List */}
              <div className="bg-neutral-50 border border-neutral-900/10 p-5">
                <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-450 block mb-3">
                  Key Deliverables & Architecture
                </span>
                <ul className="flex flex-col gap-2">
                  {project.key_features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 text-xs text-neutral-700 font-medium">
                      <span className="text-neutral-400 select-none">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Visual Workflow Diagram */}
              <div className="border border-neutral-900/10 p-5 bg-neutral-950 text-white">
                <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-2">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                    <Workflow size={12} className="text-emerald-400" />
                    Workflow Architecture Diagram
                  </span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 border border-emerald-800">
                    Live Execution Pipeline
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  {project.workflow_steps.map((step, sIdx) => (
                    <div key={sIdx} className="relative p-3 bg-neutral-900 border border-neutral-800 flex flex-col justify-between">
                      <span className="text-[8px] font-bold text-neutral-500 uppercase tracking-widest">Step 0{sIdx + 1}</span>
                      <div className="mt-2">
                        <div className="text-xs font-bold text-neutral-100 uppercase tracking-tight">{step.name}</div>
                        <div className="text-[9px] text-emerald-400 font-medium mt-0.5 tracking-wider">{step.sub}</div>
                      </div>
                      {sIdx < 3 && (
                        <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-neutral-600">
                          →
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Link */}
              <div className="flex justify-between items-center border-t border-neutral-100 pt-4">
                <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Verified Production Pipeline
                </span>
                
                <a 
                  href={project.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-950 hover:text-accent-600 transition-colors"
                >
                  GitHub Repository 
                  <ArrowUpRight size={14} className="arrow-hover-icon" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 04 // Certifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">04 / Verified Credentials</span>
          <h2 className="text-lg font-bold uppercase mt-4 text-neutral-950 tracking-tight">Certifications</h2>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CERTIFICATIONS.map((cert, idx) => (
            <div key={idx} className="p-6 border border-neutral-900/10 bg-white flex flex-col justify-between hover:border-neutral-950 transition-colors group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1">
                    <Award size={12} className="text-accent-600" />
                    {cert.issuer}
                  </span>
                  <span className="px-2 py-0.5 border border-emerald-200 text-emerald-700 bg-emerald-50 text-[8px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <ShieldCheck size={10} />
                    Verifiable
                  </span>
                </div>
                <h3 className="text-sm font-bold uppercase tracking-tight text-neutral-950 group-hover:text-accent-600 transition-colors">
                  {cert.name}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[9px] font-bold text-neutral-450 uppercase tracking-widest">
                <span>{cert.display_format}</span>
                <CheckCircle2 size={12} className="text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 05 // Education Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">05 / Education</span>
          <h2 className="text-lg font-bold uppercase mt-4 text-neutral-950 tracking-tight">Academics</h2>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12">
          <div className="p-6 border border-neutral-900/10 bg-neutral-50/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-wider">2023 - Present</span>
              <h3 className="text-base font-bold uppercase tracking-tight text-neutral-950 mt-1">
                Bachelor of Science in Computer Science (BSCS)
              </h3>
              <p className="text-xs text-neutral-600 font-semibold uppercase tracking-wider mt-0.5">
                The Superior University
              </p>
            </div>
            <span className="px-3 py-1.5 border border-neutral-200 text-[9px] font-bold rounded-full uppercase tracking-wider text-neutral-600 bg-white self-start sm:self-auto">
              In Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

