import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/cms/ToastContext';
import CMSFormInput from '../components/cms/CMSFormInput';
import CMSButton from '../components/cms/CMSButton';
import CMSToggle from '../components/cms/CMSToggle';
import { Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';

export default function AutomationsCMS() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    slug: '',
    problem: '',
    solution: '',
    description: '',
    trigger_type: '',
    ai_model: '',
    result: '',
    demo_url: '',
    is_published: false,
    is_featured: false
  });

  const { toast } = useToast();

  const loadAutomations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('automations')
        .select('*');
      if (error) throw error;
      setAutomations(data || []);
    } catch (err) {
      console.error(err);
      toast('Failed to load automations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAutomations();
  }, []);

  const handleEdit = (automation) => {
    setFormData(automation);
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setFormData({
      id: '',
      name: '',
      slug: '',
      problem: '',
      solution: '',
      description: '',
      trigger_type: 'Webhook',
      ai_model: 'GPT-4',
      result: '',
      demo_url: '',
      is_published: false,
      is_featured: false
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this automation?')) return;
    try {
      const { error } = await supabase
        .from('automations')
        .delete()
        .eq('id', id);
      if (error) throw error;
      toast('Automation deleted successfully.', 'success');
      loadAutomations();
    } catch (err) {
      console.error(err);
      toast('Failed to delete automation.', 'error');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const slug = formData.slug || formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const dataToSubmit = { ...formData, slug };

    try {
      if (formData.id) {
        const { error } = await supabase
          .from('automations')
          .update(dataToSubmit)
          .eq('id', formData.id);
        if (error) throw error;
        toast('Automation updated successfully.', 'success');
      } else {
        const { id: _id, ...insertData } = dataToSubmit;
        const { error } = await supabase
          .from('automations')
          .insert(insertData);
        if (error) throw error;
        toast('Automation added successfully.', 'success');
      }
      setIsEditing(false);
      loadAutomations();
    } catch (err) {
      console.error(err);
      toast('Failed to save automation.', 'error');
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
        <div className="animate-pulse text-neutral-500">Loading Automations...</div>
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
            <h1 className="text-xl font-bold">{formData.id ? 'Edit Automation' : 'Add New Automation'}</h1>
            <p className="text-sm text-neutral-500 font-sans">Configure an autonomous workflow casing project.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CMSFormInput
              id="name"
              label="Workflow Name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Lead Enrichment Pipeline"
            />
            <CMSFormInput
              id="slug"
              label="Slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="e.g. lead-enrichment (Auto-generated if empty)"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CMSFormInput
              id="trigger_type"
              label="Trigger Event / Tool"
              value={formData.trigger_type}
              onChange={handleChange}
              placeholder="e.g. Webhook, Schedule, n8n"
            />
            <CMSFormInput
              id="ai_model"
              label="AI Model Engaged"
              value={formData.ai_model}
              onChange={handleChange}
              placeholder="e.g. Claude 3.5 Sonnet, GPT-4o"
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
            id="description"
            label="Short Description"
            required
            value={formData.description}
            onChange={handleChange}
            placeholder="High-level description of what the workflow is..."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CMSFormInput
              id="problem"
              label="The Problem"
              textarea
              rows={3}
              value={formData.problem}
              onChange={handleChange}
              placeholder="What manual bottle-neck existed..."
            />
            <CMSFormInput
              id="solution"
              label="The Automation Solution"
              textarea
              rows={3}
              value={formData.solution}
              onChange={handleChange}
              placeholder="How the reasoning flow resolves it..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CMSFormInput
              id="result"
              label="Automation Result / Metrics"
              value={formData.result}
              onChange={handleChange}
              placeholder="e.g. Saved 14 hours/week, 99.8% precision"
            />
            <CMSFormInput
              id="demo_url"
              label="Demo Video / Webhook URL"
              value={formData.demo_url}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="flex justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
            <CMSButton variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </CMSButton>
            <CMSButton type="submit" loading={saving}>
              {formData.id ? 'Save Changes' : 'Create Automation'}
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
          <h1 className="text-xl font-bold">Automations CMS</h1>
          <p className="text-sm text-neutral-500 font-sans">Manage background workflows and n8n pipelines.</p>
        </div>
        <CMSButton onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} />
          Add Automation
        </CMSButton>
      </div>

      {automations.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-neutral-200 rounded-lg">
          <p className="text-neutral-500 mb-4">No automations configured yet.</p>
          <CMSButton onClick={handleAddNew}>Add Automation</CMSButton>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-neutral-200 text-neutral-500 uppercase tracking-wider text-xs bg-neutral-50/50">
                <th className="py-3 px-4 font-semibold">Name</th>
                <th className="py-3 px-4 font-semibold">Trigger</th>
                <th className="py-3 px-4 font-semibold">Model</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 text-right font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {automations.map((auto) => (
                <tr key={auto.id} className="hover:bg-neutral-50/30">
                  <td className="py-4 px-4 font-medium text-neutral-900">{auto.name}</td>
                  <td className="py-4 px-4 text-neutral-600">{auto.trigger_type}</td>
                  <td className="py-4 px-4 text-neutral-600 font-mono text-xs">{auto.ai_model}</td>
                  <td className="py-4 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${auto.is_published ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-neutral-100 text-neutral-600'}`}>
                      {auto.is_published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(auto)} className="p-1.5 text-neutral-500 hover:text-neutral-900 rounded-md">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(auto.id)} className="p-1.5 text-red-500 hover:text-red-700 rounded-md">
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
