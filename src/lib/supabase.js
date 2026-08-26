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
              id: '1', 
              title: 'Saad Portfolio Website', 
              slug: 'saad-portfolio',
              short_desc: 'Cinematic portfolio built with React and TailwindCSS', 
              full_desc: 'This is the comprehensive description of Saad\'s Portfolio site built with Vite, React, and CSS variables for theming.',
              category: 'React & Frontend',
              github_url: 'https://github.com/saadsaeed/portfolio',
              live_url: 'https://saadsaeed.com',
              is_published: true, 
              is_featured: true,
              updated_at: new Date().toISOString() 
            },
            { 
              id: '2', 
              title: 'Automated CRM Sync', 
              slug: 'crm-sync',
              short_desc: 'Automates lead enrichment and routing into HubSpot', 
              full_desc: 'An automated flow connecting web forms, running the data through GPT-4, and updating CRM records.',
              category: 'AI & Automation',
              github_url: 'https://github.com/saadsaeed/crm-sync',
              live_url: '',
              is_published: true, 
              is_featured: true,
              updated_at: new Date().toISOString() 
            },
            { 
              id: '3', 
              title: 'Vite Boilerplate', 
              slug: 'vite-boilerplate',
              short_desc: 'A robust template for kickstarting react apps.', 
              full_desc: 'Clean configuration of tailwindcss, react-router, and hooks.',
              category: 'Boilerplate',
              github_url: 'https://github.com/saadsaeed/vite-boilerplate',
              live_url: '',
              is_published: false, 
              is_featured: false,
              updated_at: new Date().toISOString() 
            },
          ];
        } else if (table === 'homepage_content') {
          defaults = [
            {
              id: true,
              hero_heading: 'Building Intelligent Systems & Modern Interfaces.',
              hero_subtitle: '01 / Introduction',
              hero_description: 'I am a specialized developer automating workflows, deploying agents, and crafting custom React platforms. I bridge the gap between AI automation and high-end frontend systems.',
              cta_1_label: 'Explore Work',
              cta_1_url: '/work',
              cta_2_label: 'Get in touch',
              cta_2_url: '/contact',
              intro_text: 'I build custom integrations that connect business applications directly to automated LLM reasoning loops.',
              statistics: [],
              updated_at: new Date().toISOString()
            }
          ];
        } else if (table === 'about_content') {
          defaults = [
            {
              id: true,
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
              ],
              updated_at: new Date().toISOString()
            }
          ];
        } else if (table === 'contact_info') {
          defaults = [
            {
              id: true,
              email: 'saad@example.com',
              whatsapp: '+923001234567',
              location: 'Lahore, Pakistan',
              contact_description: 'Let\'s collaborate on building smart interfaces and automated pipelines. Drop me a line below.',
              cta_text: 'Get in touch',
              updated_at: new Date().toISOString()
            }
          ];
        } else if (table === 'services') {
          defaults = [
            { id: '1', title: 'AI Agents & Workflows', short_desc: 'Design autonomous pipelines connecting lead capturing systems to LLMs for auto-enrichment, qualification, and routing.', full_desc: 'Full details of custom AI Agent workflows...', icon_name: 'Cpu', is_published: true, is_featured: true, display_order: 0, updated_at: new Date().toISOString() },
            { id: '2', title: 'React & Web Development', short_desc: 'Create fast, highly interactive user experiences styled with modern design tokens and cinematic page flow animations.', full_desc: 'Full details of React & Frontend development...', icon_name: 'Briefcase', is_published: true, is_featured: true, display_order: 1, updated_at: new Date().toISOString() },
          ];
        } else if (table === 'automations') {
          defaults = [
            { id: '1', name: 'Lead Extraction Workflow', slug: 'lead-extraction', problem: 'Manual lead verification takes hours.', solution: 'LLM agents qualify and clean leads in seconds.', description: 'Automates data enrichment from webhooks.', ai_model: 'GPT-4o', result: '99% speedup.', demo_url: 'https://n8n.io', is_published: true, is_featured: true, updated_at: new Date().toISOString() },
          ];
        } else if (table === 'technologies') {
          defaults = [
            { id: '1', name: 'React', category: 'Frontend', description: 'Modern components and hook architectures.', url: 'https://react.dev', is_featured: true, display_order: 0 },
            { id: '2', name: 'Supabase', category: 'Backend', description: 'BaaS for user management and SQL database.', url: 'https://supabase.com', is_featured: true, display_order: 1 },
            { id: '3', name: 'Framer Motion', category: 'Frontend', description: 'Cinematic layout animations.', url: 'https://framer.com/motion', is_featured: false, display_order: 2 }
          ];
        } else if (table === 'process_steps') {
          defaults = [
            { id: '1', title: 'Discovery & Plan', description: 'Analyze workflows and build the technical blueprint.', is_published: true, display_order: 0 },
            { id: '2', title: 'Agile Implementation', description: 'Continuous integration of frontends and API hooks.', is_published: true, display_order: 1 }
          ];
        } else if (table === 'site_settings') {
          defaults = [
            { id: true, site_name: 'Saad Saeed Portfolio', default_title: 'Saad Saeed | AI Developer', default_meta_description: 'Portfolio of Saad Saeed, specialized in React, next.js, n8n and AI integration.', announcement_text: 'Open for new contract roles!', announcement_active: true, availability_status: 'Available', updated_at: new Date().toISOString() }
          ];
        } else if (table === 'media') {
          defaults = [
            { id: '1', file_name: 'profile-picture.jpg', storage_path: 'uploads/profile-picture.jpg', mime_type: 'image/jpeg', alt_text: 'Saad Profile Picture', created_at: new Date().toISOString() },
            { id: '2', file_name: 'resume.pdf', storage_path: 'documents/resume.pdf', mime_type: 'application/pdf', alt_text: 'Saad Saeed CV', created_at: new Date().toISOString() }
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

