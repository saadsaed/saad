import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, GraduationCap } from 'lucide-react';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-6 py-24 animate-pulse">
        <div className="h-6 w-32 bg-neutral-200 rounded mb-4" />
        <div className="h-12 w-2/3 bg-neutral-200 rounded mb-8" />
        <div className="h-48 bg-neutral-150 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="container mx-auto max-w-6xl px-6 py-12 md:py-24 flex flex-col gap-16 md:gap-24"
    >
      {/* Bio section */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 flex flex-col gap-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-600">
            <span>01 / Biography</span>
            <span className="w-12 h-[1px] bg-neutral-300" />
          </div>
          <h1 className="text-4xl sm:text-5xl font-display font-bold text-neutral-900 tracking-tight leading-none">
            About Me
          </h1>
          <div className="flex items-center gap-2 text-sm text-neutral-500 font-sans mt-2">
            <MapPin size={16} />
            <span>{data.location}</span>
          </div>
        </div>
        <div className="lg:col-span-2 flex flex-col gap-6">
          <p className="text-lg text-neutral-600 leading-relaxed font-sans">
            {data.biography}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-neutral-100 pt-8 mt-4">
            {data.stats.map((stat, index) => (
              <div key={index} className="flex flex-col gap-1 border-l border-neutral-200 pl-4">
                <span className="text-3xl font-bold font-display text-neutral-900">{stat.value}</span>
                <span className="text-xs font-semibold text-neutral-450 uppercase tracking-wider">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Experience & Education splits */}
      <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-16 border-t border-neutral-200 pt-16">
        {/* Career Experience Timeline */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-50 border border-neutral-150 rounded-lg text-neutral-600">
              <Briefcase size={20} />
            </div>
            <h2 className="text-xl font-bold font-display text-neutral-900">Professional Experience</h2>
          </div>

          {data.experience.length === 0 ? (
            <p className="text-sm text-neutral-500 font-sans">No career events configured.</p>
          ) : (
            <div className="flex flex-col gap-6 border-l border-neutral-200 pl-6 ml-4">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative flex flex-col gap-1">
                  <div className="absolute -left-[31px] top-1.5 w-2 h-2 rounded-full bg-neutral-900 border-2 border-white ring-4 ring-neutral-50" />
                  <span className="text-xs font-semibold text-accent-600 font-sans">{exp.year}</span>
                  <h4 className="font-bold text-neutral-900">{exp.role}</h4>
                  <span className="text-sm text-neutral-500 font-sans">{exp.company}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Education Timeline */}
        <div className="flex flex-col gap-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-neutral-50 border border-neutral-150 rounded-lg text-neutral-600">
              <GraduationCap size={20} />
            </div>
            <h2 className="text-xl font-bold font-display text-neutral-900">Education Timeline</h2>
          </div>

          {data.education.length === 0 ? (
            <p className="text-sm text-neutral-500 font-sans">No education details configured.</p>
          ) : (
            <div className="flex flex-col gap-6 border-l border-neutral-200 pl-6 ml-4">
              {data.education.map((edu, index) => (
                <div key={index} className="relative flex flex-col gap-1">
                  <div className="absolute -left-[31px] top-1.5 w-2 h-2 rounded-full bg-neutral-900 border-2 border-white ring-4 ring-neutral-50" />
                  <span className="text-xs font-semibold text-accent-600 font-sans">{edu.year}</span>
                  <h4 className="font-bold text-neutral-900">{edu.degree}</h4>
                  <span className="text-sm text-neutral-500 font-sans">{edu.school}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>
    </motion.div>
  );
}
