-- Seed Site Settings
INSERT INTO site_settings (id, site_name, default_title, default_meta_description, announcement_text, announcement_active, availability_status)
VALUES (true, 'Saad Saeed Portfolio', 'Saad Saeed | AI Automation & Workflow Developer', 'Portfolio of Saad Saeed, an AI Automation & Workflow Developer specializing in n8n, Make.com, Gemini AI, Python scripting, and API integrations.', 'Available for entry-level and internship roles!', true, 'Available')
ON CONFLICT (id) DO UPDATE SET 
  site_name = EXCLUDED.site_name,
  default_title = EXCLUDED.default_title,
  default_meta_description = EXCLUDED.default_meta_description,
  announcement_text = EXCLUDED.announcement_text,
  announcement_active = EXCLUDED.announcement_active,
  availability_status = EXCLUDED.availability_status;

-- Seed Homepage Content
INSERT INTO homepage_content (id, hero_heading, hero_subtitle, hero_description, cta_1_label, cta_1_url, cta_2_label, cta_2_url, intro_text)
VALUES (true, 'AI AUTOMATION & WORKFLOW DEVELOPER', '01 / Introduction', 'Computer Science student specializing in AI automation, workflow orchestration, API integration, and Python scripting. Experienced in building automated pipelines with n8n, Make.com, Gemini AI, and REST APIs.', 'View Projects', '#projects', 'Download CV', '/Saad_Saeed_CV.pdf', 'Computer Science student specializing in AI automation, workflow orchestration, API integration, and Python scripting.')
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
VALUES (true, 'Computer Science student specializing in AI automation, workflow orchestration, API integration, and Python scripting. Experienced in building automated pipelines with n8n, Make.com, Gemini AI, and REST APIs.', 'Lahore, Pakistan', '[{"degree": "Bachelor of Science in Computer Science (BSCS)", "school": "The Superior University", "year": "2023 - Present"}]'::jsonb, '[{"role": "AI Automation & Workflow Developer", "company": "Freelance / Projects", "year": "2023 - Present"}]'::jsonb, '[{"label": "Projects Completed", "value": "10+"}, {"label": "Automations Built", "value": "25+"}, {"label": "APIs Integrated", "value": "15+"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  biography = EXCLUDED.biography,
  location = EXCLUDED.location,
  education = EXCLUDED.education,
  experience = EXCLUDED.experience,
  stats = EXCLUDED.stats;

-- Seed Contact Info
INSERT INTO contact_info (id, email, whatsapp, location, contact_description, cta_text)
VALUES (true, 'm.saadsaeed7223@gmail.com', '+92 300 4668808', 'Lahore, Pakistan', 'Let''s collaborate on building smart interfaces and automated pipelines. Drop me a line below.', 'Contact Me')
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
  ('11111111-1111-1111-1111-111111111111', 'Automation & AI', 'n8n, Make.com, Gemini AI', 'End-to-end automated pipelines and AI integrations.', 'Cpu', true, true, 0),
  ('22222222-2222-2222-2222-222222222222', 'APIs & Integration', 'REST APIs, Webhooks, WhatsApp Business API, Postman', 'Seamless integrations and webhook orchestration.', 'Briefcase', true, true, 1),
  ('33333333-3333-3333-3333-333333333333', 'Data & Web Scraping', 'BeautifulSoup, JSON, CSV, Web Scraping', 'Automated data extraction and structured data parsing.', 'Terminal', true, true, 2)
ON CONFLICT (id) DO NOTHING;

-- Delete old automations to prevent duplicates
DELETE FROM automations;

-- Seed Automations
INSERT INTO automations (id, name, slug, problem, solution, description, trigger_type, ai_model, result, demo_url, is_published, is_featured)
VALUES 
  ('a1111111-1111-1111-1111-111111111111', 'AI-Powered Social Media Automation', 'ai-powered-social-media-automation', 'Manual content creation and cross-channel posting is tedious and slow.', 'End-to-end automated pipeline to generate, format, schedule, and publish platform-specific content across multiple social media networks.', 'Make.com · Python · AI · REST APIs', 'Schedule/Webhook', 'Gemini AI Engine', 'Automated cross-platform publishing & AI captions', 'https://github.com/saadsaed', true, true),
  ('a2222222-2222-2222-2222-222222222222', 'AI-Driven WhatsApp Order & Lead Capture', 'ai-driven-whatsapp-order-lead-capture', 'Unstructured customer chat leads require manual sorting and data entry.', 'Intelligent conversational capture system that parses unstructured customer messages into structured business data.', 'n8n · Gemini AI · WhatsApp Business API · CSV/JSON', 'WhatsApp Message', 'Gemini AI', 'Validated strict JSON & automated CSV sync', 'https://github.com/saadsaed', true, true)
ON CONFLICT (id) DO NOTHING;

-- Delete old projects to prevent duplicates
DELETE FROM projects;

-- Seed Projects
INSERT INTO projects (id, title, slug, short_desc, category, github_url, live_url, is_published, is_featured, display_order)
VALUES 
  ('p1111111-1111-1111-1111-111111111111', 'AI-Powered Social Media Automation', 'ai-powered-social-media-automation', 'End-to-end automated pipeline to generate, format, schedule, and publish platform-specific content across multiple social media networks.', 'Make.com · Python · AI · REST APIs', 'https://github.com/saadsaed', 'https://github.com/saadsaed', true, true, 0),
  ('p2222222-2222-2222-2222-222222222222', 'AI-Driven WhatsApp Order & Lead Capture', 'ai-driven-whatsapp-order-lead-capture', 'Intelligent conversational capture system that parses unstructured customer messages into structured business data.', 'n8n · Gemini AI · WhatsApp Business API · CSV/JSON', 'https://github.com/saadsaed', 'https://github.com/saadsaed', true, true, 1)
ON CONFLICT (id) DO NOTHING;

