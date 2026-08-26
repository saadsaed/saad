-- Seed Site Settings
INSERT INTO site_settings (id, site_name, default_title, default_meta_description, announcement_text, announcement_active, availability_status)
VALUES (true, 'Saad Saeed Portfolio', 'Saad Saeed | AI Automation & Workflow Developer', 'Portfolio of Saad Saeed, specialized in AI Automation, n8n, Make.com, and Python integrations.', 'Available for entry-level and internship roles!', true, 'Available')
ON CONFLICT (id) DO UPDATE SET 
  site_name = EXCLUDED.site_name,
  default_title = EXCLUDED.default_title,
  default_meta_description = EXCLUDED.default_meta_description,
  announcement_text = EXCLUDED.announcement_text,
  announcement_active = EXCLUDED.announcement_active,
  availability_status = EXCLUDED.availability_status;

-- Seed Homepage Content
INSERT INTO homepage_content (id, hero_heading, hero_subtitle, hero_description, cta_1_label, cta_1_url, cta_2_label, cta_2_url, intro_text)
VALUES (true, 'AI AUTOMATION & WORKFLOW DEVELOPER', '01 / Introduction', 'Computer Science student with hands-on project experience in AI automation, workflow development, API integration, and Python scripting. Seeking an entry-level or internship opportunity in AI Automation, Python Automation, or Workflow Automation.', 'Explore Work', '/work', 'Get in touch', '/contact', 'I design and build autonomous pipelines connecting webhooks, APIs, and LLMs for auto-enrichment, qualification, and routing.')
ON CONFLICT (id) DO UPDATE SET 
  hero_heading = EXCLUDED.hero_heading,
  hero_subtitle = EXCLUDED.hero_subtitle,
  hero_description = EXCLUDED.hero_description,
  cta_1_label = EXCLUDED.cta_1_label,
  cta_1_url = EXCLUDED.cta_1_url,
  cta_2_label = EXCLUDED.cta_2_label,
  cta_2_url = EXCLUDED.cta_2_url,
  intro_text = EXCLUDED.intro_text;

-- Seed About Content
INSERT INTO about_content (id, biography, location, education, experience, stats)
VALUES (true, 'Computer Science student with hands-on project experience in AI automation, workflow development, API integration, and Python scripting. Built end-to-end automation projects using Make.com, n8n, Gemini AI, WhatsApp Business API, and REST APIs. Experienced in web scraping, AI-based data extraction, content automation, and structured data handling. Seeking an entry-level or internship opportunity in AI Automation, Python Automation, or Workflow Automation.', 'Lahore, Pakistan', '[{"degree": "BS Computer Science", "school": "THE SUPERIOR UNIVERSITY", "year": "2023 – PRESENT"}]'::jsonb, '[{"role": "AI Automation & Workflow Developer", "company": "Freelance / Projects", "year": "2023 - Present"}]'::jsonb, '[{"label": "Projects Completed", "value": "10+"}, {"label": "Automations Built", "value": "25+"}, {"label": "APIs Integrated", "value": "15+"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  biography = EXCLUDED.biography,
  location = EXCLUDED.location,
  education = EXCLUDED.education,
  experience = EXCLUDED.experience,
  stats = EXCLUDED.stats;

-- Seed Contact Info
INSERT INTO contact_info (id, email, whatsapp, location, contact_description, cta_text)
VALUES (true, 'm.saadsaeed7223@gmail.com', '+923004668808', 'Lahore, Pakistan', 'Let''s collaborate on building smart interfaces and automated pipelines. Drop me a line below.', 'Get in touch')
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  location = EXCLUDED.location,
  contact_description = EXCLUDED.contact_description,
  cta_text = EXCLUDED.cta_text;

-- Delete old services to prevent duplicates
DELETE FROM services;

-- Seed Services
INSERT INTO services (id, title, short_desc, full_desc, icon_name, is_published, is_featured, display_order)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'AI Automation & Workflows', 'Design autonomous pipelines connecting lead capturing systems to LLMs using n8n and Make.com.', 'Full details of custom AI Agent workflows...', 'Cpu', true, true, 0),
  ('22222222-2222-2222-2222-222222222222', 'API Integration', 'Connect REST APIs, Webhooks, WhatsApp Business API, and structured data pipelines.', 'Full details of API integrations...', 'Briefcase', true, true, 1),
  ('33333333-3333-3333-3333-333333333333', 'Data & Web Scraping', 'Extract and parse web data into structured JSON or CSV format using BeautifulSoup.', 'Full details of data extraction services...', 'Terminal', true, true, 2)
ON CONFLICT (id) DO NOTHING;

-- Delete old automations to prevent duplicates
DELETE FROM automations;

-- Seed Automations
INSERT INTO automations (id, name, slug, problem, solution, description, trigger_type, ai_model, result, demo_url, is_published, is_featured)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 'AI-Powered Social Media Automation', 'social-media-automation', 'Content publishing across multiple social channels takes hours of manual effort.', 'Automated caption generation and media publishing across Facebook, Instagram, and LinkedIn.', 'Make.com · Python · AI · REST APIs', 'Schedule/Webhook', 'Gemini / OpenAI', 'Instant cross-channel publishing', 'https://make.com', true, true),
  ('a2222222-2222-2222-2222-222222222222', 'AI-Driven WhatsApp Order & Lead Capture', 'whatsapp-order-lead-capture', 'Unstructured customer chat leads require manual sorting and entry.', 'Gemini AI extracts names, emails, and requirements into structured JSON and logs to CSV.', 'n8n · Gemini AI · WhatsApp Business API', 'WhatsApp Message', 'Gemini AI', '100% automated lead logging', 'https://n8n.io', true, true)
ON CONFLICT (id) DO NOTHING;

-- Delete old projects to prevent duplicates
DELETE FROM projects;

-- Seed Projects
INSERT INTO projects (id, title, slug, short_desc, category, github_url, live_url, is_published, is_featured, display_order)
VALUES 
  ('p1111111-1111-1111-1111-111111111111', 'AI-Powered Social Media Automation', 'ai-powered-social-media-automation', 'Built an end-to-end workflow to automate content publishing across Facebook, Instagram, and LinkedIn. Integrated AI-powered caption generation to create platform-specific content and developed web-fetching components to process image data from source URLs.', 'Make.com · Python · AI · REST APIs', 'https://github.com/saadsaed', 'https://github.com/saadsaed', true, true, 0),
  ('p2222222-2222-2222-2222-222222222222', 'AI-Driven WhatsApp Order & Lead Capture', 'ai-driven-whatsapp-order-lead-capture', 'Built an automated WhatsApp workflow for customer order and lead information capture. Integrated Gemini AI to extract names, contact details, order requirements, and converted info into structured JSON.', 'n8n · Gemini AI · WhatsApp Business API', 'https://github.com/saadsaed', 'https://github.com/saadsaed', true, true, 1)
ON CONFLICT (id) DO NOTHING;
