-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Updated At Trigger Function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-------------------------------------------------------------------------------
-- MEDIA
-------------------------------------------------------------------------------
CREATE TABLE media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    storage_path TEXT UNIQUE NOT NULL,
    file_name TEXT,
    mime_type TEXT,
    alt_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------
-- SINGLETONS
-------------------------------------------------------------------------------
-- Site Settings
CREATE TABLE site_settings (
    id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
    site_name TEXT DEFAULT 'Saad Saeed',
    default_title TEXT,
    default_meta_description TEXT,
    announcement_text TEXT,
    announcement_active BOOLEAN DEFAULT FALSE,
    availability_status TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_site_settings_modtime BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Homepage Content
CREATE TABLE homepage_content (
    id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
    hero_heading TEXT,
    hero_subtitle TEXT,
    hero_description TEXT,
    cta_1_label TEXT,
    cta_1_url TEXT,
    cta_2_label TEXT,
    cta_2_url TEXT,
    hero_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    intro_text TEXT,
    statistics JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE homepage_content ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_homepage_content_modtime BEFORE UPDATE ON homepage_content FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- About Content
CREATE TABLE about_content (
    id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
    biography TEXT,
    profile_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    location TEXT,
    education JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    stats JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE about_content ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_about_content_modtime BEFORE UPDATE ON about_content FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Contact Info
CREATE TABLE contact_info (
    id BOOLEAN PRIMARY KEY DEFAULT TRUE CHECK (id),
    email TEXT,
    whatsapp TEXT,
    location TEXT,
    contact_description TEXT,
    cta_text TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE contact_info ENABLE ROW LEVEL SECURITY;
CREATE TRIGGER update_contact_info_modtime BEFORE UPDATE ON contact_info FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-------------------------------------------------------------------------------
-- REPEATABLE CONTENT
-------------------------------------------------------------------------------
-- Services
CREATE TABLE services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    short_desc TEXT,
    full_desc TEXT,
    icon_name TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_services_order ON services(display_order);
CREATE TRIGGER update_services_modtime BEFORE UPDATE ON services FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Technologies
CREATE TABLE technologies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT,
    logo_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    description TEXT,
    url TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE technologies ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_technologies_order ON technologies(display_order);

-- Process Steps
CREATE TABLE process_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_process_steps_order ON process_steps(display_order);

-- Social Links
CREATE TABLE social_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    platform TEXT NOT NULL,
    url TEXT NOT NULL,
    label TEXT,
    icon_name TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE social_links ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_social_links_order ON social_links(display_order);

-------------------------------------------------------------------------------
-- PROJECTS
-------------------------------------------------------------------------------
CREATE TABLE projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    short_desc TEXT,
    full_desc TEXT,
    category TEXT,
    cover_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    github_url TEXT,
    live_url TEXT,
    project_type TEXT,
    problem TEXT,
    approach TEXT,
    solution TEXT,
    result TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_projects_slug ON projects(slug);
CREATE INDEX idx_projects_order ON projects(display_order);
CREATE TRIGGER update_projects_modtime BEFORE UPDATE ON projects FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Project Media (Gallery)
CREATE TABLE project_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    media_id UUID REFERENCES media(id) ON DELETE CASCADE,
    display_order INTEGER DEFAULT 0,
    UNIQUE(project_id, media_id)
);
ALTER TABLE project_media ENABLE ROW LEVEL SECURITY;

-- Project Technologies
CREATE TABLE project_technologies (
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (project_id, technology_id)
);
ALTER TABLE project_technologies ENABLE ROW LEVEL SECURITY;

-------------------------------------------------------------------------------
-- AUTOMATIONS
-------------------------------------------------------------------------------
CREATE TABLE automations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    problem TEXT,
    solution TEXT,
    description TEXT,
    workflow_media_id UUID REFERENCES media(id) ON DELETE SET NULL,
    trigger_type TEXT,
    ai_model TEXT,
    result TEXT,
    demo_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE automations ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_automations_slug ON automations(slug);
CREATE INDEX idx_automations_order ON automations(display_order);
CREATE TRIGGER update_automations_modtime BEFORE UPDATE ON automations FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Automation Steps
CREATE TABLE automation_steps (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    automation_id UUID REFERENCES automations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    tool TEXT,
    display_order INTEGER DEFAULT 0
);
ALTER TABLE automation_steps ENABLE ROW LEVEL SECURITY;

-- Automation Technologies
CREATE TABLE automation_technologies (
    automation_id UUID REFERENCES automations(id) ON DELETE CASCADE,
    technology_id UUID REFERENCES technologies(id) ON DELETE CASCADE,
    PRIMARY KEY (automation_id, technology_id)
);
ALTER TABLE automation_technologies ENABLE ROW LEVEL SECURITY;
