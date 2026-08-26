-- Seed Site Settings
INSERT INTO site_settings (id, site_name, default_title, default_meta_description, announcement_text, announcement_active, availability_status)
VALUES (true, 'Saad Saeed Portfolio', 'Saad Saeed | AI Developer', 'Portfolio of Saad Saeed, specialized in React, next.js, n8n and AI integration.', 'Open for new contract roles!', true, 'Available')
ON CONFLICT (id) DO UPDATE SET 
  site_name = EXCLUDED.site_name,
  default_title = EXCLUDED.default_title,
  default_meta_description = EXCLUDED.default_meta_description,
  announcement_text = EXCLUDED.announcement_text,
  announcement_active = EXCLUDED.announcement_active,
  availability_status = EXCLUDED.availability_status;

-- Seed Homepage Content
INSERT INTO homepage_content (id, hero_heading, hero_subtitle, hero_description, cta_1_label, cta_1_url, cta_2_label, cta_2_url, intro_text)
VALUES (true, 'Building Intelligent Systems & Modern Interfaces.', '01 / Introduction', 'I am a specialized developer automating workflows, deploying agents, and crafting custom React platforms. I bridge the gap between AI automation and high-end frontend systems.', 'Explore Work', '/work', 'Get in touch', '/contact', 'I build custom integrations that connect business applications directly to automated LLM reasoning loops.')
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
VALUES (true, 'I am Saad Saeed, a passionate software developer specializing in AI integrations, autonomous agent pipelines, and high-performance React frontends.', 'Lahore, Pakistan', '[{"degree": "BS Computer Science", "school": "FAST NUCES", "year": "2020-2024"}]'::jsonb, '[{"role": "AI Integration Engineer", "company": "Saasify", "year": "2024 - Present"}]'::jsonb, '[{"label": "Projects Completed", "value": "25+"}, {"label": "Workflows Automated", "value": "50+"}]'::jsonb)
ON CONFLICT (id) DO UPDATE SET 
  biography = EXCLUDED.biography,
  location = EXCLUDED.location,
  education = EXCLUDED.education,
  experience = EXCLUDED.experience,
  stats = EXCLUDED.stats;

-- Seed Contact Info
INSERT INTO contact_info (id, email, whatsapp, location, contact_description, cta_text)
VALUES (true, 'saad@example.com', '+923001234567', 'Lahore, Pakistan', 'Let''s collaborate on building smart interfaces and automated pipelines. Drop me a line below.', 'Get in touch')
ON CONFLICT (id) DO UPDATE SET 
  email = EXCLUDED.email,
  whatsapp = EXCLUDED.whatsapp,
  location = EXCLUDED.location,
  contact_description = EXCLUDED.contact_description,
  cta_text = EXCLUDED.cta_text;

-- Seed Services
INSERT INTO services (id, title, short_desc, full_desc, icon_name, is_published, is_featured, display_order)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'AI Agents & Workflows', 'Design autonomous pipelines connecting lead capturing systems to LLMs for auto-enrichment, qualification, and routing.', 'Full details of custom AI Agent workflows...', 'Cpu', true, true, 0),
  ('22222222-2222-2222-2222-222222222222', 'React & Web Development', 'Create fast, highly interactive user experiences styled with modern design tokens and cinematic page flow animations.', 'Full details of React & Frontend development...', 'Briefcase', true, true, 1)
ON CONFLICT (id) DO NOTHING;

-- Seed Automations
INSERT INTO automations (id, name, slug, problem, solution, description, trigger_type, ai_model, result, demo_url, is_published, is_featured)
VALUES 
  ('33333333-3333-3333-3333-333333333333', 'Lead Extraction Workflow', 'lead-extraction', 'Manual lead verification takes hours.', 'LLM agents qualify and clean leads in seconds.', 'Automates data enrichment from webhooks.', 'Webhook', 'GPT-4o', '99% speedup.', 'https://n8n.io', true, true)
ON CONFLICT (id) DO NOTHING;

-- Seed Technologies
INSERT INTO technologies (id, name, category, description, url, is_featured, display_order)
VALUES 
  ('44444444-4444-4444-4444-444444444444', 'React', 'Frontend', 'Modern components and hook architectures.', 'https://react.dev', true, 0),
  ('55555555-5555-5555-5555-555555555555', 'Supabase', 'Backend', 'BaaS for user management and SQL database.', 'https://supabase.com', true, 1),
  ('66666666-6666-6666-6666-666666666666', 'Framer Motion', 'Frontend', 'Cinematic layout animations.', 'https://framer.com/motion', false, 2)
ON CONFLICT (id) DO NOTHING;

-- Seed Process Steps
INSERT INTO process_steps (id, title, description, is_published, display_order)
VALUES 
  ('77777777-7777-7777-7777-777777777777', 'Discovery & Plan', 'Analyze workflows and build the technical blueprint.', true, 0),
  ('88888888-8888-8888-8888-888888888888', 'Agile Implementation', 'Continuous integration of frontends and API hooks.', true, 1)
ON CONFLICT (id) DO NOTHING;

-- Assign Admin Role to mrinoxent7223@gmail.com
INSERT INTO admin_users (user_id)
SELECT id FROM auth.users WHERE email = 'mrinoxent7223@gmail.com'
ON CONFLICT (user_id) DO NOTHING;

