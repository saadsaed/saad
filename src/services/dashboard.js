import { supabase } from '../lib/supabase';

export async function getDashboardStats() {
  try {
    // Execute count queries in parallel
    const [projectsRes, servicesRes, automationsRes, techRes] = await Promise.all([
      supabase.from('projects').select('id, is_published', { count: 'exact' }),
      supabase.from('services').select('id, is_published', { count: 'exact' }),
      supabase.from('automations').select('id, is_published', { count: 'exact' }),
      supabase.from('technologies').select('id', { count: 'exact' })
    ]);

    // Handle initial network or RLS errors
    if (projectsRes.error) throw projectsRes.error;
    if (servicesRes.error) throw servicesRes.error;
    if (automationsRes.error) throw automationsRes.error;
    if (techRes.error) throw techRes.error;

    const projects = projectsRes.data || [];
    const services = servicesRes.data || [];
    const automations = automationsRes.data || [];

    const stats = {
      projects: {
        total: projects.length,
        published: projects.filter(p => p.is_published).length,
        draft: projects.filter(p => !p.is_published).length,
      },
      services: {
        total: services.length,
        published: services.filter(s => s.is_published).length,
      },
      automations: {
        total: automations.length,
        published: automations.filter(a => a.is_published).length,
      },
      technologies: {
        total: techRes.count || 0,
      }
    };

    // Fetch recently updated items (using limits and sorting by updated_at or created_at)
    const [recentProjects, recentAutomations, recentServices] = await Promise.all([
      supabase.from('projects').select('title, updated_at').order('updated_at', { ascending: false }).limit(3),
      supabase.from('automations').select('name, updated_at').order('updated_at', { ascending: false }).limit(3),
      supabase.from('services').select('title, updated_at').order('updated_at', { ascending: false }).limit(3)
    ]);

    const recent = [];
    if (recentProjects.data) {
      recentProjects.data.forEach(p => recent.push({ type: 'Project', title: p.title, updated_at: p.updated_at }));
    }
    if (recentAutomations.data) {
      recentAutomations.data.forEach(a => recent.push({ type: 'Automation', title: a.name, updated_at: a.updated_at }));
    }
    if (recentServices.data) {
      recentServices.data.forEach(s => recent.push({ type: 'Service', title: s.title, updated_at: s.updated_at }));
    }

    // Sort combined recent activities by updated_at descending
    recent.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

    return {
      stats,
      recent: recent.slice(0, 5),
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}
