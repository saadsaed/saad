import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/cms/ToastContext';
import CMSFormInput from '../components/cms/CMSFormInput';
import CMSButton from '../components/cms/CMSButton';
import CMSToggle from '../components/cms/CMSToggle';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';

export default function ServicesCMS() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    short_desc: '',
    full_desc: '',
    icon_name: '',
    is_published: false,
    is_featured: false
  });

  const { toast } = useToast();

  const loadServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*');
      if (error) throw error;
      setServices(data || []);
    } catch (err) {
      console.error(err);
      toast('Failed to load services.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleEdit = (service) => {
    setFormData(service);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({
      id: '',
      title: '',
      short_desc: '',
      full_desc: '',
      icon_name: 'Cpu',
      is_published: false,
      is_featured: false
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const { error } = await supabase
        .from('services')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast('Service deleted successfully.', 'success');
      loadServices();
    } catch (err) {
      console.error(err);
      toast('Failed to delete service.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (formData.id) {
        const { error } = await supabase
          .from('services')
          .update(formData)
          .eq('id', formData.id);
        if (error) throw error;
        toast('Service updated successfully.', 'success');
      } else {
        const { id: _id, ...insertData } = formData;
        const { error } = await supabase
          .from('services')
          .insert(insertData);
        if (error) throw error;
        toast('Service added successfully.', 'success');
      }
      setIsEditing(false);
      loadServices();
    } catch (err) {
      console.error(err);
      toast('Failed to save service.', 'error');
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
        <div className="animate-pulse text-neutral-500">Loading Services...</div>
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
            <h1 className="text-xl font-bold">{formData.id ? 'Edit Service' : 'Add New Service'}</h1>
            <p className="text-sm text-neutral-500 font-sans">Configure your portfolio service offerings.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CMSFormInput
              id="title"
              label="Service Title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. AI Agents & Workflows"
            />
            <CMSFormInput
              id="icon_name"
              label="Lucide Icon Name"
              required
              value={formData.icon_name}
              onChange={handleChange}
              placeholder="e.g. Cpu, Briefcase, Globe, Code"
            />
          </div>

          <div className="flex gap-6">
            <CMSToggle
              label="Published"
              checked={formData.is_published}
              onChange={(checked) => handleCheckboxChange('is_published', checked)}
            />
            <CMSToggle
              label="Featured"
              checked={formData.is_featured}
              onChange={(checked) => handleCheckboxChange('is_featured', checked)}
            />
          </div>

          <CMSFormInput
            id="short_desc"
            label="Short Description"
            required
            value={formData.short_desc}
            onChange={handleChange}
            placeholder="A brief card summary..."
          />

          <CMSFormInput
            id="full_desc"
            label="Full Details Description"
            textarea
            rows={5}
            value={formData.full_desc}
            onChange={handleChange}
            placeholder="Detailed description of what you offer..."
          />

          <div className="flex justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
            <CMSButton variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </CMSButton>
            <CMSButton type="submit" loading={saving}>
              {formData.id ? 'Save Changes' : 'Create Service'}
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
          <h1 className="text-xl font-bold">Services CMS</h1>
          <p className="text-sm text-neutral-500">Configure your expertise sectors displayed on the landing page.</p>
        </div>
        <CMSButton onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} />
          Add Service
        </CMSButton>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-200 rounded-lg">
          <p className="text-neutral-500 mb-4">No services configured yet.</p>
          <CMSButton onClick={handleAddNew}>Add Service</CMSButton>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-xs bg-neutral-50/50">
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Icon</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-neutral-50/30">
                  <td className="py-4 px-4 font-medium text-neutral-900">{service.title}</td>
                  <td className="py-4 px-4 text-neutral-600 font-mono text-xs">{service.icon_name}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${service.is_published ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-neutral-100 text-neutral-600'}`}>
                      {service.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(service)} className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-md">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(service.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-md">
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
