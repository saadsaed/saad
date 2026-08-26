import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/cms/ToastContext';
import CMSFormInput from '../components/cms/CMSFormInput';
import CMSButton from '../components/cms/CMSButton';
import CMSToggle from '../components/cms/CMSToggle';
import { Plus, Edit2, Trash2, Globe, ArrowLeft } from 'lucide-react';

const Github = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);

export default function ProjectsCMS() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    short_desc: '',
    full_desc: '',
    category: '',
    github_url: '',
    live_url: '',
    is_published: false,
    is_featured: false
  });

  const { toast } = useToast();

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*');
      
      if (error) throw error;
      setProjects(data || []);
    } catch (err) {
      console.error(err);
      toast('Failed to load projects.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleEdit = (project) => {
    setFormData(project);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({
      id: '',
      title: '',
      slug: '',
      short_desc: '',
      full_desc: '',
      category: '',
      github_url: '',
      live_url: '',
      is_published: false,
      is_featured: false
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast('Project deleted successfully.', 'success');
      loadProjects();
    } catch (err) {
      console.error(err);
      toast('Failed to delete project.', 'error');
    }
  };

  const handleTogglePublished = async (project) => {
    try {
      const updatedStatus = !project.is_published;
      const { error } = await supabase
        .from('projects')
        .update({ is_published: updatedStatus })
        .eq('id', project.id);

      if (error) throw error;
      toast(`Project ${updatedStatus ? 'published' : 'moved to drafts'}.`, 'success');
      loadProjects();
    } catch (err) {
      console.error(err);
      toast('Failed to update status.', 'error');
    }
  };

  const handleToggleFeatured = async (project) => {
    try {
      const updatedStatus = !project.is_featured;
      const { error } = await supabase
        .from('projects')
        .update({ is_featured: updatedStatus })
        .eq('id', project.id);

      if (error) throw error;
      toast(`Project ${updatedStatus ? 'marked as featured' : 'removed from featured'}.`, 'success');
      loadProjects();
    } catch (err) {
      console.error(err);
      toast('Failed to update status.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Generate slug from title if empty
    const slug = formData.slug || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const dataToSubmit = { ...formData, slug };

    try {
      if (formData.id) {
        // Update
        const { error } = await supabase
          .from('projects')
          .update(dataToSubmit)
          .eq('id', formData.id);
        
        if (error) throw error;
        toast('Project updated successfully.', 'success');
      } else {
        // Insert
        // Omit empty id
        const { id: _id, ...insertData } = dataToSubmit;
        const { error } = await supabase
          .from('projects')
          .insert(insertData);

        if (error) throw error;
        toast('Project added successfully.', 'success');
      }
      setIsEditing(false);
      loadProjects();
    } catch (err) {
      console.error(err);
      toast('Failed to save project.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (field, checked) => {
    setFormData(prev => ({ ...prev, [field]: checked }));
  };

  if (loading && !isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-neutral-500">Loading Projects...</div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white p-8 rounded-lg border border-neutral-200 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <button 
            type="button" 
            onClick={() => setIsEditing(false)}
            className="text-neutral-500 hover:text-neutral-900 transition-colors p-1"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{formData.id ? 'Edit Project' : 'Add New Project'}</h1>
            <p className="text-sm text-neutral-500">Enter the project details, external links, and visibility settings.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CMSFormInput
              id="title"
              label="Project Title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Saad Portfolio Website"
            />
            <CMSFormInput
              id="category"
              label="Category"
              required
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. React & Frontend"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CMSFormInput
              id="slug"
              label="URL Slug (Optional)"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. saad-portfolio (Auto-generated if empty)"
            />
            <div className="flex gap-6 mt-8">
              <CMSToggle
                label="Published (Visible on site)"
                checked={formData.is_published}
                onChange={(checked) => handleCheckboxChange('is_published', checked)}
              />
              <CMSToggle
                label="Featured"
                checked={formData.is_featured}
                onChange={(checked) => handleCheckboxChange('is_featured', checked)}
              />
            </div>
          </div>

          <CMSFormInput
            id="short_desc"
            label="Short Description"
            required
            value={formData.short_desc}
            onChange={handleChange}
            placeholder="A brief summary for cards and lists..."
          />

          <CMSFormInput
            id="full_desc"
            label="Full Description"
            textarea
            rows={5}
            value={formData.full_desc}
            onChange={handleChange}
            placeholder="Detailed description of the project, challenges, and implementation details..."
          />

          <div className="border-t border-neutral-100 pt-4">
            <h3 className="font-semibold text-neutral-800 mb-3 text-sm">External Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <CMSFormInput
                id="github_url"
                label="GitHub Repository URL"
                value={formData.github_url}
                onChange={handleChange}
                placeholder="https://github.com/..."
              />
              <CMSFormInput
                id="live_url"
                label="Live Project URL"
                value={formData.live_url}
                onChange={handleChange}
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
            <CMSButton variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </CMSButton>
            <CMSButton type="submit" loading={saving}>
              {formData.id ? 'Save Changes' : 'Create Project'}
            </CMSButton>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-neutral-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-xl font-bold">Projects CMS</h1>
          <p className="text-sm text-neutral-500">Manage work portfolio displayed on the public site.</p>
        </div>
        <CMSButton onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} />
          Add Project
        </CMSButton>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-200 rounded-lg">
          <p className="text-neutral-500 mb-4">No projects found. Add your first project!</p>
          <CMSButton onClick={handleAddNew}>Add Project</CMSButton>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-xs bg-neutral-50/50">
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Published</th>
                <th className="py-3 px-4 font-semibold">Featured</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {projects.map((project) => (
                <tr key={project.id} className="hover:bg-neutral-50/30">
                  <td className="py-4 px-4 font-medium text-neutral-900">
                    <div>
                      {project.title}
                      <div className="flex gap-2 mt-1">
                        {project.github_url && <a href={project.github_url} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-neutral-600"><Github size={14} /></a>}
                        {project.live_url && <a href={project.live_url} target="_blank" rel="noreferrer" className="text-neutral-400 hover:text-neutral-600"><Globe size={14} /></a>}
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-neutral-600">{project.category}</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleTogglePublished(project)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        project.is_published 
                          ? 'bg-green-50 text-green-700 border border-green-200' 
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      {project.is_published ? 'Published' : 'Draft'}
                    </button>
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleToggleFeatured(project)}
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        project.is_featured 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200' 
                          : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                      }`}
                    >
                      {project.is_featured ? 'Featured' : 'Standard'}
                    </button>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-50 rounded-md transition-colors"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
