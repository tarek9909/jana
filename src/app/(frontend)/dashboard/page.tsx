'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Settings,
  FolderKanban,
  Briefcase,
  MessageSquare,
  Inbox,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  Upload,
  X,
  Globe,
  Check,
  Loader2,
  AlertCircle
} from 'lucide-react';

interface Project {
  id: number;
  title: string;
  slug: string;
  description: string;
  location: string | null;
  year: string | null;
  isFeatured: boolean;
  category: string;
  coverImage: string;
  images: { id: number; url: string }[];
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  priceRange: string | null;
}

interface Testimonial {
  id: number;
  clientName: string;
  company: string | null;
  quote: string;
  isFeatured: boolean;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  message: string;
  status: string;
  createdAt: string;
}

interface SiteSettings {
  siteName: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutText: string;
  contactEmail: string;
  contactPhone: string | null;
  contactAddress: string | null;
  primaryBeige: string;
  primaryWhite: string;
  primaryCharcoal: string;
  primaryAccent: string;
  copyrightText: string;
  heroTag: string;
  footerManifesto: string;
  portfolioDesc: string;
  servicesDesc: string;
  contactDesc: string;
  instagramUrl: string;
  pinterestUrl: string;
  linkedinUrl: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'projects' | 'services' | 'testimonials' | 'inquiries'>('overview');
  
