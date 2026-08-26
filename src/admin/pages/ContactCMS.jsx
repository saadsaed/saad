import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/cms/ToastContext';
import CMSFormInput from '../components/cms/CMSFormInput';
import CMSButton from '../components/cms/CMSButton';

export default function ContactCMS() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    email: '',
    whatsapp: '',
    location: '',
    contact_description: '',
    cta_text: ''
  });

  const { toast } = useToast();

  useEffect(() => {
    async function loadContact() {
      try {
        const { data: res, error } = await supabase
          .from('contact_info')
          .select('*')
          .eq('id', true)
          .single();

        if (error) throw error;
        if (res) {
          setData(res);
        }
      } catch (err) {
        console.error(err);
        toast('Failed to load contact info.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadContact();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('contact_info')
        .upsert({ id: true, ...data });

      if (error) throw error;
      toast('Contact info updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to update contact info.', 'error');
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
        <div className="animate-pulse text-neutral-500">Loading Contact info...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-neutral-200 max-w-4xl">
      <h1 className="text-xl font-bold mb-2">Contact Info CMS</h1>
      <p className="text-neutral-500 mb-6 text-sm">Update your public contact addresses and CTA labels.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CMSFormInput
            id="email"
            label="Email Address"
            required
            value={data.email || ''}
            onChange={handleChange}
            placeholder="saad@example.com"
          />
          <CMSFormInput
            id="whatsapp"
            label="WhatsApp Number / Call Path"
            value={data.whatsapp || ''}
            onChange={handleChange}
            placeholder="+923001234567"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CMSFormInput
            id="location"
            label="Physical Location"
            value={data.location || ''}
            onChange={handleChange}
            placeholder="Lahore, Pakistan"
          />
          <CMSFormInput
            id="cta_text"
            label="Submit Button Text / CTA Label"
            value={data.cta_text || ''}
            onChange={handleChange}
            placeholder="Get in touch"
          />
        </div>

        <CMSFormInput
          id="contact_description"
          label="Contact Page Intro Description"
          textarea
          rows={4}
          value={data.contact_description || ''}
          onChange={handleChange}
          placeholder="Brief copy to welcome visitors to contact you..."
        />

        <div className="flex justify-end gap-3 mt-4 border-t border-neutral-100 pt-4">
          <CMSButton type="submit" loading={saving}>
            Save Changes
          </CMSButton>
        </div>
      </form>
    </div>
  );
}
