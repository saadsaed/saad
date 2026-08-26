import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/cms/ToastContext';
import CMSFormInput from '../components/cms/CMSFormInput';
import CMSButton from '../components/cms/CMSButton';

export default function SeoCMS() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    default_title: '',
    default_meta_description: '',
    site_name: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    async function loadSeo() {
      try {
        const { data: res, error } = await supabase
          .from('site_settings')
          .select('default_title, default_meta_description, site_name')
          .eq('id', true)
          .single();

        if (error) throw error;
        if (res) {
          setData(res);
        }
      } catch (err) {
        console.error(err);
        toast('Failed to load SEO configuration.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadSeo();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: true, ...data });

      if (error) throw error;
      toast('SEO metadata updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to update SEO config.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData(prev => ({ ...prev, [id]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-neutral-500">Loading SEO settings...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-neutral-200 max-w-4xl">
      <h1 className="text-xl font-bold mb-2">SEO Configuration</h1>
      <p className="text-neutral-500 mb-6 text-sm">Configure default page titles, descriptions, and site identities for search indexing.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <CMSFormInput
          id="site_name"
          label="Site Identity / Site Name"
          required
          value={data.site_name || ''}
          onChange={handleChange}
          placeholder="e.g. Saad Saeed"
        />

        <CMSFormInput
          id="default_title"
          label="Default Meta Page Title"
          required
          value={data.default_title || ''}
          onChange={handleChange}
          placeholder="e.g. Saad Saeed | AI Automation Developer"
        />

        <CMSFormInput
          id="default_meta_description"
          label="Default Search Meta Description"
          textarea
          rows={4}
          value={data.default_meta_description || ''}
          onChange={handleChange}
          placeholder="Write the summary page description that shows up in search engine previews..."
        />

        <div className="flex justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
          <CMSButton type="submit" loading={saving}>
            Save SEO Config
          </CMSButton>
        </div>
      </form>
    </div>
  );
}
