import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isMockMode = !supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co';

let client;

if (isMockMode) {
  console.warn('Supabase env variables missing. Running in Mock Mode for testing.');
  
  const authListeners = new Set();
  let currentUser = JSON.parse(localStorage.getItem('mock_user') || 'null');

  const triggerAuthChange = (event, session) => {
    authListeners.forEach(cb => cb(event, session));
  };

  client = {
    auth: {
      getSession: async () => {
        const session = currentUser ? { user: currentUser } : null;
        return { data: { session }, error: null };
      },
      onAuthStateChange: (callback) => {
        authListeners.add(callback);
        const session = currentUser ? { user: currentUser } : null;
        callback('INITIAL_SESSION', session);
        return {
          data: {
            subscription: {
              unsubscribe: () => authListeners.delete(callback),
            },
          },
        };
      },
      signInWithPassword: async ({ email, password }) => {
        if (email && password) {
          const user = { id: 'mock-user-id', email };
          currentUser = user;
          localStorage.setItem('mock_user', JSON.stringify(user));
          triggerAuthChange('SIGNED_IN', { user });
          return { data: { user, session: { user } }, error: null };
        }
        return { data: { user: null, session: null }, error: { message: 'Invalid email or password' } };
      },
      signOut: async () => {
        currentUser = null;
        localStorage.removeItem('mock_user');
        triggerAuthChange('SIGNED_OUT', null);
        return { error: null };
      },
    },
    from: (table) => {
      const getTableData = () => {
        const stored = localStorage.getItem(`mock_db_${table}`);
        if (stored) return JSON.parse(stored);

        let defaults = [];
        if (table === 'projects') {
          defaults = [
            { 
              id: 'p1111111-1111-1111-1111-111111111111', 
              title: 'AI-Powered Social Media Automation', 
              slug: 'ai-powered-social-media-automation',
              short_desc: 'End-to-end automated pipeline to generate, format, schedule, and publish platform-specific content across multiple social media networks.', 
              full_desc: 'Automated content publishing across Facebook, Instagram, and LinkedIn. Integrated AI-powered caption generation tailored for platform-specific tone and style. Built a web-fetching pipeline to retrieve, parse, and process image assets from source URLs.',
              category: 'Make.com · Python · AI · REST APIs',
              github_url: 'https://github.com/saadsaed',
              live_url: 'https://github.com/saadsaed',
              is_published: true, 
              is_featured: true,
              updated_at: new Date().toISOString() 
            },
            { 
              id: 'p2222222-2222-2222-2222-222222222222', 
              title: 'AI-Driven WhatsApp Order & Lead Capture', 
              slug: 'ai-driven-whatsapp-order-lead-capture',
              short_desc: 'Intelligent conversational capture system that parses unstructured customer messages into structured business data.', 
              full_desc: 'Engineered an automated WhatsApp workflow for customer order capture and lead intake. Leveraged Gemini AI to extract customer names, contact info, and order requirements from natural language messages. Transformed unstructured customer replies into validated, strict JSON payloads.',
              category: 'n8n · Gemini AI · WhatsApp Business API · CSV/JSON',
              github_url: 'https://github.com/saadsaed',
              live_url: 'https://github.com/saadsaed',
              is_published: true, 
              is_featured: true,
              updated_at: new Date().toISOString() 
            },
          ];
        } else if (table === 'homepage_content') {
          defaults = [
            {
              id: true,
              hero_heading: 'AI AUTOMATION & WORKFLOW DEVELOPER',
              hero_subtitle: '01 / Introduction',
              hero_description: 'Computer Science student specializing in AI automation, workflow orchestration, API integration, and Python scripting. Experienced in building automated pipelines with n8n, Make.com, Gemini AI, and REST APIs.',
              cta_1_label: 'View Projects',
              cta_1_url: '#projects',
              cta_2_label: 'Download CV',
              cta_2_url: '/Saad_Saeed_CV.pdf',
              intro_text: 'Computer Science student specializing in AI automation, workflow orchestration, API integration, and Python scripting.',
              statistics: [],
              updated_at: new Date().toISOString()
            }
          ];
        } else if (table === 'about_content') {
          defaults = [
            {
              id: true,
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
              ],
              updated_at: new Date().toISOString()
            }
          ];
        } else if (table === 'contact_info') {
          defaults = [
            {
              id: true,
              email: 'm.saadsaeed7223@gmail.com',
              whatsapp: '+92 300 4668808',
              location: 'Lahore, Pakistan',
              contact_description: 'Let\'s collaborate on building smart interfaces and automated pipelines. Drop me a line below.',
              cta_text: 'Contact Me',
              updated_at: new Date().toISOString()
            }
          ];
        } else if (table === 'services') {
          defaults = [
            { id: '1', title: 'Automation & AI', short_desc: 'n8n, Make.com, Gemini AI', full_desc: 'End-to-end automated pipelines and AI integrations.', icon_name: 'Cpu', is_published: true, is_featured: true, display_order: 0, updated_at: new Date().toISOString() },
            { id: '2', title: 'APIs & Integration', short_desc: 'REST APIs, Webhooks, WhatsApp Business API, Postman', full_desc: 'Seamless integrations and webhook orchestration.', icon_name: 'Briefcase', is_published: true, is_featured: true, display_order: 1, updated_at: new Date().toISOString() },
            { id: '3', title: 'Data & Web Scraping', short_desc: 'BeautifulSoup, JSON, CSV, Web Scraping', full_desc: 'Automated data extraction and structured data parsing.', icon_name: 'Terminal', is_published: true, is_featured: true, display_order: 2, updated_at: new Date().toISOString() },
          ];
        } else if (table === 'automations') {
          defaults = [
            { id: 'a1111111-1111-1111-1111-111111111111', name: 'AI-Powered Social Media Automation', slug: 'ai-powered-social-media-automation', problem: 'Manual content creation and cross-channel posting is tedious and slow.', solution: 'End-to-end automated pipeline to generate, format, schedule, and publish platform-specific content across multiple social media networks.', description: 'Make.com · Python · AI · REST APIs', ai_model: 'Gemini AI Engine', result: 'Automated cross-platform publishing & AI captions', demo_url: 'https://github.com/saadsaed', is_published: true, is_featured: true, updated_at: new Date().toISOString() },
            { id: 'a2222222-2222-2222-2222-222222222222', name: 'AI-Driven WhatsApp Order & Lead Capture', slug: 'ai-driven-whatsapp-order-lead-capture', problem: 'Unstructured customer chat leads require manual sorting and data entry.', solution: 'Intelligent conversational capture system that parses unstructured customer messages into structured business data.', description: 'n8n · Gemini AI · WhatsApp Business API · CSV/JSON', ai_model: 'Gemini AI', result: 'Validated strict JSON & automated CSV sync', demo_url: 'https://github.com/saadsaed', is_published: true, is_featured: true, updated_at: new Date().toISOString() },
          ];
        } else if (table === 'technologies') {
          defaults = [
            { id: '1', name: 'n8n', category: 'Automation & AI', description: 'Workflow orchestration engine.', url: 'https://n8n.io', is_featured: true, display_order: 0 },
            { id: '2', name: 'Make.com', category: 'Automation & AI', description: 'Visual automation platform.', url: 'https://make.com', is_featured: true, display_order: 1 },
            { id: '3', name: 'Gemini AI', category: 'Automation & AI', description: 'LLM prompt engine and structured extraction.', url: 'https://ai.google.dev', is_featured: true, display_order: 2 },
            { id: '4', name: 'Python', category: 'Programming & Databases', description: 'Web scraping and custom automation scripts.', url: 'https://python.org', is_featured: true, display_order: 3 },
            { id: '5', name: 'REST APIs', category: 'APIs & Integration', description: 'Webhooks and API communication.', url: 'https://postman.com', is_featured: true, display_order: 4 }
          ];
        } else if (table === 'process_steps') {
          defaults = [
            { id: '1', title: 'Discovery & Plan', description: 'Analyze workflows and build technical blueprints.', is_published: true, display_order: 0 },
            { id: '2', title: 'Agile Implementation', description: 'Continuous integration of frontends and API hooks.', is_published: true, display_order: 1 }
          ];
        } else if (table === 'site_settings') {
          defaults = [
            { id: true, site_name: 'Saad Saeed Portfolio', default_title: 'Saad Saeed | AI Automation & Workflow Developer', default_meta_description: 'Portfolio of Saad Saeed, an AI Automation & Workflow Developer specializing in n8n, Make.com, Gemini AI, Python scripting, and API integrations.', announcement_text: 'Open for entry-level & internship roles!', announcement_active: true, availability_status: 'Available', updated_at: new Date().toISOString() }
          ];
        } else if (table === 'media') {
          defaults = [
            { id: '1', file_name: 'profile-picture.jpg', storage_path: 'uploads/profile-picture.jpg', mime_type: 'image/jpeg', alt_text: 'Saad Profile Picture', created_at: new Date().toISOString() },
            { id: '2', file_name: 'Saad_Saeed_CV.pdf', storage_path: 'documents/Saad_Saeed_CV.pdf', mime_type: 'application/pdf', alt_text: 'Saad Saeed CV', created_at: new Date().toISOString() }
          ];
        }
        localStorage.setItem(`mock_db_${table}`, JSON.stringify(defaults));
        return defaults;
      };

      const setTableData = (data) => {
        localStorage.setItem(`mock_db_${table}`, JSON.stringify(data));
      };

      let filterField = null;
      let filterValue = null;
      let isSingle = false;

      const executeQuery = () => {
        const data = getTableData();
        let resultData = data;
        if (filterField !== null) {
          resultData = data.filter(item => item[filterField] === filterValue);
        }
        if (isSingle) {
          return { data: resultData[0] || null, error: null };
        }
        return { data: resultData, error: null };
      };

      const queryBuilder = {
        select: (columns, options) => {
          if (options && options.count === 'exact') {
            const data = getTableData();
            return Promise.resolve({
              data,
              count: data.length,
              error: null,
            });
          }
          return queryBuilder;
        },
        eq: (field, val) => {
          filterField = field;
          filterValue = val;
          return queryBuilder;
        },
        single: () => {
          isSingle = true;
          return queryBuilder;
        },
        order: (col, opts) => queryBuilder,
        limit: (lim) => {
          const data = getTableData();
          return Promise.resolve({
            data: data.slice(0, lim),
            error: null,
          });
        },
        insert: (rows) => {
          const data = getTableData();
          const newRows = Array.isArray(rows) ? rows : [rows];
          const rowsWithIds = newRows.map(row => ({
            id: row.id || Math.random().toString(36).substring(2, 15),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            ...row
          }));
          data.push(...rowsWithIds);
          setTableData(data);
          return Promise.resolve({ data: rowsWithIds, error: null });
        },
        update: (updates) => {
          return {
            eq: (field, val) => {
              const data = getTableData();
              let updatedRows = [];
              const updatedData = data.map(row => {
                if (row[field] === val) {
                  const updatedRow = { ...row, ...updates, updated_at: new Date().toISOString() };
                  updatedRows.push(updatedRow);
                  return updatedRow;
                }
                return row;
              });
              setTableData(updatedData);
              return Promise.resolve({ data: updatedRows, error: null });
            }
          };
        },
        delete: () => {
          return {
            eq: (field, val) => {
              const data = getTableData();
              const remaining = data.filter(row => row[field] !== val);
              setTableData(remaining);
              return Promise.resolve({ error: null });
            }
          };
        },
        then: (onfulfilled, onrejected) => {
          return Promise.resolve(executeQuery()).then(onfulfilled, onrejected);
        }
      };

      return queryBuilder;
    },
    storage: {
      from: (bucket) => ({
        upload: async (path, file) => {
          await new Promise(resolve => setTimeout(resolve, 500));
          return { data: { path }, error: null };
        },
        getPublicUrl: (path) => {
          let url = 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800';
          if (path.includes('profile')) {
            url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500';
          }
          return { data: { publicUrl: url } };
        }
      })
    }
  };
} else {
  client = createClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = client;

