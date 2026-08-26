import { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Automation() {
  const [automations, setAutomations] = useState([
    {
      id: 'a1111111-1111-1111-1111-111111111111',
      name: 'AI-Powered Social Media Automation',
      description: 'Make.com · Python · AI · REST APIs',
      problem: 'Content publishing across multiple social channels takes hours of manual effort.',
      solution: 'Automated caption generation and media publishing across Facebook, Instagram, and LinkedIn.',
      trigger_type: 'Schedule/Webhook',
      ai_model: 'Gemini / OpenAI',
      result: 'Instant cross-channel publishing',
      demo_url: 'https://make.com'
    },
    {
      id: 'a2222222-2222-2222-2222-222222222222',
      name: 'AI-Driven WhatsApp Order & Lead Capture',
      description: 'n8n · Gemini AI · WhatsApp Business API',
      problem: 'Unstructured customer chat leads require manual sorting and entry.',
      solution: 'Gemini AI extracts names, emails, and requirements into structured JSON and logs to CSV.',
      trigger_type: 'WhatsApp Message',
      ai_model: 'Gemini AI',
      result: '100% automated lead logging',
      demo_url: 'https://n8n.io'
    }
  ]);
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
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">AI Agents & n8n</span>
          <h1 className="text-xl font-bold uppercase mt-4 text-neutral-950 tracking-tight">Automations</h1>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 flex flex-col justify-center">
          <p className="text-sm text-neutral-500 leading-relaxed max-w-xl">
            Automating enterprise integrations, connecting CRM fields, webhooks, and custom vector search agents to custom frontends.
          </p>
        </div>
      </div>

      {/* Automations Pipelines List */}
      {automations.length === 0 ? (
        <div className="p-12 text-center text-xs font-semibold uppercase tracking-wider text-neutral-450">
          No automation pipelines are currently active. Check back later!
        </div>
      ) : (
        <div className="flex flex-col divide-y divide-neutral-900/10 border-b border-neutral-900/10">
          {automations.map((auto) => (
            <div 
              key={auto.id} 
              className="p-6 sm:p-12 flex flex-col gap-6 bg-white hover:bg-neutral-50/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <h3 className="text-md font-bold uppercase tracking-tight text-neutral-950">
                    {auto.name}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-1 leading-relaxed">{auto.description}</p>
                </div>

                <div className="flex gap-2 text-[9px] font-bold uppercase tracking-wider">
                  {auto.trigger_type && (
                    <span className="px-2.5 py-1 bg-neutral-50 border border-neutral-200 text-neutral-600 rounded-full">
                      Trigger: {auto.trigger_type}
                    </span>
                  )}
                  {auto.ai_model && (
                    <span className="px-2.5 py-1 bg-neutral-50 border border-neutral-200 text-neutral-600 rounded-full">
                      Model: {auto.ai_model}
                    </span>
                  )}
                </div>
              </div>

              {/* Problem/Solution side-by-side splits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 py-2">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-red-500">The Problem</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {auto.problem}
                  </p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-600">The Automation</span>
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {auto.solution}
                  </p>
                </div>
              </div>

              {/* Demo actions and results */}
              <div className="flex justify-between items-center border-t border-neutral-100 pt-4 mt-2">
                <div className="flex items-center gap-2 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-800">
                    Result: <span className="text-neutral-950 font-extrabold">{auto.result}</span>
                  </span>
                </div>

                {auto.demo_url && (
                  <a
                    href={auto.demo_url}
                    target="_blank"
                    rel="noreferrer"
                    className="group inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-neutral-950 hover:opacity-80 transition-opacity"
                  >
                    Watch Demo
                    <ArrowUpRight size={14} className="arrow-hover-icon" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
