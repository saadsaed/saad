import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/cms/ToastContext';
import CMSFormInput from '../components/cms/CMSFormInput';
import CMSButton from '../components/cms/CMSButton';
import CMSToggle from '../components/cms/CMSToggle';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';

export default function TechnologiesCMS() {
  const [techList, setTechList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    category: '',
    description: '',
    url: '',
    is_featured: false
  });

  const { toast } = useToast();

  const loadTech = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('technologies')
        .select('*');
      if (error) throw error;
      setTechList(data || []);
    } catch (err) {
      console.error(err);
      toast('Failed to load technologies.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTech();
  }, []);

  const handleEdit = (tech) => {
    setFormData(tech);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({
      id: '',
      name: '',
      category: '',
      description: '',
      url: '',
      is_featured: false
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this technology?')) return;
    try {
      const { error } = await supabase
        .from('technologies')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast('Technology deleted successfully.', 'success');
      loadTech();
    } catch (err) {
      console.error(err);
      toast('Failed to delete technology.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (formData.id) {
        const { error } = await supabase
          .from('technologies')
          .update(formData)
          .eq('id', formData.id);
        if (error) throw error;
        toast('Technology updated successfully.', 'success');
      } else {
        const { id: _id, ...insertData } = formData;
        const { error } = await supabase
          .from('technologies')
          .insert(insertData);
        if (error) throw error;
        toast('Technology added successfully.', 'success');
      }
      setIsEditing(false);
      loadTech();
    } catch (err) {
      console.error(err);
      toast('Failed to save technology.', 'error');
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
        <div className="animate-pulse text-neutral-500">Loading Technologies...</div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="bg-white p-8 rounded-lg border border-neutral-200 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <button type="button" onClick={() => setIsEditing(false)} className="text-neutral-500 hover:text-neutral-900 transition-colors p-1">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold">{formData.id ? 'Edit Technology' : 'Add New Technology'}</h1>
            <p className="text-sm text-neutral-500 font-sans">Add languages, tools, or frameworks to your global tech stack.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CMSFormInput
              id="name"
              label="Technology / Tool Name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. React, Docker, n8n"
            />
            <CMSFormInput
              id="category"
              label="Category"
              required
              value={formData.category}
              onChange={handleChange}
              placeholder="e.g. Frontend, Backend, DevOps, AI"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CMSFormInput
              id="url"
              label="Official documentation URL"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://..."
            />
            <div className="mt-8">
              <CMSToggle
                label="Featured stack item"
                checked={formData.is_featured}
                onChange={(checked) => handleCheckboxChange('is_featured', checked)}
              />
            </div>
          </div>

          <CMSFormInput
            id="description"
            label="Brief Description / Mastery notes"
            textarea
            rows={3}
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly notes about what this is used for..."
          />

          <div className="flex justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
            <CMSButton variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </CMSButton>
            <CMSButton type="submit" loading={saving}>
              {formData.id ? 'Save Changes' : 'Add Technology'}
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
          <h1 className="text-xl font-bold">Technologies CMS</h1>
          <p className="text-sm text-neutral-500 font-sans">Manage your skills database and tools master list.</p>
        </div>
        <CMSButton onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} />
          Add Technology
        </CMSButton>
      </div>

      {techList.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-200 rounded-lg">
          <p className="text-neutral-500 mb-4">No technologies added yet.</p>
          <CMSButton onClick={handleAddNew}>Add Technology</CMSButton>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-xs bg-neutral-50/50">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Category</th>
                <th className="py-3 px-4 font-semibold">Featured</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {techList.map((tech) => (
                <tr key={tech.id} className="hover:bg-neutral-50/30">
                  <td className="py-4 px-4 font-medium text-neutral-900">{tech.name}</td>
                  <td className="py-4 px-4 text-neutral-600">{tech.category}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${tech.is_featured ? 'bg-amber-50 text-amber-700 border border-amber-250' : 'bg-neutral-100 text-neutral-600'}`}>
                      {tech.is_featured ? 'Featured' : 'Standard'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(tech)} className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-md">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(tech.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-md">
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
