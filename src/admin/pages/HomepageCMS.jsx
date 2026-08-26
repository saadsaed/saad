import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/cms/ToastContext';
import CMSFormInput from '../components/cms/CMSFormInput';
import CMSButton from '../components/cms/CMSButton';

export default function HomepageCMS() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    hero_subtitle: '',
    hero_heading: '',
    hero_description: '',
    cta_1_label: '',
    cta_1_url: '',
    cta_2_label: '',
    cta_2_url: '',
    intro_text: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    async function loadContent() {
      try {
        const { data: res, error } = await supabase
          .from('homepage_content')
          .select('*')
          .eq('id', true)
          .single();

        if (error) throw error;
        if (res) {
          setData(res);
        }
      } catch (err) {
        console.error('Failed to load homepage content:', err);
        toast('Failed to load homepage content from database.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('homepage_content')
        .upsert({ id: true, ...data });

      if (error) throw error;
      toast('Homepage content updated successfully!', 'success');
    } catch (err) {
      console.error('Failed to save homepage content:', err);
      toast('Failed to save homepage content.', 'error');
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
        <div className="animate-pulse text-neutral-500">Loading Homepage Content...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-neutral-200 max-w-4xl">
      <h1 className="text-xl font-bold mb-2">Homepage Content CMS</h1>
      <p className="text-neutral-500 mb-6 text-sm">Update the texts, links, and headings displayed on the main home screen.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CMSFormInput
            id="hero_subtitle"
            label="Hero Subtitle / Section Number"
            value={data.hero_subtitle || ''}
            onChange={handleChange}
            placeholder="e.g. 01 / Introduction"
          />
        </div>

        <CMSFormInput
          id="hero_heading"
          label="Hero Main Heading"
          value={data.hero_heading || ''}
          onChange={handleChange}
          placeholder="e.g. Building Intelligent Systems & Modern Interfaces."
        />

        <CMSFormInput
          id="hero_description"
          label="Hero Short Description"
          textarea
          rows={3}
          value={data.hero_description || ''}
          onChange={handleChange}
          placeholder="Hero description paragraph..."
        />

        <div className="border-t border-neutral-100 pt-4">
          <h3 className="font-semibold text-neutral-800 mb-3 text-sm">Call-To-Actions (Buttons)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-3">
              <CMSFormInput
                id="cta_1_label"
                label="Primary Button Label"
                value={data.cta_1_label || ''}
                onChange={handleChange}
                placeholder="e.g. Explore Work"
              />
              <CMSFormInput
                id="cta_1_url"
                label="Primary Button Link / Path"
                value={data.cta_1_url || ''}
                onChange={handleChange}
                placeholder="e.g. /work"
              />
            </div>
            <div className="flex flex-col gap-3">
              <CMSFormInput
                id="cta_2_label"
                label="Secondary Button Label"
                value={data.cta_2_label || ''}
                onChange={handleChange}
                placeholder="e.g. Get in touch"
              />
              <CMSFormInput
                id="cta_2_url"
                label="Secondary Button Link / Path"
                value={data.cta_2_url || ''}
                onChange={handleChange}
                placeholder="e.g. /contact"
              />
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <h3 className="font-semibold text-neutral-800 mb-3 text-sm">Section 2 (Expertise Intro)</h3>
          <CMSFormInput
            id="intro_text"
            label="Expertise Intro Text"
            textarea
            rows={3}
            value={data.intro_text || ''}
            onChange={handleChange}
            placeholder="Introduction text for expertise area..."
          />
        </div>

        <div className="flex justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
          <CMSButton type="submit" loading={saving}>
            Save Changes
          </CMSButton>
        </div>
      </form>
    </div>
  );
}
