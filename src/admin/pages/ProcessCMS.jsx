import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/cms/ToastContext';
import CMSFormInput from '../components/cms/CMSFormInput';
import CMSButton from '../components/cms/CMSButton';
import CMSToggle from '../components/cms/CMSToggle';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';

export default function ProcessCMS() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    description: '',
    is_published: false
  });

  const { toast } = useToast();

  const loadSteps = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('process_steps')
        .select('*');
      if (error) throw error;
      setSteps(data || []);
    } catch (err) {
      console.error(err);
      toast('Failed to load process steps.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSteps();
  }, []);

  const handleEdit = (step) => {
    setFormData(step);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({
      id: '',
      title: '',
      description: '',
      is_published: false
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this process step?')) return;
    try {
      const { error } = await supabase
        .from('process_steps')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast('Process step deleted successfully.', 'success');
      loadSteps();
    } catch (err) {
      console.error(err);
      toast('Failed to delete process step.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (formData.id) {
        const { error } = await supabase
          .from('process_steps')
          .update(formData)
          .eq('id', formData.id);
        if (error) throw error;
        toast('Process step updated successfully.', 'success');
      } else {
        const { id: _id, ...insertData } = formData;
        const { error } = await supabase
          .from('process_steps')
          .insert(insertData);
        if (error) throw error;
        toast('Process step added successfully.', 'success');
      }
      setIsEditing(false);
      loadSteps();
    } catch (err) {
      console.error(err);
      toast('Failed to save process step.', 'error');
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
        <div className="animate-pulse text-neutral-500">Loading Process Steps...</div>
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
            <h1 className="text-xl font-bold">{formData.id ? 'Edit Process Step' : 'Add New Process Step'}</h1>
            <p className="text-sm text-neutral-500 font-sans">Define a step in your developmental workflow methodology.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <CMSFormInput
            id="title"
            label="Step Title"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Discovery & Plan"
          />

          <CMSToggle
            label="Published"
            checked={formData.is_published}
            onChange={(checked) => handleCheckboxChange('is_published', checked)}
          />

          <CMSFormInput
            id="description"
            label="Detailed Description"
            textarea
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly explain what you execute in this phase..."
          />

          <div className="flex justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
            <CMSButton variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </CMSButton>
            <CMSButton type="submit" loading={saving}>
              {formData.id ? 'Save Changes' : 'Create Step'}
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
          <h1 className="text-xl font-bold">Process CMS</h1>
          <p className="text-sm text-neutral-500 font-sans">Manage development milestones and workflows shown to clients.</p>
        </div>
        <CMSButton onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} />
          Add Step
        </CMSButton>
      </div>

      {steps.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-200 rounded-lg">
          <p className="text-neutral-500 mb-4">No steps added yet.</p>
          <CMSButton onClick={handleAddNew}>Add Step</CMSButton>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-xs bg-neutral-50/50">
                <th className="py-3 px-4 font-semibold">Title</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {steps.map((step) => (
                <tr key={step.id} className="hover:bg-neutral-50/30">
                  <td className="py-4 px-4 font-medium text-neutral-900">{step.title}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${step.is_published ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-neutral-100 text-neutral-600'}`}>
                      {step.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(step)} className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-md">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(step.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-md">
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
