import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/cms/ToastContext';
import CMSFormInput from '../components/cms/CMSFormInput';
import CMSButton from '../components/cms/CMSButton';
import CMSToggle from '../components/cms/CMSToggle';

export default function SettingsCMS() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    announcement_text: '',
    announcement_active: false,
    availability_status: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data: res, error } = await supabase
          .from('site_settings')
          .select('announcement_text, announcement_active, availability_status')
          .eq('id', true)
          .single();

        if (error) throw error;
        if (res) {
          setData(res);
        }
      } catch (err) {
        console.error(err);
        toast('Failed to load settings.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadSettings();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: true, ...data });

      if (error) throw error;
      toast('Global settings updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to save settings.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData(prev => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (field, checked) => {
    setData(prev => ({ ...prev, [field]: checked }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-neutral-500">Loading settings...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-neutral-200 max-w-4xl">
      <h1 className="text-xl font-bold mb-2">Global Settings</h1>
      <p className="text-neutral-500 mb-6 text-sm font-sans">Configure announcements, hire availability tags, and other global configurations.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CMSFormInput
            id="availability_status"
            label="Hire Availability Status"
            value={data.availability_status || ''}
            onChange={handleChange}
            placeholder="e.g. Available for Contracts, Freelance"
          />
        </div>

        <div className="border-t border-neutral-100 pt-4 flex flex-col gap-4">
          <h3 className="font-semibold text-neutral-800 text-sm">Header Announcement Bar</h3>
          
          <CMSToggle
            label="Activate Announcement Bar"
            checked={data.announcement_active}
            onChange={(checked) => handleCheckboxChange('announcement_active', checked)}
          />

          <CMSFormInput
            id="announcement_text"
            label="Announcement Message Text"
            value={data.announcement_text || ''}
            onChange={handleChange}
            placeholder="e.g. Open for new contracts beginning September 2026!"
          />
        </div>

        <div className="flex justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
          <CMSButton type="submit" loading={saving}>
            Save Settings
          </CMSButton>
        </div>
      </form>
    </div>
  );
}
