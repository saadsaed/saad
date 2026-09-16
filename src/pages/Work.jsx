import { useState, useEffect } from 'react';
import { ArrowUpRight, Workflow } from 'lucide-react';
import { supabase } from '../lib/supabase';

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

export default function Work() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="w-full flex flex-col bg-white">
      {/* Title Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-b border-neutral-900/10">
        <div className="lg:col-span-4 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10">
          <span className="text-xs font-bold text-neutral-600 tracking-wider">Selected Works</span>
          <h1 className="text-xl font-bold mt-3 text-neutral-950 tracking-tight">Case Studies</h1>
        </div>
        <div className="lg:col-span-8 p-6 sm:p-12 flex flex-col justify-center">
          <p className="text-sm text-neutral-600 leading-relaxed max-w-xl">
            Explore end-to-end automation pipelines, AI integrations, web scraping tools, and custom workflow architectures.
          </p>
        </div>
      </div>

      {/* Projects List */}
      <div className="flex flex-col divide-y divide-neutral-900/10 border-b border-neutral-900/10">
        {DETAILED_PROJECTS.map((project) => (
          <div key={project.id} className="p-6 sm:p-12 flex flex-col gap-6 bg-white hover:bg-neutral-50/30 transition-colors">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tech_stack.map((tech, tIdx) => (
                  <span key={tIdx} className="px-2.5 py-1 text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-md">
                    {tech}
                  </span>
                ))}
              </div>
              
              <h3 className="text-xl font-bold text-neutral-950 tracking-tight">
                {project.title}
              </h3>
              
              <p className="text-sm text-neutral-600 mt-2.5 leading-relaxed font-medium">
                {project.summary}
              </p>
            </div>

            {/* Key Features List */}
            <div className="bg-neutral-50 border border-neutral-900/10 p-5 rounded-lg">
              <span className="text-xs font-bold text-neutral-600 tracking-wider block mb-3">
                Key Features & Architecture
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
            <div className="border border-neutral-900/10 p-5 bg-neutral-950 text-white rounded-lg">
              <div className="flex items-center justify-between mb-4 border-b border-neutral-800 pb-2">
                <span className="text-xs font-bold text-neutral-400 flex items-center gap-1.5 tracking-wide">
                  <Workflow size={14} className="text-emerald-400" />
                  Workflow Execution Diagram
                </span>
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Live Execution Pipeline
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                {project.workflow_steps.map((step, sIdx) => (
                  <div key={sIdx} className="relative p-3 bg-neutral-900 border border-neutral-800 rounded-md flex flex-col justify-between">
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
                ))}
              </div>
            </div>

            {/* GitHub Link */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-neutral-100 pt-4">
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Verified Production Pipeline
              </span>
              
              <a 
                href={project.github_url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-950 hover:text-accent-600 transition-colors"
              >
                GitHub Repository 
                <ArrowUpRight size={14} className="arrow-hover-icon" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

