import { useState, useEffect } from 'react';
import { MapPin, Award, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

export default function About() {
  const [data, setData] = useState({
    biography: 'Computer Science student specializing in AI automation, workflow orchestration, API integration, and Python scripting. Experienced in building automated pipelines with n8n, Make.com, Gemini AI, and REST APIs.',
    location: 'Lahore, Pakistan',
    education: [
      { degree: 'Bachelor of Science in Computer Science (BSCS)', school: 'The Superior University', year: '2023 - Present' }
    ],
    experience: [
      { role: 'AI Automation & Workflow Developer', company: 'Freelance / Projects', year: '2023 - Present' }
    ],
    stats: [
      { label: 'Projects Completed', value: '10+' },
      { label: 'Automations Built', value: '25+' },
      { label: 'APIs Integrated', value: '15+' }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAbout() {
      try {
        const { data: res, error } = await supabase
          .from('about_content')
          .select('*')
          .eq('id', true)
          .single();

        if (error) throw error;
        if (res) {
          setData({
            biography: res.biography || '',
            location: res.location || '',
            education: Array.isArray(res.education) && res.education.length > 0 ? res.education : [
              { degree: 'Bachelor of Science in Computer Science (BSCS)', school: 'The Superior University', year: '2023 - Present' }
            ],
            experience: Array.isArray(res.experience) && res.experience.length > 0 ? res.experience : [
              { role: 'AI Automation & Workflow Developer', company: 'Freelance / Projects', year: '2023 - Present' }
            ],
            stats: Array.isArray(res.stats) && res.stats.length > 0 ? res.stats : [
              { label: 'Projects Completed', value: '10+' },
              { label: 'Automations Built', value: '25+' },
              { label: 'APIs Integrated', value: '15+' }
            ]
          });
        }
      } catch (err) {
        console.error('Failed to load about details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
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
      {/* 01 // Biography Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-xs font-bold text-neutral-600 tracking-wider">01 / Biography</span>
          <h1 className="text-xl font-bold mt-3 text-neutral-950 tracking-tight">About Me</h1>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold mt-3 tracking-wide">
            <MapPin size={14} className="text-neutral-400" />
            <span>{data.location}</span>
          </div>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 dot-grid flex flex-col gap-8">
          <p className="text-lg text-neutral-800 leading-relaxed max-w-2xl">
            {data.biography}
          </p>
          
          {/* Stats Display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-neutral-900/10 pt-8 max-w-xl">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="flex flex-col">
                <span className="text-2xl font-bold text-neutral-950 tracking-tight">{stat.value}</span>
                <span className="text-xs font-bold text-neutral-600 tracking-wider mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 02 // Skills Section (Categorized Cards) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-xs font-bold text-neutral-600 tracking-wider">02 / Technical Skills</span>
          <h2 className="text-xl font-bold mt-3 text-neutral-950 tracking-tight">Capabilities & Tools</h2>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {SKILL_CATEGORIES.map((cat, idx) => (
            <div key={idx} className="p-6 border border-neutral-900/10 bg-neutral-50/50 rounded-lg flex flex-col justify-between hover:border-neutral-900/30 transition-colors">
              <div>
                <span className="text-xs font-bold text-neutral-600 tracking-wider">0{idx + 1} / Category</span>
                <h3 className="text-base font-bold text-neutral-950 mt-1 mb-4">
                  {cat.category_name}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {cat.skills.map((skill, sIdx) => (
                    <span 
                      key={sIdx}
                      className="px-3 py-1.5 bg-white border border-neutral-200 text-neutral-900 text-xs font-semibold rounded-md tracking-wide shadow-2xs hover:border-neutral-950 transition-colors"
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

      {/* 03 // Journey (Career Experience) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-xs font-bold text-neutral-600 tracking-wider">03 / Journey</span>
          <h2 className="text-xl font-bold mt-3 text-neutral-950 tracking-tight">Experience</h2>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 flex flex-col divide-y divide-dashed divide-neutral-900/10">
          {data.experience.map((exp, idx) => (
            <div key={idx} className="py-8 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-neutral-600 tracking-wider">{exp.year}</span>
                <h4 className="text-base font-bold text-neutral-950 mt-1.5 tracking-tight">{exp.role}</h4>
                <p className="text-xs text-neutral-600 font-semibold mt-0.5 tracking-wide">{exp.company}</p>
              </div>
              
              <span className="px-2.5 py-1 border border-neutral-200 text-xs font-semibold rounded-full text-neutral-700 self-start bg-neutral-50">
                {idx === 0 ? 'Active' : 'Past'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 04 // Certifications Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-xs font-bold text-neutral-600 tracking-wider">04 / Credentials</span>
          <h2 className="text-xl font-bold mt-3 text-neutral-950 tracking-tight">Certifications</h2>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {CERTIFICATIONS.map((cert, idx) => (
            <div key={idx} className="p-6 border border-neutral-900/10 bg-white rounded-lg flex flex-col justify-between hover:border-neutral-950 transition-colors group">
              <div>
                <div className="min-h-[28px] flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-neutral-500 flex items-center gap-1">
                    <Award size={14} className="text-accent-600" />
                    {cert.issuer}
                  </span>
                  <span className="px-2.5 py-0.5 border border-emerald-200 text-emerald-700 bg-emerald-50 text-xs font-semibold rounded-full flex items-center gap-1">
                    <ShieldCheck size={12} />
                    Verifiable
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-950 group-hover:text-accent-600 transition-colors">
                  {cert.name}
                </h3>
              </div>
              <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-semibold text-neutral-500">
                <span>Verified Credential</span>
                <CheckCircle2 size={14} className="text-emerald-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 05 // Education Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-xs font-bold text-neutral-600 tracking-wider">05 / Education</span>
          <h2 className="text-xl font-bold mt-3 text-neutral-950 tracking-tight">Academics</h2>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12">
          <div className="relative border-l border-neutral-900/10 ml-3 pl-8 flex flex-col gap-10 py-2">
            {data.education.map((edu, idx) => (
              <div key={idx} className="relative flex flex-col">
                <span className="absolute -left-[38px] top-1.5 w-3 h-3 rounded-full bg-neutral-950 border border-white" />
                <span className="text-xs font-bold text-neutral-500 tracking-wider">{edu.year}</span>
                <h4 className="text-base font-bold text-neutral-950 mt-1.5 tracking-tight">{edu.degree}</h4>
                <p className="text-xs text-neutral-600 font-medium mt-0.5">{edu.school}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

