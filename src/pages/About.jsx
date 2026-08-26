import { useState, useEffect } from 'react';
import { MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function About() {
  const [data, setData] = useState({
    biography: 'I am Saad Saeed, a passionate software developer specializing in AI integrations, autonomous agent pipelines, and high-performance React frontends.',
    location: 'Lahore, Pakistan',
    education: [
      { degree: 'BS Computer Science', school: 'FAST NUCES', year: '2020-2024' }
    ],
    experience: [
      { role: 'AI Integration Engineer', company: 'Saasify', year: '2024 - Present' }
    ],
    stats: [
      { label: 'Projects Completed', value: '25+' },
      { label: 'Workflows Automated', value: '50+' }
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
            education: Array.isArray(res.education) ? res.education : [],
            experience: Array.isArray(res.experience) ? res.experience : [],
            stats: Array.isArray(res.stats) ? res.stats : []
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
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">01 / Biography</span>
          <h1 className="text-xl font-bold uppercase mt-4 text-neutral-950 tracking-tight">About Me</h1>
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-bold uppercase mt-3 tracking-wider">
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
                <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-widest mt-1">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 02 // Journey (Career Experience) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">02 / Journey</span>
          <h2 className="text-lg font-bold uppercase mt-4 text-neutral-950 tracking-tight">Experience</h2>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 flex flex-col divide-y divide-dashed divide-neutral-900/10">
          {data.experience.length === 0 ? (
            <div className="text-xs font-semibold text-neutral-400 uppercase">No career records configured.</div>
          ) : (
            data.experience.map((exp, idx) => (
              <div key={idx} className="py-8 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-wider">{exp.year}</span>
                  <h4 className="text-md font-bold uppercase text-neutral-950 mt-1.5 tracking-tight">{exp.role}</h4>
                  <p className="text-xs text-neutral-500 font-semibold uppercase mt-0.5 tracking-wider">{exp.company}</p>
                </div>
                
                {/* Active/Past badge */}
                <span className="px-3 py-1.5 border border-neutral-200 text-[9px] font-bold rounded-full uppercase tracking-wider text-neutral-600 self-start bg-neutral-50">
                  {idx === 0 ? 'Active' : 'Past'}
                </span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 03 // Credentials (Education) */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">03 / Education</span>
          <h2 className="text-lg font-bold uppercase mt-4 text-neutral-950 tracking-tight">Credentials</h2>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12">
          {data.education.length === 0 ? (
            <div className="text-xs font-semibold text-neutral-400 uppercase">No education records found.</div>
          ) : (
            <div className="relative border-l border-neutral-900/10 ml-3 pl-8 flex flex-col gap-10 py-2">
              {data.education.map((edu, idx) => (
                <div key={idx} className="relative flex flex-col">
                  {/* Timeline circular node */}
                  <span className="absolute -left-[38px] top-1.5 w-3 h-3 rounded-full bg-neutral-950 border border-white" />
                  
                  <span className="text-[9px] font-bold text-neutral-450 uppercase tracking-wider">{edu.year}</span>
                  <h4 className="text-md font-bold uppercase text-neutral-950 mt-1.5 tracking-tight">{edu.degree}</h4>
                  <p className="text-xs text-neutral-500 font-semibold uppercase mt-0.5 tracking-wider">{edu.school}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
