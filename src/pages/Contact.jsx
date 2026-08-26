import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Contact() {
  const [data, setData] = useState({
    email: 'saad@example.com',
    whatsapp: '+923001234567',
    location: 'Lahore, Pakistan',
    contact_description: 'Let\'s collaborate on building smart interfaces and automated pipelines. Drop me a line below.',
    cta_text: 'Get in touch'
  });

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
        console.error('Failed to load contact details:', err);
      } finally {
        setLoading(false);
      }
    }
    loadContact();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setSubmitting(false);
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
    // Reset success banner after 4 seconds
    setTimeout(() => setSubmitted(false), 4000);
  };

  if (loading) {
    return (
      <div className="w-full flex-1 flex flex-col justify-center items-center py-24 animate-pulse">
        <div className="h-6 w-32 bg-neutral-200 rounded mb-4" />
        <div className="h-10 w-2/3 bg-neutral-200 rounded" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Contact Info Details */}
      <div className="lg:col-span-5 p-6 sm:p-12 border-b lg:border-b-0 lg:border-r border-neutral-900/10 flex flex-col justify-between">
        <div>
          <span className="text-[10px] font-bold text-neutral-450 uppercase tracking-widest">04 / Communication</span>
          <h1 className="text-xl font-bold uppercase mt-4 text-neutral-950 tracking-tight">
            {data.cta_text || 'Get in touch'}
          </h1>
          <p className="text-xs text-neutral-500 mt-3 leading-relaxed max-w-sm">
            {data.contact_description}
          </p>
          
          <div className="flex flex-col gap-6 mt-8">
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">Email Address</span>
              <a href={`mailto:${data.email}`} className="text-sm font-bold text-neutral-950 hover:text-accent-600 mt-1 uppercase tracking-tight transition-colors">
                {data.email}
              </a>
            </div>
            {data.whatsapp && (
              <div className="flex flex-col">
                <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">WhatsApp / Call</span>
                <a href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm font-bold text-neutral-950 hover:text-accent-600 mt-1 uppercase tracking-tight transition-colors">
                  {data.whatsapp}
                </a>
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">HQ Location</span>
              <span className="text-sm font-bold text-neutral-950 mt-1 uppercase tracking-tight">
                {data.location}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Form Submission */}
      <div className="lg:col-span-7 p-6 sm:p-12 bg-white">
        <h3 className="text-md font-bold uppercase text-neutral-950 mb-6 tracking-tight">Send a Message</h3>
        {submitted ? (
          <div className="p-8 border border-neutral-900/10 flex flex-col items-center justify-center text-center gap-2">
            <span className="text-emerald-500 text-lg font-bold uppercase">Success</span>
            <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">
              Message Dispatched!
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-[9px] font-bold text-neutral-450 uppercase tracking-widest">Full Name</label>
              <input
                id="name"
                type="text"
                required
                className="w-full p-3 border border-neutral-900/10 rounded-none focus:border-neutral-950 focus:ring-0 text-xs font-semibold uppercase tracking-wider"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={handleInputChange}
                disabled={submitting}
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-[9px] font-bold text-neutral-450 uppercase tracking-widest">Email Address</label>
              <input
                id="email"
                type="email"
                required
                className="w-full p-3 border border-neutral-900/10 rounded-none focus:border-neutral-950 focus:ring-0 text-xs font-semibold uppercase tracking-wider"
                placeholder="e.g. john@example.com"
                value={form.email}
                onChange={handleInputChange}
                disabled={submitting}
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-[9px] font-bold text-neutral-450 uppercase tracking-widest">Your Message</label>
              <textarea
                id="message"
                required
                rows={5}
                className="w-full p-3 border border-neutral-900/10 rounded-none focus:border-neutral-950 focus:ring-0 text-xs font-semibold uppercase tracking-wider"
                placeholder="Brief project details..."
                value={form.message}
                onChange={handleInputChange}
                disabled={submitting}
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              className="relative p-[1px] overflow-hidden rounded-full group inline-block focus:outline-none w-fit mt-4"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-500 via-amber-400 to-violet-500 rounded-full animate-shimmer" />
              <span className="relative block px-6 py-2.5 bg-neutral-950 text-white hover:bg-neutral-900 text-[10px] font-bold rounded-full uppercase tracking-wider transition-colors">
                {submitting ? 'Sending...' : 'Send Message'}
              </span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
