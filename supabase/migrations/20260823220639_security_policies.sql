-- 1. Admin Authorization Table
CREATE TABLE admin_users (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Secure the admin_users table itself
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view admin_users" ON admin_users FOR SELECT USING (user_id = auth.uid());
-- Only service role or direct DB access should insert into admin_users initially.

-- 2. Storage Setup (Supabase storage schema needs to exist, usually does by default)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('media', 'media', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Public can view media" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'media');

CREATE POLICY "Admin full access to media" 
ON storage.objects FOR ALL 
USING (bucket_id = 'media' AND EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 3. RLS Policies for Singletons (Public read unconditionally, Admin full access)
CREATE POLICY "Public can read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Admin full access site_settings" ON site_settings FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Public can read homepage_content" ON homepage_content FOR SELECT USING (true);
CREATE POLICY "Admin full access homepage_content" ON homepage_content FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Public can read about_content" ON about_content FOR SELECT USING (true);
CREATE POLICY "Admin full access about_content" ON about_content FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Public can read contact_info" ON contact_info FOR SELECT USING (true);
CREATE POLICY "Admin full access contact_info" ON contact_info FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 4. RLS Policies for Media Metadata Table (Public read, Admin full access)
CREATE POLICY "Public can read media metadata" ON media FOR SELECT USING (true);
CREATE POLICY "Admin full access media metadata" ON media FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 5. RLS Policies for Repeatable Content (Public read if is_published=true, Admin full access)
CREATE POLICY "Public can read published services" ON services FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access services" ON services FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Public can read published projects" ON projects FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access projects" ON projects FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Public can read published automations" ON automations FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access automations" ON automations FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Public can read published process_steps" ON process_steps FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access process_steps" ON process_steps FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Public can read published social_links" ON social_links FOR SELECT USING (is_published = true);
CREATE POLICY "Admin full access social_links" ON social_links FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

-- 6. RLS Policies for Dependencies/Junctions without explicit is_published 
-- (Assuming if it's referenced by public content, public can read it)
CREATE POLICY "Public can read technologies" ON technologies FOR SELECT USING (true);
CREATE POLICY "Admin full access technologies" ON technologies FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Public can read project_media" ON project_media FOR SELECT USING (true);
CREATE POLICY "Admin full access project_media" ON project_media FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Public can read project_technologies" ON project_technologies FOR SELECT USING (true);
CREATE POLICY "Admin full access project_technologies" ON project_technologies FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Public can read automation_steps" ON automation_steps FOR SELECT USING (true);
CREATE POLICY "Admin full access automation_steps" ON automation_steps FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Public can read automation_technologies" ON automation_technologies FOR SELECT USING (true);
CREATE POLICY "Admin full access automation_technologies" ON automation_technologies FOR ALL USING (EXISTS (SELECT 1 FROM admin_users WHERE user_id = auth.uid()));
