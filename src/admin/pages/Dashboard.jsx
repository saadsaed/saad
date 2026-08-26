import { useState, useEffect } from "react";
import { getDashboardStats } from "../../services/dashboard";
import { supabase } from "../../lib/supabase";
import { 
  FolderGit, 
  Briefcase, 
  Cpu, 
  Wrench, 
  AlertCircle, 
  RefreshCw 
} from "lucide-react";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [syncSuccess, setSyncSuccess] = useState(false);

  const handleSyncCV = async () => {
    setSyncing(true);
    setSyncSuccess(false);
    try {
      // 1. Site Settings
      await supabase.from('site_settings').upsert({
        id: true,
        site_name: 'Saad Saeed Portfolio',
        default_title: 'Saad Saeed | AI Automation & Workflow Developer',
        default_meta_description: 'Portfolio of Saad Saeed, specialized in AI Automation, n8n, Make.com, and Python integrations.',
        announcement_text: 'Available for entry-level and internship roles!',
        announcement_active: true,
        availability_status: 'Available'
      });

      // 2. Homepage Content
      await supabase.from('homepage_content').upsert({
        id: true,
        hero_heading: 'AI AUTOMATION & WORKFLOW DEVELOPER',
        hero_subtitle: '01 / Introduction',
        hero_description: 'Computer Science student with hands-on project experience in AI automation, workflow development, API integration, and Python scripting. Seeking an entry-level or internship opportunity in AI Automation, Python Automation, or Workflow Automation.',
        cta_1_label: 'Explore Work',
        cta_1_url: '/work',
        cta_2_label: 'Get in touch',
        cta_2_url: '/contact',
        intro_text: 'I design and build autonomous pipelines connecting webhooks, APIs, and LLMs for auto-enrichment, qualification, and routing.'
      });

      // 3. About Content
      await supabase.from('about_content').upsert({
        id: true,
        biography: 'Computer Science student with hands-on project experience in AI automation, workflow development, API integration, and Python scripting. Built end-to-end automation projects using Make.com, n8n, Gemini AI, WhatsApp Business API, and REST APIs. Experienced in web scraping, AI-based data extraction, content automation, and structured data handling. Seeking an entry-level or internship opportunity in AI Automation, Python Automation, or Workflow Automation.',
        location: 'Lahore, Pakistan',
        education: [{ degree: 'BS Computer Science', school: 'THE SUPERIOR UNIVERSITY', year: '2023 – PRESENT' }],
        experience: [{ role: 'AI Automation & Workflow Developer', company: 'Freelance / Projects', year: '2023 - Present' }],
        stats: [
          { label: 'Projects Completed', value: '10+' },
          { label: 'Automations Built', value: '25+' },
          { label: 'APIs Integrated', value: '15+' }
        ]
      });

      // 4. Contact Info
      await supabase.from('contact_info').upsert({
        id: true,
        email: 'm.saadsaeed7223@gmail.com',
        whatsapp: '+923004668808',
        location: 'Lahore, Pakistan',
        contact_description: "Let's collaborate on building smart interfaces and automated pipelines. Drop me a line below.",
        cta_text: 'Get in touch'
      });

      // 5. Delete and seed services
      await supabase.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('services').insert([
        {
          id: '11111111-1111-1111-1111-111111111111',
          title: 'AI Automation & Workflows',
          short_desc: 'Design autonomous pipelines connecting lead capturing systems to LLMs using n8n and Make.com.',
          full_desc: 'Full details of custom AI Agent workflows...',
          icon_name: 'Cpu',
          is_published: true,
          is_featured: true,
          display_order: 0
        },
        {
          id: '22222222-2222-2222-2222-222222222222',
          title: 'API Integration',
          short_desc: 'Connect REST APIs, Webhooks, WhatsApp Business API, and structured data pipelines.',
          full_desc: 'Full details of API integrations...',
          icon_name: 'Briefcase',
          is_published: true,
          is_featured: true,
          display_order: 1
        },
        {
          id: '33333333-3333-3333-3333-333333333333',
          title: 'Data & Web Scraping',
          short_desc: 'Extract and parse web data into structured JSON or CSV format using BeautifulSoup.',
          full_desc: 'Full details of data extraction services...',
          icon_name: 'Terminal',
          is_published: true,
          is_featured: true,
          display_order: 2
        }
      ]);

      // 6. Delete and seed automations
      await supabase.from('automations').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('automations').insert([
        {
          id: 'a1111111-1111-1111-1111-111111111111',
          name: 'AI-Powered Social Media Automation',
          slug: 'social-media-automation',
          problem: 'Content publishing across multiple social channels takes hours of manual effort.',
          solution: 'Automated caption generation and media publishing across Facebook, Instagram, and LinkedIn.',
          description: 'Make.com · Python · AI · REST APIs',
          trigger_type: 'Schedule/Webhook',
          ai_model: 'Gemini / OpenAI',
          result: 'Instant cross-channel publishing',
          demo_url: 'https://make.com',
          is_published: true,
          is_featured: true
        },
        {
          id: 'a2222222-2222-2222-2222-222222222222',
          name: 'AI-Driven WhatsApp Order & Lead Capture',
          slug: 'whatsapp-order-lead-capture',
          problem: 'Unstructured customer chat leads require manual sorting and entry.',
          solution: 'Gemini AI extracts names, emails, and requirements into structured JSON and logs to CSV.',
          description: 'n8n · Gemini AI · WhatsApp Business API',
          trigger_type: 'WhatsApp Message',
          ai_model: 'Gemini AI',
          result: '100% automated lead logging',
          demo_url: 'https://n8n.io',
          is_published: true,
          is_featured: true
        }
      ]);

      // 7. Delete and seed projects
      await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      await supabase.from('projects').insert([
        {
          id: 'p1111111-1111-1111-1111-111111111111',
          title: 'AI-Powered Social Media Automation',
          slug: 'ai-powered-social-media-automation',
          short_desc: 'Built an end-to-end workflow to automate content publishing across Facebook, Instagram, and LinkedIn. Integrated AI-powered caption generation to create platform-specific content and developed web-fetching components to process image data from source URLs.',
          category: 'Make.com · Python · AI · REST APIs',
          github_url: 'https://github.com/saadsaed',
          live_url: 'https://github.com/saadsaed',
          is_published: true,
          is_featured: true,
          display_order: 0
        },
        {
          id: 'p2222222-2222-2222-2222-222222222222',
          title: 'AI-Driven WhatsApp Order & Lead Capture',
          slug: 'ai-driven-whatsapp-order-lead-capture',
          short_desc: 'Built an automated WhatsApp workflow for customer order and lead information capture. Integrated Gemini AI to extract names, contact details, order requirements, and converted info into structured JSON.',
          category: 'n8n · Gemini AI · WhatsApp Business API',
          github_url: 'https://github.com/saadsaed',
          live_url: 'https://github.com/saadsaed',
          is_published: true,
          is_featured: true,
          display_order: 1
        }
      ]);

      setSyncSuccess(true);
      fetchStats();
    } catch (err) {
      alert("Failed to sync CV details: " + err.message);
    } finally {
      setSyncing(false);
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getDashboardStats();
      setData(result);
    } catch (err) {
      setError("Unable to load dashboard metrics. Check your database connection.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col gap-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-neutral-200 rounded-lg" />
          ))}
        </div>
        <div className="h-64 bg-neutral-200 rounded-lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 flex flex-col items-center gap-4 text-center max-w-md mx-auto">
        <AlertCircle className="text-red-500" size={40} />
        <div>
          <h3 className="font-semibold text-red-900">Database Connection Failed</h3>
          <p className="text-sm text-red-700 mt-1">{error}</p>
        </div>
        <button
          onClick={fetchStats}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-md text-sm font-medium hover:bg-neutral-800 transition-colors"
        >
          <RefreshCw size={14} />
          Retry Connection
        </button>
      </div>
    );
  }

  const { stats, recent } = data;
  const isDatabaseEmpty = 
    stats.projects.total === 0 && 
    stats.services.total === 0 && 
    stats.automations.total === 0 && 
    stats.technologies.total === 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Sync CV Banner */}
      <div className="bg-neutral-900 text-white rounded-lg p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-neutral-800">
        <div className="flex flex-col gap-1">
          <h4 className="font-semibold text-lg">Portfolio CV Sync Tool</h4>
          <p className="text-sm text-neutral-400 max-w-xl">
            Updates site settings, biography, education, experience, services, and projects directly to the database.
          </p>
        </div>
        <button
          onClick={handleSyncCV}
          disabled={syncing}
          className="px-5 py-2.5 bg-white text-neutral-950 font-semibold rounded-md text-sm hover:bg-neutral-100 transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          {syncing ? 'Syncing...' : syncSuccess ? 'Sync Complete!' : 'Sync CV to Database'}
        </button>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projects */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Projects</span>
            <span className="text-2xl font-bold text-neutral-900">{stats.projects.total}</span>
            <span className="text-xs text-neutral-500">
              {stats.projects.published} Published &bull; {stats.projects.draft} Drafts
            </span>
          </div>
          <div className="p-3 bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-100">
            <FolderGit size={22} />
          </div>
        </div>

        {/* Services */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Services</span>
            <span className="text-2xl font-bold text-neutral-900">{stats.services.total}</span>
            <span className="text-xs text-neutral-500">
              {stats.services.published} Published
            </span>
          </div>
          <div className="p-3 bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-100">
            <Briefcase size={22} />
          </div>
        </div>

        {/* Automations */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Automations</span>
            <span className="text-2xl font-bold text-neutral-900">{stats.automations.total}</span>
            <span className="text-xs text-neutral-500">
              {stats.automations.published} Active Workflows
            </span>
          </div>
          <div className="p-3 bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-100">
            <Cpu size={22} />
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-white p-6 rounded-lg border border-neutral-200 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">Technologies</span>
            <span className="text-2xl font-bold text-neutral-900">{stats.technologies.total}</span>
            <span className="text-xs text-neutral-500">Global Tech Stack</span>
          </div>
          <div className="p-3 bg-neutral-50 text-neutral-600 rounded-lg border border-neutral-100">
            <Wrench size={22} />
          </div>
        </div>
      </div>

      {/* Database Empty State or Recent Activity */}
      {isDatabaseEmpty ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center flex flex-col items-center justify-center gap-4">
          <p className="text-neutral-500 max-w-sm">
            Your database tables are currently empty. Seed records or add items once individual CMS modules are implemented.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-neutral-200 p-6">
          <h3 className="font-semibold text-neutral-900 mb-4 text-sm uppercase tracking-wider text-neutral-400">
            Recent Activity
          </h3>
          {recent.length === 0 ? (
            <p className="text-sm text-neutral-500">No recent updates detected.</p>
          ) : (
            <div className="divide-y divide-neutral-100">
              {recent.map((item, idx) => (
                <div key={idx} className="py-3 flex justify-between items-center text-sm">
                  <div>
                    <span className="font-medium text-neutral-900">{item.title}</span>
                    <span className="ml-2 text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded-full">
                      {item.type}
                    </span>
                  </div>
                  <span className="text-xs text-neutral-500">
                    Updated {new Date(item.updated_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
