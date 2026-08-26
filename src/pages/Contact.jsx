import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 15 } }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-6 py-24 animate-pulse">
        <div className="h-6 w-32 bg-neutral-200 rounded mb-4" />
        <div className="h-12 w-2/3 bg-neutral-200 rounded mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="h-48 bg-neutral-150 rounded" />
          <div className="h-48 bg-neutral-150 rounded" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="container mx-auto max-w-6xl px-6 py-12 md:py-24 grid grid-cols-1 lg:grid-cols-12 gap-16 md:gap-24"
    >
      {/* Contact info side */}
      <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-600">
          <span>04 / Communication</span>
          <span className="w-12 h-[1px] bg-neutral-300" />
        </div>
        <h1 className="text-4xl sm:text-5xl font-display font-bold text-neutral-900 tracking-tight leading-none">
          {data.cta_text || 'Get in touch'}
        </h1>
        <p className="text-neutral-600 leading-relaxed font-sans mt-2">
          {data.contact_description}
        </p>

        <div className="flex flex-col gap-4 mt-6">
          <div className="flex items-center gap-4 border border-neutral-200 rounded-lg p-4 bg-white shadow-xs">
            <div className="p-2.5 bg-neutral-50 border border-neutral-150 rounded-lg text-neutral-600">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">Email Address</p>
              <a href={`mailto:${data.email}`} className="text-sm font-semibold text-neutral-800 hover:text-accent-600 transition-colors">
                {data.email}
              </a>
            </div>
          </div>

          {data.whatsapp && (
            <div className="flex items-center gap-4 border border-neutral-200 rounded-lg p-4 bg-white shadow-xs">
              <div className="p-2.5 bg-neutral-50 border border-neutral-150 rounded-lg text-neutral-600">
                <Phone size={18} />
              </div>
              <div>
                <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">WhatsApp / Call</p>
                <a href={`https://wa.me/${data.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-neutral-800 hover:text-accent-600 transition-colors">
                  {data.whatsapp}
                </a>
              </div>
            </div>
          )}

          <div className="flex items-center gap-4 border border-neutral-200 rounded-lg p-4 bg-white shadow-xs">
            <div className="p-2.5 bg-neutral-50 border border-neutral-150 rounded-lg text-neutral-600">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-neutral-450 uppercase tracking-wider">HQ Location</p>
              <span className="text-sm font-semibold text-neutral-800">
                {data.location}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Form side */}
      <motion.div variants={itemVariants} className="lg:col-span-7 bg-white border border-neutral-200 rounded-lg p-8 shadow-xs h-fit">
        <h3 className="font-bold text-lg text-neutral-900 mb-6">Send a Message</h3>

        {submitted ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 flex flex-col items-center justify-center text-center gap-2">
            <CheckCircle2 className="text-green-600" size={32} />
            <h4 className="font-bold text-green-900">Message Dispatched!</h4>
            <p className="text-xs text-green-700 max-w-xs font-sans">
              Thank you for reaching out. Your message has been sent, and I will reply as soon as possible.
            </p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-xs font-semibold text-neutral-700">Full Name</label>
              <input
                id="name"
                type="text"
                required
                className="p-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-sans"
                placeholder="e.g. John Doe"
                value={form.name}
                onChange={handleInputChange}
                disabled={submitting}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-xs font-semibold text-neutral-700">Email Address</label>
              <input
                id="email"
                type="email"
                required
                className="p-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-sans"
                placeholder="e.g. john@example.com"
                value={form.email}
                onChange={handleInputChange}
                disabled={submitting}
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="message" className="text-xs font-semibold text-neutral-700">Your Message</label>
              <textarea
                id="message"
                required
                rows={5}
                className="p-3 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900 text-sm font-sans"
                placeholder="Brief project details..."
                value={form.message}
                onChange={handleInputChange}
                disabled={submitting}
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-4 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold py-3 rounded-md text-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Sending...' : 'Send Message'}
              <Send size={14} />
            </button>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
}
