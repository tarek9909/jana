'use client';

import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit. Please fill out all required fields.');
      }

      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setError(err.message || 'An error occurred while sending your message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-lg bg-primary-beige/40 p-8 sm:p-10 rounded-2xl border border-primary-beige/60">
      <h3 className="font-serif text-2xl tracking-wide mb-6">Start a Project</h3>
      
      {success && (
        <div className="flex items-center gap-3 bg-emerald-50 text-emerald-800 p-4 rounded-xl border border-emerald-200 text-sm">
          <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <p>Thank you! Your inquiry was submitted. We will contact you soon.</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-rose-50 text-rose-800 p-4 rounded-xl border border-rose-200 text-sm">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Full Name *</label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
          placeholder="Jean Doe"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Email Address *</label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
            placeholder="jean@example.com"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="phone" className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Phone (Optional)</label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
            placeholder="+1 (555) 000-0000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Project Details *</label>
        <textarea
          id="message"
          required
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors resize-none"
          placeholder="Tell us about your space, timeline, and aesthetic goals..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-charcoal text-primary-white py-4 rounded-xl text-sm font-semibold tracking-widest uppercase hover:bg-charcoal/90 transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        {loading ? 'Submitting...' : 'Send Inquiry'}
        {!loading && <Send className="w-4 h-4" />}
      </button>
    </form>
  );
}
