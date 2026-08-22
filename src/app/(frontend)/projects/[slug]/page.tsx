import prisma from '@/backend/db';
import Navbar from '@/frontend/components/Navbar';
import Footer from '@/frontend/components/Footer';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Calendar, Layers } from 'lucide-react';
import GSAPWrapper from '@/frontend/components/GSAPWrapper';

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0;

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;

  // Query site settings and current project details
  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } }) || {
    siteName: 'Studio Eliza Vance',
    contactEmail: 'studio@elizavance.com',
    contactPhone: '+1 (555) 123-4567',
    contactAddress: '124 Elegant Way, New York, NY 10001',
    copyrightText: '© 2026 Studio Eliza Vance. All Rights Reserved.',
    footerManifesto: 'Curating architectural balance, rich natural textures, and bespoke modern environments.',
    instagramUrl: '#',
    pinterestUrl: '#',
    linkedinUrl: '#',
  };

  const project = await prisma.project.findUnique({
    where: { slug },
    include: { images: true },
  });

  if (!project) {
    notFound();
  }

  return (
    <>
      <GSAPWrapper />
      <Navbar siteName={settings.siteName} />
      
      <main className="flex-grow bg-primary-white py-16 sm:py-24 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto space-y-12 sm:space-y-16">
          
          {/* Back Button */}
          <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-soft-clay hover:text-charcoal transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to Gallery
          </Link>

          {/* Project Editorial Hero */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-soft-clay px-3 py-1 border border-primary-beige rounded-full bg-primary-beige/20 w-fit block gsap-reveal-text">
                {project.category}
              </span>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-wide leading-tight gsap-reveal-text">
                {project.title}
              </h1>
              <p className="text-sm sm:text-base font-light text-charcoal/70 leading-relaxed whitespace-pre-line gsap-reveal-text">
                {project.description}
              </p>
            </div>

            {/* Project Specifications */}
            <div className="lg:col-span-5 bg-primary-beige/30 p-8 sm:p-10 rounded-2xl border border-primary-beige/50 space-y-6 gsap-reveal-image">
              <h3 className="font-serif text-lg tracking-wide border-b border-primary-beige/80 pb-4">Project Overview</h3>
              <div className="space-y-4">
                {project.location && (
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-soft-clay flex-shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest font-semibold text-charcoal/50">Location</span>
                      <span className="text-sm font-light">{project.location}</span>
                    </div>
                  </div>
                )}
                {project.year && (
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-soft-clay flex-shrink-0" />
                    <div>
                      <span className="block text-[10px] uppercase tracking-widest font-semibold text-charcoal/50">Year Completed</span>
                      <span className="text-sm font-light">{project.year}</span>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Layers className="w-4 h-4 text-soft-clay flex-shrink-0" />
                  <div>
                    <span className="block text-[10px] uppercase tracking-widest font-semibold text-charcoal/50">Category</span>
                    <span className="text-sm font-light">{project.category}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Asymmetric Gallery Layout with Dynamic GSAP Reveals */}
          <div className="space-y-12 pt-8">
            <div className="relative aspect-[16/9] w-full bg-primary-beige overflow-hidden rounded-3xl border border-primary-beige gsap-reveal-image gsap-parallax">
              <img
                src={project.coverImage}
                alt={`${project.title} cover`}
                className="w-full h-full object-cover"
              />
            </div>

            {project.images.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 gsap-stagger-container">
                {project.images.map((img, index) => (
                  <div key={img.id} className="gsap-stagger-item">
                    <div className="relative aspect-[4/3] w-full bg-primary-beige overflow-hidden rounded-2xl border border-primary-beige gsap-reveal-image gsap-parallax">
                      <img
                        src={img.url}
                        alt={`${project.title} detail ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-[1.05] transition-transform duration-[1.5s]"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer
        siteName={settings.siteName}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        contactAddress={settings.contactAddress}
        copyrightText={settings.copyrightText}
        footerManifesto={settings.footerManifesto}
        instagramUrl={settings.instagramUrl}
        pinterestUrl={settings.pinterestUrl}
        linkedinUrl={settings.linkedinUrl}
      />
    </>
  );
}
