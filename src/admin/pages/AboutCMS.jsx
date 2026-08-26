import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useToast } from '../components/cms/ToastContext';
import CMSFormInput from '../components/cms/CMSFormInput';
import CMSButton from '../components/cms/CMSButton';
import { Plus, Trash2 } from 'lucide-react';

export default function AboutCMS() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    biography: '',
    location: '',
    education: [],
    experience: [],
    stats: []
  });

  const { toast } = useToast();

  useEffect(() => {
    async function loadAbout() {
      try {
        const { data: res, error } = await supabase
          .from('about_content')
          .select('*')
          .eq('id', true)
          .single();

        if (error) throw error;
        if (res) {
          setData({
            biography: res.biography || '',
            location: res.location || '',
            education: Array.isArray(res.education) ? res.education : [],
            experience: Array.isArray(res.experience) ? res.experience : [],
            stats: Array.isArray(res.stats) ? res.stats : []
          });
        }
      } catch (err) {
        console.error(err);
        toast('Failed to load About page content.', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadAbout();
  }, [toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const { error } = await supabase
        .from('about_content')
        .upsert({ id: true, ...data });

      if (error) throw error;
      toast('About content updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      toast('Failed to update About content.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setData(prev => ({ ...prev, [id]: value }));
  };

  // Add/Remove Education
  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', school: '', year: '' }]
    }));
  };

  const removeEducation = (index) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index, field, value) => {
    setData(prev => {
      const updated = [...prev.education];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, education: updated };
    });
  };

  // Add/Remove Experience
  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { role: '', company: '', year: '' }]
    }));
  };

  const removeExperience = (index) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleExperienceChange = (index, field, value) => {
    setData(prev => {
      const updated = [...prev.experience];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experience: updated };
    });
  };

  // Add/Remove Stats
  const addStat = () => {
    setData(prev => ({
      ...prev,
      stats: [...prev.stats, { label: '', value: '' }]
    }));
  };

  const removeStat = (index) => {
    setData(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== index)
    }));
  };

  const handleStatChange = (index, field, value) => {
    setData(prev => {
      const updated = [...prev.stats];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, stats: updated };
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse text-neutral-500">Loading About Content...</div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-neutral-200 max-w-4xl">
      <h1 className="text-xl font-bold mb-2">About Content CMS</h1>
      <p className="text-neutral-500 mb-6 text-sm">Update your biography, location, stats, education history, and career history.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <CMSFormInput
          id="biography"
          label="Biography"
          textarea
          rows={4}
          value={data.biography}
          onChange={handleChange}
          placeholder="Write your professional bio here..."
        />

        <CMSFormInput
          id="location"
          label="Location"
          value={data.location}
          onChange={handleChange}
          placeholder="e.g. Lahore, Pakistan"
        />

        {/* STATS SECTION */}
        <div className="border-t border-neutral-100 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-neutral-800 text-sm">Stats Counter</h3>
            <CMSButton type="button" variant="secondary" onClick={addStat} className="flex items-center gap-1.5 py-1 px-3 text-xs">
              <Plus size={14} /> Add Stat
            </CMSButton>
          </div>
          <div className="flex flex-col gap-3">
            {data.stats.map((stat, idx) => (
              <div key={idx} className="flex items-end gap-3 bg-neutral-50 p-4 rounded-md border border-neutral-250/50">
                <CMSFormInput
                  label="Stat Value"
                  value={stat.value}
                  onChange={(e) => handleStatChange(idx, 'value', e.target.value)}
                  placeholder="e.g. 25+"
                />
                <CMSFormInput
                  label="Stat Label"
                  value={stat.label}
                  onChange={(e) => handleStatChange(idx, 'label', e.target.value)}
                  placeholder="e.g. Projects Completed"
                />
                <button type="button" onClick={() => removeStat(idx)} className="text-red-500 hover:text-red-700 p-2 border border-neutral-200 rounded bg-white hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* EDUCATION SECTION */}
        <div className="border-t border-neutral-100 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-neutral-800 text-sm">Education Timeline</h3>
            <CMSButton type="button" variant="secondary" onClick={addEducation} className="flex items-center gap-1.5 py-1 px-3 text-xs">
              <Plus size={14} /> Add Education
            </CMSButton>
          </div>
          <div className="flex flex-col gap-3">
            {data.education.map((edu, idx) => (
              <div key={idx} className="flex items-end gap-3 bg-neutral-50 p-4 rounded-md border border-neutral-250/50">
                <div className="grid grid-cols-3 gap-3 flex-1">
                  <CMSFormInput
                    label="Degree / Major"
                    value={edu.degree}
                    onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                    placeholder="e.g. BS Computer Science"
                  />
                  <CMSFormInput
                    label="School / University"
                    value={edu.school}
                    onChange={(e) => handleEducationChange(idx, 'school', e.target.value)}
                    placeholder="e.g. FAST NUCES"
                  />
                  <CMSFormInput
                    label="Years"
                    value={edu.year}
                    onChange={(e) => handleEducationChange(idx, 'year', e.target.value)}
                    placeholder="e.g. 2020-2024"
                  />
                </div>
                <button type="button" onClick={() => removeEducation(idx)} className="text-red-500 hover:text-red-700 p-2 border border-neutral-200 rounded bg-white hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CAREER EXPERIENCE SECTION */}
        <div className="border-t border-neutral-100 pt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-neutral-800 text-sm">Experience Timeline</h3>
            <CMSButton type="button" variant="secondary" onClick={addExperience} className="flex items-center gap-1.5 py-1 px-3 text-xs">
              <Plus size={14} /> Add Experience
            </CMSButton>
          </div>
          <div className="flex flex-col gap-3">
            {data.experience.map((exp, idx) => (
              <div key={idx} className="flex items-end gap-3 bg-neutral-50 p-4 rounded-md border border-neutral-250/50">
                <div className="grid grid-cols-3 gap-3 flex-1">
                  <CMSFormInput
                    label="Role / Title"
                    value={exp.role}
                    onChange={(e) => handleExperienceChange(idx, 'role', e.target.value)}
                    placeholder="e.g. Lead Dev"
                  />
                  <CMSFormInput
                    label="Company"
                    value={exp.company}
                    onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                    placeholder="e.g. Google"
                  />
                  <CMSFormInput
                    label="Years"
                    value={exp.year}
                    onChange={(e) => handleExperienceChange(idx, 'year', e.target.value)}
                    placeholder="e.g. 2024 - Present"
                  />
                </div>
                <button type="button" onClick={() => removeExperience(idx)} className="text-red-500 hover:text-red-700 p-2 border border-neutral-200 rounded bg-white hover:bg-red-50">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
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