  // API Data States
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    heroTitle: '',
    heroSubtitle: '',
    aboutTitle: '',
    aboutText: '',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    primaryBeige: '#F4EFEA',
    primaryWhite: '#FAFAF9',
    primaryCharcoal: '#1C1B1A',
    primaryAccent: '#8B7E74',
    copyrightText: '',
    heroTag: '',
    footerManifesto: '',
    portfolioDesc: '',
    servicesDesc: '',
    contactDesc: '',
    instagramUrl: '',
    pinterestUrl: '',
    linkedinUrl: ''
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);

  // Action/Form UI States
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Modals & Active Edit Entities
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [galleryInputs, setGalleryInputs] = useState<string[]>([]);
  
  const [serviceFormOpen, setServiceFormOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  
  const [testimonialFormOpen, setTestimonialFormOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);

  // Authenticate Admin
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          router.push('/login');
        } else {
          setAuthLoading(false);
          // Fetch Initial Admin Dashboard Data
          fetchData();
        }
      } catch (err) {
        router.push('/login');
      }
    }
    checkAuth();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, projectsRes, servicesRes, testimonialsRes, inquiriesRes] = await Promise.all([
        fetch('/api/settings').then(res => res.json()),
        fetch('/api/projects').then(res => res.json()),
        fetch('/api/services').then(res => res.json()),
        fetch('/api/testimonials').then(res => res.json()),
        fetch('/api/inquiries').then(res => res.json())
      ]);

      setSettings(settingsRes);
      setProjects(projectsRes);
      setServices(servicesRes);
      setTestimonials(testimonialsRes);
      setInquiries(inquiriesRes);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  // Image Upload helper
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'cover' | 'gallery', galleryIndex?: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();

      if (target === 'cover' && editingProject) {
        setEditingProject({ ...editingProject, coverImage: data.url });
      } else if (target === 'gallery' && galleryIndex !== undefined) {
        const updated = [...galleryInputs];
        updated[galleryIndex] = data.url;
        setGalleryInputs(updated);
      }
    } catch (err) {
      showNotice('Image upload failed. Try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showNotice = (text: string, type: 'success' | 'error') => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: '', type: '' }), 4000);
  };

  // SITE SETTINGS ACTIONS
  const saveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!res.ok) throw new Error();
      showNotice('Site configurations updated successfully.', 'success');
    } catch (err) {
      showNotice('Failed to update configurations.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // PROJECT CRUD ACTIONS
  const openNewProject = () => {
    setEditingProject({
      title: '',
      slug: '',
      description: '',
      location: '',
      year: '',
      isFeatured: false,
      category: 'Residential',
      coverImage: '',
    });
    setGalleryInputs([]);
    setProjectFormOpen(true);
  };

  const openEditProject = (project: Project) => {
    setEditingProject(project);
    setGalleryInputs(project.images.map(img => img.url));
    setProjectFormOpen(true);
  };

  const saveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;

    setLoading(true);
    try {
      const url = editingProject.id ? `/api/projects/${editingProject.id}` : '/api/projects';
      const method = editingProject.id ? 'PUT' : 'POST';

      const body = {
        ...editingProject,
        galleryImages: galleryInputs.filter(url => url.trim() !== ''),
      };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save project');

      showNotice('Project portfolio entry updated successfully.', 'success');
      setProjectFormOpen(false);
      setEditingProject(null);
      fetchData();
    } catch (err: any) {
      showNotice(err.message || 'Error occurred.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project? This will permanently remove its gallery associations.')) return;
    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showNotice('Project deleted successfully.', 'success');
      fetchData();
    } catch (err) {
      showNotice('Failed to delete project.', 'error');
    }
  };

  // SERVICE CRUD ACTIONS
  const openNewService = () => {
    setEditingService({ title: '', description: '', icon: 'Home', priceRange: '' });
    setServiceFormOpen(true);
  };

  const openEditService = (service: Service) => {
    setEditingService(service);
    setServiceFormOpen(true);
  };

  const saveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    setLoading(true);
    try {
      const url = editingService.id ? `/api/services/${editingService.id}` : '/api/services';
      const method = editingService.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingService),
      });

      if (!res.ok) throw new Error();
      showNotice('Service catalog saved.', 'success');
      setServiceFormOpen(false);
      fetchData();
    } catch (err) {
      showNotice('Error saving service catalog item.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteService = async (id: number) => {
    if (!confirm('Delete this service?')) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showNotice('Service deleted.', 'success');
      fetchData();
    } catch (err) {
      showNotice('Error deleting service.', 'error');
    }
  };

  // TESTIMONIAL CRUD ACTIONS
  const openNewTestimonial = () => {
    setEditingTestimonial({ clientName: '', company: '', quote: '', isFeatured: false });
    setTestimonialFormOpen(true);
  };

  const openEditTestimonial = (t: Testimonial) => {
    setEditingTestimonial(t);
    setTestimonialFormOpen(true);
  };

  const saveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    setLoading(true);
    try {
      const url = editingTestimonial.id ? `/api/testimonials/${editingTestimonial.id}` : '/api/testimonials';
      const method = editingTestimonial.id ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingTestimonial),
      });

      if (!res.ok) throw new Error();
      showNotice('Testimonial entry saved.', 'success');
      setTestimonialFormOpen(false);
      fetchData();
    } catch (err) {
      showNotice('Error saving testimonial.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm('Delete this testimonial?')) return;
    try {
      const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showNotice('Testimonial deleted.', 'success');
      fetchData();
    } catch (err) {
      showNotice('Error deleting testimonial.', 'error');
    }
  };

  // INQUIRY ACTIONS
  const toggleInquiryStatus = async (id: number, currentStatus: string) => {
    const nextStatus = currentStatus === 'UNREAD' ? 'READ' : 'ARCHIVED';
    try {
      const res = await fetch(`/api/inquiries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error();
      fetchData();
    } catch (err) {
      showNotice('Failed to update inquiry status.', 'error');
    }
  };

  const deleteInquiry = async (id: number) => {
    if (!confirm('Permanently delete this inquiry?')) return;
    try {
      const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      showNotice('Inquiry deleted.', 'success');
      fetchData();
    } catch (err) {
      showNotice('Failed to delete inquiry.', 'error');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary-white flex flex-col justify-center items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-soft-clay" />
        <span className="text-sm font-light text-charcoal/60">Verifying session...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-primary-white flex flex-col md:flex-row">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-charcoal text-primary-beige p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-charcoal/30">
        <div className="space-y-12">
          <div className="space-y-2">
            <h1 className="font-serif text-xl tracking-wider uppercase">Studio Dashboard</h1>
            <p className="text-[10px] tracking-widest text-primary-beige/40 uppercase">Content Control Room</p>
          </div>

          <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-colors cursor-pointer w-full text-left whitespace-nowrap ${activeTab === 'overview' ? 'bg-primary-beige text-charcoal' : 'hover:bg-primary-beige/10'}`}
            >
              <LayoutDashboard className="w-4 h-4 flex-shrink-0" /> Overview
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-colors cursor-pointer w-full text-left whitespace-nowrap ${activeTab === 'settings' ? 'bg-primary-beige text-charcoal' : 'hover:bg-primary-beige/10'}`}
            >
              <Settings className="w-4 h-4 flex-shrink-0" /> Site Copy
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-colors cursor-pointer w-full text-left whitespace-nowrap ${activeTab === 'projects' ? 'bg-primary-beige text-charcoal' : 'hover:bg-primary-beige/10'}`}
            >
              <FolderKanban className="w-4 h-4 flex-shrink-0" /> Portfolio
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-colors cursor-pointer w-full text-left whitespace-nowrap ${activeTab === 'services' ? 'bg-primary-beige text-charcoal' : 'hover:bg-primary-beige/10'}`}
            >
              <Briefcase className="w-4 h-4 flex-shrink-0" /> Services
            </button>
            <button
              onClick={() => setActiveTab('testimonials')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-colors cursor-pointer w-full text-left whitespace-nowrap ${activeTab === 'testimonials' ? 'bg-primary-beige text-charcoal' : 'hover:bg-primary-beige/10'}`}
            >
              <MessageSquare className="w-4 h-4 flex-shrink-0" /> Testimonials
            </button>
            <button
              onClick={() => setActiveTab('inquiries')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-colors cursor-pointer w-full text-left relative whitespace-nowrap ${activeTab === 'inquiries' ? 'bg-primary-beige text-charcoal' : 'hover:bg-primary-beige/10'}`}
            >
              <Inbox className="w-4 h-4 flex-shrink-0" /> Leads
              {inquiries.filter(i => i.status === 'UNREAD').length > 0 && (
                <span className="ml-auto bg-amber-500 text-charcoal font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0">
                  {inquiries.filter(i => i.status === 'UNREAD').length}
                </span>
              )}
            </button>
          </nav>
        </div>

        <div className="pt-8 border-t border-primary-beige/10 mt-auto flex flex-col gap-4">
          <a
            href="/"
            target="_blank"
            className="flex items-center gap-3 px-4 py-2 border border-primary-beige/20 hover:bg-primary-beige/10 text-xs tracking-wider uppercase font-semibold rounded-xl text-center"
          >
            <Globe className="w-3.5 h-3.5" /> View Live Site
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-rose-300 hover:bg-rose-500/10 rounded-xl cursor-pointer text-left transition-colors"
          >
            <LogOut className="w-4 h-4" /> Log Out
          </button>
        </div>
      </aside>

      {/* DASHBOARD WORKSPACE AREA */}
      <main className="flex-grow p-6 sm:p-10 lg:p-12 space-y-8 overflow-y-auto max-h-screen">
        
        {/* Alerts / Banner Notifications */}
        {message.text && (
          <div className={`p-4 rounded-xl flex items-center gap-3 text-sm border ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-rose-50 text-rose-800 border-rose-200'}`}>
            {message.type === 'success' ? <Check className="w-5 h-5 text-emerald-600" /> : <AlertCircle className="w-5 h-5 text-rose-600" />}
            <p>{message.text}</p>
          </div>
        )}

        {/* ==================== OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-wide text-charcoal">Studio Status</h2>
              <p className="text-xs uppercase tracking-widest text-soft-clay mt-1">Analytical Snapshot & Action Center</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-primary-beige/30 p-6 rounded-2xl border border-primary-beige/50 space-y-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-soft-clay">Studio Identity</span>
                <p className="font-serif text-2xl truncate">{settings.siteName || 'No Name Set'}</p>
              </div>
              <div className="bg-primary-beige/30 p-6 rounded-2xl border border-primary-beige/50 space-y-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-soft-clay">Portfolio Projects</span>
                <p className="font-serif text-3xl font-semibold">{projects.length}</p>
              </div>
              <div className="bg-primary-beige/30 p-6 rounded-2xl border border-primary-beige/50 space-y-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-soft-clay">Active Leads</span>
                <p className="font-serif text-3xl font-semibold text-amber-600">
                  {inquiries.filter(i => i.status === 'UNREAD').length} Unread
                </p>
              </div>
              <div className="bg-primary-beige/30 p-6 rounded-2xl border border-primary-beige/50 space-y-2">
                <span className="text-xs uppercase tracking-widest font-semibold text-soft-clay">Service Catalog</span>
                <p className="font-serif text-3xl font-semibold">{services.length} items</p>
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-primary-beige/10 border border-primary-beige/70 p-6 sm:p-8 rounded-2xl space-y-4">
              <h3 className="font-serif text-xl tracking-wide">Quick Controls</h3>
              <div className="flex flex-wrap gap-4">
                <button onClick={openNewProject} className="inline-flex items-center gap-2 bg-charcoal text-primary-white px-5 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /> Add Project
                </button>
                <button onClick={openNewService} className="inline-flex items-center gap-2 border border-charcoal/20 text-charcoal px-5 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-primary-beige/40 transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /> Add Service
                </button>
                <button onClick={openNewTestimonial} className="inline-flex items-center gap-2 border border-charcoal/20 text-charcoal px-5 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-primary-beige/40 transition-colors cursor-pointer">
                  <Plus className="w-4 h-4" /> Add Testimonial
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ==================== SITE SETTINGS (COPY) TAB ==================== */}
        {activeTab === 'settings' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-wide text-charcoal">Edit Website Copy</h2>
              <p className="text-xs uppercase tracking-widest text-soft-clay mt-1">Modify headers, texts, and contact coordinates dynamically</p>
            </div>

            <form onSubmit={saveSettings} className="space-y-6 bg-primary-beige/10 p-8 sm:p-10 rounded-2xl border border-primary-beige/65">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Studio Brand Name</label>
                  <input
                    type="text"
                    required
                    value={settings.siteName}
                    onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Contact Inquiries Email</label>
                  <input
                    type="email"
                    required
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Landing Page Hero Headline</label>
                  <input
                    type="text"
                    required
                    value={settings.heroTitle}
                    onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Hero Small Category Tag</label>
                  <input
                    type="text"
                    required
                    value={settings.heroTag}
                    onChange={(e) => setSettings({ ...settings, heroTag: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="Interior Architecture & Design"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Hero Subtitle / Tagline</label>
                  <textarea
                    rows={2}
                    required
                    value={settings.heroSubtitle}
                    onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Portfolio Showcase Subdescription</label>
                  <textarea
                    rows={2}
                    required
                    value={settings.portfolioDesc}
                    onChange={(e) => setSettings({ ...settings, portfolioDesc: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">About/Philosophy Headline</label>
                <input
                  type="text"
                  required
                  value={settings.aboutTitle}
                  onChange={(e) => setSettings({ ...settings, aboutTitle: e.target.value })}
                  className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">About Narrative Description</label>
                <textarea
                  rows={4}
                  required
                  value={settings.aboutText}
                  onChange={(e) => setSettings({ ...settings, aboutText: e.target.value })}
                  className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Services Catalog Subdescription</label>
                  <textarea
                    rows={3}
                    required
                    value={settings.servicesDesc}
                    onChange={(e) => setSettings({ ...settings, servicesDesc: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Contact Section Subdescription</label>
                  <textarea
                    rows={3}
                    required
                    value={settings.contactDesc}
                    onChange={(e) => setSettings({ ...settings, contactDesc: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Contact Hotline</label>
                  <input
                    type="text"
                    value={settings.contactPhone || ''}
                    onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Studio physical address</label>
                  <input
                    type="text"
                    value={settings.contactAddress || ''}
                    onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="123 Plaster St, NY"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Instagram Profile URL</label>
                  <input
                    type="text"
                    required
                    value={settings.instagramUrl}
                    onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="https://instagram.com/studio"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Pinterest Profile URL</label>
                  <input
                    type="text"
                    required
                    value={settings.pinterestUrl}
                    onChange={(e) => setSettings({ ...settings, pinterestUrl: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="https://pinterest.com/studio"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">LinkedIn Profile URL</label>
                  <input
                    type="text"
                    required
                    value={settings.linkedinUrl}
                    onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                    className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                    placeholder="https://linkedin.com/in/studio"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70 font-bold text-soft-clay">Footer Brand Manifesto / Description</label>
                <textarea
                  rows={2}
                  required
                  value={settings.footerManifesto}
                  onChange={(e) => setSettings({ ...settings, footerManifesto: e.target.value })}
                  className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Website Footer Copyright Text</label>
                <input
                  type="text"
                  required
                  value={settings.copyrightText}
                  onChange={(e) => setSettings({ ...settings, copyrightText: e.target.value })}
                  className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                  placeholder="© 2026 Studio Eliza Vance. All Rights Reserved."
                />
              </div>

              {/* Color Configuration Section */}
              <div className="border-t border-primary-beige/70 pt-6 space-y-4">
                <h4 className="text-xs uppercase tracking-widest font-bold text-soft-clay">Website Theme Colors</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                  
                  <div className="space-y-2 bg-primary-white p-4 rounded-xl border border-charcoal/10 flex flex-col justify-between">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-charcoal/70">Primary Beige</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="color"
                        value={settings.primaryBeige || '#F4EFEA'}
                        onChange={(e) => setSettings({ ...settings, primaryBeige: e.target.value })}
                        className="w-10 h-10 border border-charcoal/10 rounded-lg cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.primaryBeige || '#F4EFEA'}
                        onChange={(e) => setSettings({ ...settings, primaryBeige: e.target.value })}
                        className="w-full text-xs bg-transparent border-b border-charcoal/10 py-1 uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 bg-primary-white p-4 rounded-xl border border-charcoal/10 flex flex-col justify-between">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-charcoal/70">Background White</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="color"
                        value={settings.primaryWhite || '#FAFAF9'}
                        onChange={(e) => setSettings({ ...settings, primaryWhite: e.target.value })}
                        className="w-10 h-10 border border-charcoal/10 rounded-lg cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.primaryWhite || '#FAFAF9'}
                        onChange={(e) => setSettings({ ...settings, primaryWhite: e.target.value })}
                        className="w-full text-xs bg-transparent border-b border-charcoal/10 py-1 uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 bg-primary-white p-4 rounded-xl border border-charcoal/10 flex flex-col justify-between">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-charcoal/70">Charcoal / Text</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="color"
                        value={settings.primaryCharcoal || '#1C1B1A'}
                        onChange={(e) => setSettings({ ...settings, primaryCharcoal: e.target.value })}
                        className="w-10 h-10 border border-charcoal/10 rounded-lg cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.primaryCharcoal || '#1C1B1A'}
                        onChange={(e) => setSettings({ ...settings, primaryCharcoal: e.target.value })}
                        className="w-full text-xs bg-transparent border-b border-charcoal/10 py-1 uppercase"
                      />
                    </div>
                  </div>

                  <div className="space-y-2 bg-primary-white p-4 rounded-xl border border-charcoal/10 flex flex-col justify-between">
                    <label className="text-[10px] uppercase tracking-widest font-semibold text-charcoal/70">Soft Clay / Accent</label>
                    <div className="flex items-center gap-3 mt-2">
                      <input
                        type="color"
                        value={settings.primaryAccent || '#8B7E74'}
                        onChange={(e) => setSettings({ ...settings, primaryAccent: e.target.value })}
                        className="w-10 h-10 border border-charcoal/10 rounded-lg cursor-pointer p-0 bg-transparent"
                      />
                      <input
                        type="text"
                        value={settings.primaryAccent || '#8B7E74'}
                        onChange={(e) => setSettings({ ...settings, primaryAccent: e.target.value })}
                        className="w-full text-xs bg-transparent border-b border-charcoal/10 py-1 uppercase"
                      />
                    </div>
                  </div>

                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 bg-charcoal text-primary-white px-8 py-4 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 transition-all cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Saving Configurations...' : 'Save Site Copy'}
              </button>
            </form>
          </div>
        )}

        {/* ==================== PORTFOLIO PROJECTS TAB ==================== */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl tracking-wide text-charcoal">Portfolio Projects</h2>
                <p className="text-xs uppercase tracking-widest text-soft-clay mt-1">Manage architectural and styling spaces shown in gallery</p>
              </div>
              <button onClick={openNewProject} className="inline-flex items-center gap-2 bg-charcoal text-primary-white px-5 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 transition-colors cursor-pointer">
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>

            {/* Project List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(project => (
                <div key={project.id} className="bg-primary-white rounded-2xl border border-primary-beige/80 overflow-hidden flex flex-col justify-between shadow-sm">
                  <div className="relative aspect-[4/3] bg-primary-beige border-b border-primary-beige">
                    <img src={project.coverImage} alt={project.title} className="w-full h-full object-cover" />
                    {project.isFeatured && (
                      <span className="absolute top-4 left-4 bg-amber-500 text-charcoal font-bold text-[9px] uppercase tracking-widest px-2.5 py-1 rounded-full shadow-sm">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-6 flex-grow space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-serif text-lg tracking-wide">{project.title}</h3>
                        <p className="text-xs text-charcoal/50 mt-0.5">{project.location || 'No Location'} • {project.year || 'No Year'}</p>
                      </div>
                      <span className="text-[9px] uppercase font-semibold text-soft-clay px-2.5 py-1 border border-primary-beige rounded-full bg-primary-beige/25">
                        {project.category}
                      </span>
                    </div>
                    <p className="text-xs text-charcoal/60 leading-relaxed line-clamp-2">{project.description}</p>
                  </div>
                  <div className="px-6 py-4 bg-primary-beige/10 border-t border-primary-beige/50 flex justify-between gap-4">
                    <button
                      onClick={() => openEditProject(project)}
                      className="inline-flex items-center gap-1.5 text-xs text-charcoal/70 hover:text-charcoal uppercase tracking-wider font-semibold"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      onClick={() => deleteProject(project.id)}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 uppercase tracking-wider font-semibold cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Add/Edit Project Modal */}
            {projectFormOpen && editingProject && (
              <div className="fixed inset-0 z-50 bg-charcoal/30 backdrop-blur-sm flex justify-center items-center p-4 overflow-y-auto">
                <div className="bg-primary-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-primary-beige shadow-2xl p-8 space-y-8 animate-scaleUp">
                  
                  <div className="flex justify-between items-center border-b border-primary-beige/80 pb-4">
                    <h3 className="font-serif text-2xl tracking-wide text-charcoal">
                      {editingProject.id ? 'Edit Portfolio Project' : 'New Portfolio Project'}
                    </h3>
                    <button onClick={() => setProjectFormOpen(false)} className="p-1 text-charcoal/40 hover:text-charcoal">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={saveProject} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Project Name *</label>
                        <input
                          type="text"
                          required
                          value={editingProject.title || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                          className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Unique URL Slug *</label>
                        <input
                          type="text"
                          required
                          value={editingProject.slug || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                          className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                          placeholder="chelsea-penthouse"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Location</label>
                        <input
                          type="text"
                          value={editingProject.location || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, location: e.target.value })}
                          className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                          placeholder="SoHo, NY"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Year</label>
                        <input
                          type="text"
                          value={editingProject.year || ''}
                          onChange={(e) => setEditingProject({ ...editingProject, year: e.target.value })}
                          className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors"
                          placeholder="2024"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Category *</label>
                        <select
                          value={editingProject.category || 'Residential'}
                          onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                          className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors h-11"
                        >
                          <option value="Residential">Residential</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Styling">Styling</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Project Narrative Description *</label>
                      <textarea
                        rows={4}
                        required
                        value={editingProject.description || ''}
                        onChange={(e) => setEditingProject({ ...editingProject, description: e.target.value })}
                        className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal transition-colors resize-none"
                      />
                    </div>

                    {/* Image Upload Inputs */}
                    <div className="space-y-4 border border-primary-beige p-6 rounded-2xl bg-primary-beige/10">
                      <h4 className="text-xs uppercase tracking-widest font-bold text-soft-clay">Project Cover Photo *</h4>
                      <div className="flex flex-col sm:flex-row gap-4 items-center">
                        {editingProject.coverImage && (
                          <img src={editingProject.coverImage} className="w-24 h-24 object-cover rounded-xl border" />
                        )}
                        <div className="flex-grow space-y-2">
                          <input
                            type="text"
                            required
                            placeholder="/uploads/myimage.jpg"
                            value={editingProject.coverImage || ''}
                            onChange={(e) => setEditingProject({ ...editingProject, coverImage: e.target.value })}
                            className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-charcoal"
                          />
                          <label className="flex items-center gap-2 w-fit px-4 py-2 bg-charcoal/5 border border-charcoal/10 hover:bg-charcoal/10 text-xs tracking-wider uppercase font-semibold rounded-lg cursor-pointer transition-colors">
                            <Upload className="w-3.5 h-3.5" /> Upload File
                            <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'cover')} className="hidden" />
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Sub gallery images */}
                    <div className="space-y-4 border border-primary-beige p-6 rounded-2xl bg-primary-beige/10">
                      <div className="flex justify-between items-center">
                        <h4 className="text-xs uppercase tracking-widest font-bold text-soft-clay">Gallery Details Showcase</h4>
                        <button
                          type="button"
                          onClick={() => setGalleryInputs([...galleryInputs, ''])}
                          className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-charcoal/70 hover:text-charcoal tracking-widest"
                        >
                          <Plus className="w-3 h-3" /> Add Gallery Slot
                        </button>
                      </div>

                      <div className="space-y-4">
                        {galleryInputs.map((val, idx) => (
                          <div key={idx} className="flex gap-4 items-center border-b border-primary-beige/60 pb-4 last:border-b-0 last:pb-0">
                            {val && <img src={val} className="w-16 h-16 object-cover rounded-lg border" />}
                            <div className="flex-grow space-y-1">
                              <input
                                type="text"
                                placeholder={`/uploads/gallery_${idx + 1}.jpg`}
                                value={val}
                                onChange={(e) => {
                                  const updated = [...galleryInputs];
                                  updated[idx] = e.target.value;
                                  setGalleryInputs(updated);
                                }}
                                className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-charcoal"
                              />
                              <label className="flex items-center gap-2 w-fit px-3 py-1.5 bg-charcoal/5 border border-charcoal/10 hover:bg-charcoal/10 text-[10px] tracking-wider uppercase font-semibold rounded-md cursor-pointer transition-colors">
                                <Upload className="w-3 h-3" /> Upload File
                                <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'gallery', idx)} className="hidden" />
                              </label>
                            </div>
                            <button
                              type="button"
                              onClick={() => setGalleryInputs(galleryInputs.filter((_, i) => i !== idx))}
                              className="text-rose-600 hover:text-rose-700 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="isFeatured"
                        checked={editingProject.isFeatured || false}
                        onChange={(e) => setEditingProject({ ...editingProject, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded text-soft-clay focus:ring-soft-clay cursor-pointer"
                      />
                      <label htmlFor="isFeatured" className="text-xs uppercase tracking-widest font-semibold text-charcoal/70 cursor-pointer">
                        Feature this project on the homepage
                      </label>
                    </div>

                    <div className="border-t border-primary-beige pt-6 flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setProjectFormOpen(false)}
                        className="px-6 py-3 border border-charcoal/20 text-charcoal rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-primary-beige/35 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-charcoal text-primary-white px-8 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save Project'}
                      </button>
                    </div>
                  </form>

                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== SERVICES TAB ==================== */}
        {activeTab === 'services' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl tracking-wide text-charcoal">Design Services</h2>
                <p className="text-xs uppercase tracking-widest text-soft-clay mt-1">Manage core services offered by the studio</p>
              </div>
              <button onClick={openNewService} className="inline-flex items-center gap-2 bg-charcoal text-primary-white px-5 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 transition-colors cursor-pointer">
                <Plus className="w-4 h-4" /> Add Service
              </button>
            </div>

            {/* Services List */}
            <div className="space-y-4">
              {services.map(service => (
                <div key={service.id} className="bg-primary-white p-6 rounded-2xl border border-primary-beige/80 flex justify-between items-start shadow-sm gap-6">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="text-xs uppercase font-bold text-soft-clay px-2.5 py-1 border border-primary-beige rounded-full bg-primary-beige/20">
                        Icon: {service.icon}
                      </span>
                      {service.priceRange && (
                        <span className="text-[10px] uppercase font-semibold text-charcoal/50">
                          Tier: {service.priceRange}
                        </span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg tracking-wide">{service.title}</h3>
                    <p className="text-xs text-charcoal/70 leading-relaxed max-w-2xl">{service.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                    <button onClick={() => openEditService(service)} className="inline-flex items-center gap-1.5 text-xs text-charcoal/70 hover:text-charcoal uppercase tracking-wider font-semibold">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => deleteService(service.id)} className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 uppercase tracking-wider font-semibold cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Service Form Modal */}
            {serviceFormOpen && editingService && (
              <div className="fixed inset-0 z-50 bg-charcoal/30 backdrop-blur-sm flex justify-center items-center p-4">
                <div className="bg-primary-white rounded-3xl w-full max-w-xl border border-primary-beige shadow-2xl p-8 space-y-6">
                  <div className="flex justify-between items-center border-b border-primary-beige pb-4">
                    <h3 className="font-serif text-xl tracking-wide">
                      {editingService.id ? 'Edit Service Catalog' : 'New Service'}
                    </h3>
                    <button onClick={() => setServiceFormOpen(false)} className="p-1 text-charcoal/40 hover:text-charcoal">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={saveService} className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Service Title *</label>
                      <input
                        type="text"
                        required
                        value={editingService.title || ''}
                        onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                        className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Icon Asset</label>
                        <select
                          value={editingService.icon || 'Home'}
                          onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                          className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal h-11"
                        >
                          <option value="Home">Home (Residential)</option>
                          <option value="Briefcase">Briefcase (Commercial)</option>
                          <option value="Sparkles">Sparkles (Art & Curation)</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Price Range Tier</label>
                        <input
                          type="text"
                          value={editingService.priceRange || ''}
                          onChange={(e) => setEditingService({ ...editingService, priceRange: e.target.value })}
                          className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal"
                          placeholder="e.g. $$, $$$, $$$$"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingService.description || ''}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal resize-none"
                      />
                    </div>

                    <div className="border-t border-primary-beige pt-6 flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setServiceFormOpen(false)}
                        className="px-6 py-2.5 border border-charcoal/20 text-charcoal rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-primary-beige/35 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-charcoal text-primary-white px-8 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== TESTIMONIALS TAB ==================== */}
        {activeTab === 'testimonials' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl tracking-wide text-charcoal">Client Testimonials</h2>
                <p className="text-xs uppercase tracking-widest text-soft-clay mt-1">Manage reviews and quotes displayed on the website</p>
              </div>
              <button onClick={openNewTestimonial} className="inline-flex items-center gap-2 bg-charcoal text-primary-white px-5 py-3 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 transition-colors cursor-pointer">
                <Plus className="w-4 h-4" /> Add Testimonial
              </button>
            </div>

            {/* Testimonials List */}
            <div className="space-y-4">
              {testimonials.map(t => (
                <div key={t.id} className="bg-primary-white p-6 rounded-2xl border border-primary-beige/80 flex justify-between items-start shadow-sm gap-6">
                  <div className="space-y-2 flex-grow">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold tracking-wide">{t.clientName}</span>
                      {t.company && <span className="text-xs text-charcoal/50 font-light">• {t.company}</span>}
                      {t.isFeatured && (
                        <span className="bg-amber-500 text-charcoal text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded">
                          Featured
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal/70 leading-relaxed max-w-2xl italic font-light">"{t.quote}"</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                    <button onClick={() => openEditTestimonial(t)} className="inline-flex items-center gap-1.5 text-xs text-charcoal/70 hover:text-charcoal uppercase tracking-wider font-semibold">
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button onClick={() => deleteTestimonial(t.id)} className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 uppercase tracking-wider font-semibold cursor-pointer">
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial Form Modal */}
            {testimonialFormOpen && editingTestimonial && (
              <div className="fixed inset-0 z-50 bg-charcoal/30 backdrop-blur-sm flex justify-center items-center p-4">
                <div className="bg-primary-white rounded-3xl w-full max-w-xl border border-primary-beige shadow-2xl p-8 space-y-6">
                  <div className="flex justify-between items-center border-b border-primary-beige pb-4">
                    <h3 className="font-serif text-xl tracking-wide">
                      {editingTestimonial.id ? 'Edit Testimonial' : 'New Testimonial'}
                    </h3>
                    <button onClick={() => setTestimonialFormOpen(false)} className="p-1 text-charcoal/40 hover:text-charcoal">
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={saveTestimonial} className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Client Name *</label>
                        <input
                          type="text"
                          required
                          value={editingTestimonial.clientName || ''}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })}
                          className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Client Company</label>
                        <input
                          type="text"
                          value={editingTestimonial.company || ''}
                          onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                          className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal"
                          placeholder="e.g. Architect Assoc."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-widest font-semibold text-charcoal/70">Quote *</label>
                      <textarea
                        rows={3}
                        required
                        value={editingTestimonial.quote || ''}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })}
                        className="w-full bg-primary-white border border-charcoal/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-charcoal resize-none"
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="tFeatured"
                        checked={editingTestimonial.isFeatured || false}
                        onChange={(e) => setEditingTestimonial({ ...editingTestimonial, isFeatured: e.target.checked })}
                        className="w-4 h-4 rounded text-soft-clay focus:ring-soft-clay cursor-pointer"
                      />
                      <label htmlFor="tFeatured" className="text-xs uppercase tracking-widest font-semibold text-charcoal/70 cursor-pointer">
                        Display testimonial on homepage
                      </label>
                    </div>

                    <div className="border-t border-primary-beige pt-6 flex justify-end gap-4">
                      <button
                        type="button"
                        onClick={() => setTestimonialFormOpen(false)}
                        className="px-6 py-2.5 border border-charcoal/20 text-charcoal rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-primary-beige/35 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-charcoal text-primary-white px-8 py-2.5 rounded-xl text-xs uppercase tracking-widest font-semibold hover:bg-charcoal/90 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        {loading ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== INQUIRIES / LEADS TAB ==================== */}
        {activeTab === 'inquiries' && (
          <div className="space-y-8 animate-fadeIn max-w-5xl">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-wide text-charcoal">Client Leads Inbox</h2>
              <p className="text-xs uppercase tracking-widest text-soft-clay mt-1">Review, track, and manage client project submissions</p>
            </div>

            <div className="space-y-4">
              {inquiries.length > 0 ? (
                inquiries.map(inquiry => (
                  <div key={inquiry.id} className={`p-6 rounded-2xl border flex flex-col sm:flex-row justify-between items-start gap-6 shadow-sm transition-colors ${inquiry.status === 'UNREAD' ? 'bg-amber-50/20 border-amber-200' : 'bg-primary-white border-primary-beige/85'}`}>
                    <div className="space-y-4 flex-grow">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-semibold text-sm tracking-wide text-charcoal">{inquiry.name}</span>
                        <a href={`mailto:${inquiry.email}`} className="text-xs text-soft-clay hover:underline">{inquiry.email}</a>
                        {inquiry.phone && <span className="text-xs text-charcoal/40">• {inquiry.phone}</span>}
                        <span className="text-[10px] text-charcoal/40">
                          {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-charcoal/70 leading-relaxed font-light whitespace-pre-line bg-primary-beige/10 p-4 rounded-xl border border-primary-beige/40">
                        {inquiry.message}
                      </p>
                    </div>

                    <div className="flex flex-row sm:flex-col gap-2 flex-shrink-0 w-full sm:w-auto">
                      <button
                        onClick={() => toggleInquiryStatus(inquiry.id, inquiry.status)}
                        className={`px-4 py-2 border rounded-xl text-[10px] uppercase font-bold tracking-widest cursor-pointer w-full text-center hover:bg-primary-beige/10 transition-colors ${inquiry.status === 'UNREAD' ? 'border-amber-400 text-amber-700 bg-amber-50/40' : 'border-charcoal/20 text-charcoal/70'}`}
                      >
                        {inquiry.status === 'UNREAD' ? 'Mark Read' : 'Archive'}
                      </button>
                      <button
                        onClick={() => deleteInquiry(inquiry.id)}
                        className="px-4 py-2 border border-rose-200 text-rose-600 hover:text-rose-700 hover:bg-rose-50/20 rounded-xl text-[10px] uppercase font-bold tracking-widest cursor-pointer w-full text-center transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-20 bg-primary-beige/20 border border-dashed border-primary-beige rounded-2xl text-charcoal/40 font-light text-sm">
                  Inbox is empty. Visitor submissions will appear here.
                </div>
              )}
            </div>
          </div>
        )}

      </main>

    </div>
  );
}
