const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Read .env file
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
  console.error('.env file not found!');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf-8');
const urlMatch = envContent.match(/VITE_SUPABASE_URL=(.+)/);
const keyMatch = envContent.match(/VITE_SUPABASE_ANON_KEY=(.+)/);

if (!urlMatch || !keyMatch) {
  console.error('Failed to parse Supabase URL or Key from .env!');
  process.exit(1);
}

const supabaseUrl = urlMatch[1].trim();
const supabaseKey = keyMatch[1].trim();

console.log(`Connecting to Supabase at: ${supabaseUrl}`);
const supabase = createClient(supabaseUrl, supabaseKey);

async function runSeed() {
  try {
    // 1. Site Settings
    console.log('Upserting site settings...');
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
    console.log('Upserting homepage content...');
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
    console.log('Upserting about content...');
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
    console.log('Upserting contact info...');
    await supabase.from('contact_info').upsert({
      id: true,
      email: 'm.saadsaeed7223@gmail.com',
      whatsapp: '+923004668808',
      location: 'Lahore, Pakistan',
      contact_description: "Let's collaborate on building smart interfaces and automated pipelines. Drop me a line below.",
      cta_text: 'Get in touch'
    });

    // 5. Delete and seed services
    console.log('Upserting services...');
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
    console.log('Upserting automations...');
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
    console.log('Upserting projects...');
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

    console.log('Seeding completed successfully!');
  } catch (err) {
    console.error('Seeding failed:', err);
  }
}

runSeed();
