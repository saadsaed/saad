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
    <div className="w-full flex flex-col bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-200">
      {/* Cover Banner Illustration */}
      <div className="w-full h-48 sm:h-72 overflow-hidden bg-neutral-100 dark:bg-neutral-900">
        <img 
          src={bannerImage} 
          className="w-full h-full object-cover filter brightness-[0.98] dark:brightness-[0.85] dark:contrast-[1.1]" 
          alt="Misty Mountains Ink Landscape" 
        />
      </div>

      {/* Profile Overlap Info Area */}
      <div className="relative px-4 sm:px-12 pb-8 sm:pb-12 border-b border-neutral-900/10 dark:border-neutral-800">
        {/* Modern headshot framed with rounded-2xl borders and a subtle shadow against a dark theme background */}
        <div className="relative -mt-14 sm:-mt-24 mb-4 sm:mb-6 inline-block">
          <div className="p-1 sm:p-1.5 rounded-2xl bg-neutral-950 dark:bg-neutral-900 shadow-md border border-neutral-800">
            <img 
              src={profilePic} 
              className="w-28 h-28 sm:w-44 sm:h-44 rounded-2xl object-cover" 
              alt="Saad Saeed"
            />
          </div>
          {/* Online green indicator dot */}
          <span className="absolute bottom-2.5 right-2.5 sm:bottom-3 sm:right-3 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-emerald-500 rounded-full border-2 border-neutral-950 animate-pulse" />
        </div>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 sm:gap-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-neutral-950 dark:text-white">
              Saad Saeed
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-accent-600 dark:text-accent-400 mt-1 sm:mt-1.5 tracking-wide">
              AI Automation & Workflow Developer
            </p>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium mt-1 tracking-wider flex items-center gap-1">
              <span>Lahore, Pakistan</span>
            </p>
          </div>

          {/* Call-to-actions - Mobile responsive buttons & social chips */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="flex flex-wrap items-center gap-2">
              <a 
                href="#projects" 
                onClick={scrollToProjects}
                className="flex-1 sm:flex-none justify-center px-4 sm:px-5 py-2.5 bg-neutral-950 text-white hover:bg-neutral-900 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200 text-xs font-semibold rounded-full transition-colors inline-flex items-center gap-1.5 shadow-xs"
              >
                View Projects
              </a>
              <a 
                href="/Saad_Saeed_CV.pdf" 
                download="Saad_Saeed_CV.pdf"
                className="flex-1 sm:flex-none justify-center px-3.5 sm:px-4 py-2.5 border border-neutral-300 hover:border-neutral-950 text-neutral-900 dark:border-neutral-700 dark:hover:border-white dark:text-neutral-100 text-xs font-medium rounded-full transition-colors inline-flex items-center gap-1.5"
              >
                <Download size={14} />
                Download CV
              </a>
              <Link 
                to="/contact" 
                className="flex-1 sm:flex-none justify-center px-3.5 sm:px-4 py-2.5 border border-neutral-300 hover:border-neutral-950 text-neutral-900 dark:border-neutral-700 dark:hover:border-white dark:text-neutral-100 text-xs font-medium rounded-full transition-colors inline-flex items-center gap-1.5"
              >
                Contact Me
              </Link>
            </div>
            {/* Separate visual group for social links */}
            <div className="flex items-center justify-start gap-3 pt-2 sm:pt-0 sm:pl-2 border-t sm:border-t-0 sm:border-l border-neutral-200 dark:border-neutral-800">
              <a 
                href="https://github.com/saadsaed" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
              >
                GitHub
              </a>
              <span className="text-neutral-300 dark:text-neutral-700 text-xs">•</span>
              <a 
                href="https://linkedin.com/in/saadsaeed7" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-xs font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white transition-colors"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* 01 // Introduction (About bio) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10 dark:border-neutral-800">
        <div className="lg:col-span-4 p-5 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10 dark:border-neutral-800">
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 tracking-wider">01 / Introduction</span>
          <h2 className="text-lg sm:text-xl font-bold mt-2 sm:mt-3 text-neutral-950 dark:text-white tracking-tight">About Me</h2>
        </div>
        <div className="lg:col-span-8 p-5 sm:p-12 dot-grid flex flex-col gap-4 sm:gap-6">
          <p className="text-lg sm:text-2xl font-bold text-neutral-950 dark:text-white leading-[1.3] sm:leading-[1.25] tracking-tight max-w-2xl">
            Computer Science student specializing in AI automation, workflow orchestration, API integration, and Python scripting.
          </p>
          <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-2xl">
            Experienced in building automated pipelines with n8n, Make.com, Gemini AI, WhatsApp Business API, and REST APIs. Passionate about transforming manual processes into seamless autonomous workflows.
          </p>
        </div>
      </div>

      {/* 02 // Skills & Technologies (Categorized Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10 dark:border-neutral-800">
        <div className="lg:col-span-4 p-5 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10 dark:border-neutral-800">
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 tracking-wider">02 / Technical Stack</span>
          <h2 className="text-lg sm:text-xl font-bold mt-2 sm:mt-3 text-neutral-950 dark:text-white tracking-tight">Skills & Capabilities</h2>
        </div>
        <div className="lg:col-span-8 p-5 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="p-5 sm:p-6 border border-neutral-900/10 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/40 rounded-lg flex flex-col justify-between hover:border-neutral-900/30 dark:hover:border-neutral-700 transition-colors">
              <div>
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 tracking-wider">0{idx + 1} / Category</span>
                <h3 className="text-base font-bold text-neutral-950 dark:text-white mt-1 mb-3 sm:mb-4">
                  {cat.category_name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white dark:bg-neutral-800/90 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-neutral-100 text-xs font-semibold rounded-md tracking-wide shadow-2xs hover:border-neutral-950 dark:hover:border-neutral-500 transition-colors"
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
      <div id="projects" className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10 dark:border-neutral-800">
        <div className="lg:col-span-4 p-5 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10 dark:border-neutral-800 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 tracking-wider">03 / Selected Works</span>
            <h2 className="text-lg sm:text-xl font-bold mt-2 sm:mt-3 text-neutral-950 dark:text-white tracking-tight">Automation Projects</h2>
          </div>
        </div>
        
        <div className="lg:col-span-8 divide-y divide-neutral-900/10 dark:divide-neutral-800">
          {DETAILED_PROJECTS.map((project) => (
            <div key={project.id} className="p-5 sm:p-12 flex flex-col gap-5 sm:gap-6 bg-white dark:bg-neutral-950 hover:bg-neutral-50/30 dark:hover:bg-neutral-900/30 transition-colors">
              <div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-3">
                  {project.tech_stack.map((tech, tIdx) => (
                    <span key={tIdx} className="px-2 sm:px-2.5 py-0.5 sm:py-1 text-xs font-semibold bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 rounded-md">
                      {tech}
                    </span>
                  ))}
                </div>
                
                <h3 className="text-lg sm:text-xl font-bold text-neutral-950 dark:text-white tracking-tight">
                  {project.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed font-medium">
                  {project.summary}
                </p>
              </div>

              {/* Key Features List */}
              <div className="bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-900/10 dark:border-neutral-800 p-4 sm:p-5 rounded-lg">
                <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 tracking-wider block mb-2.5 sm:mb-3">
                  Key Deliverables & Architecture
                </span>
                <ul className="flex flex-col gap-2">
                  {project.key_features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 text-xs text-neutral-700 dark:text-neutral-300 font-medium">
                      <span className="text-neutral-400 dark:text-neutral-600 select-none">•</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Interactive Visual Workflow Diagram */}
              <div className="border border-neutral-900/10 dark:border-neutral-800 p-4 sm:p-5 bg-neutral-950 text-white rounded-lg">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-4 border-b border-neutral-800 pb-2">
                  <span className="text-xs font-bold text-neutral-400 flex items-center gap-1.5 tracking-wide">
                    <Workflow size={14} className="text-emerald-400 shrink-0" />
                    Workflow Architecture Diagram
                  </span>
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live Execution Pipeline
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 sm:gap-3">
                  {project.workflow_steps.map((step, sIdx) => (
                    <div key={sIdx} className="flex flex-col gap-2">
                      <div className="relative p-3 bg-neutral-900 border border-neutral-800 rounded-md flex flex-col justify-between h-full">
                        <span className="text-xs font-semibold text-neutral-500">Step 0{sIdx + 1}</span>
                        <div className="mt-2">
                          <div className="text-xs font-bold text-neutral-100 tracking-tight">{step.name}</div>
                          <div className="text-xs text-emerald-400 font-medium mt-0.5">{step.sub}</div>
                        </div>
                        {sIdx < 3 && (
                          <div className="hidden sm:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 text-neutral-600">
                            →
                          </div>
                        )}
                      </div>
                      {sIdx < 3 && (
                        <div className="sm:hidden text-center text-emerald-500/70 text-xs">
                          ↓
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* GitHub Link & Footer */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 border-t border-neutral-100 dark:border-neutral-800 pt-3.5 sm:pt-4">
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  Verified Production Pipeline
                </span>
                
                <a 
                  href={project.github_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-950 dark:text-neutral-100 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
                >
                  GitHub Repository 
                  <ArrowUpRight size={14} className="arrow-hover-icon" />
                </a>
              </div>
            </div>
          ))}

          {/* "View all projects" link */}
          <div className="p-5 sm:p-12 bg-neutral-50/50 dark:bg-neutral-900/40 flex justify-end">
            <Link 
              to="/work"
              className="group inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-950 dark:text-neutral-100 hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
            >
              View all projects
              <ArrowUpRight size={14} className="arrow-hover-icon" />
            </Link>
          </div>
        </div>
      </div>

      {/* 04 // Certifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10 dark:border-neutral-800">
        <div className="lg:col-span-4 p-5 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10 dark:border-neutral-800">
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 tracking-wider">04 / Verified Credentials</span>
          <h2 className="text-lg sm:text-xl font-bold mt-2 sm:mt-3 text-neutral-950 dark:text-white tracking-tight">Certifications</h2>
        </div>
        <div className="lg:col-span-8 p-5 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {CERTIFICATIONS.map((cert, idx) => (
            <div key={idx} className="p-5 sm:p-6 border border-neutral-900/10 dark:border-neutral-800 bg-white dark:bg-neutral-900/40 rounded-lg flex flex-col justify-between hover:border-neutral-950 dark:hover:border-neutral-700 transition-colors group">
              <div>
                <div className="min-h-[28px] flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                    <Award size={14} className="text-accent-600 dark:text-accent-400 shrink-0" />
                    {cert.issuer}
                  </span>
                  <span className="px-2.5 py-0.5 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 text-xs font-semibold rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} className="shrink-0" />
                    Verifiable
                  </span>
                </div>
                <h3 className="text-sm sm:text-base font-bold text-neutral-950 dark:text-white group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors">
                  {cert.name}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-500 dark:text-neutral-400">
                <span>Verified Credential</span>
                <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 05 // Education Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 p-5 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10 dark:border-neutral-800">
          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 tracking-wider">05 / Education</span>
          <h2 className="text-lg sm:text-xl font-bold mt-2 sm:mt-3 text-neutral-950 dark:text-white tracking-tight">Academics</h2>
        </div>
        <div className="lg:col-span-8 p-5 sm:p-12">
          <div className="p-5 sm:p-6 border border-neutral-900/10 dark:border-neutral-800 bg-neutral-50/30 dark:bg-neutral-900/40 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div>
              <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400 tracking-wider">2023 - Present</span>
              <h3 className="text-base font-bold text-neutral-950 dark:text-white mt-1">
                Bachelor of Science in Computer Science (BSCS)
              </h3>
              <p className="text-xs text-neutral-600 dark:text-neutral-400 font-medium mt-0.5">
                The Superior University
              </p>
            </div>
            <span className="px-2.5 py-1 border border-neutral-200 dark:border-neutral-700 text-xs font-semibold rounded-full text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-800 self-start sm:self-auto">
              In Progress
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
