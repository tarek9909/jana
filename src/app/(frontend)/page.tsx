import prisma from '@/backend/db';
import Navbar from '@/frontend/components/Navbar';
import Footer from '@/frontend/components/Footer';
import Link from 'next/link';
import { ArrowUpRight, Home, Briefcase, Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import ContactForm from '@/frontend/components/ContactForm';
import GSAPWrapper from '@/frontend/components/GSAPWrapper';

export const revalidate = 0; // Disable server caching to show dashboard updates instantly

export default async function HomePage() {
  // Query DB directly
  const settings = await prisma.siteSettings.findFirst({ where: { id: 1 } }) || {
    siteName: 'Studio Eliza Vance',
    heroTitle: 'Curating Luxury Spaces',
    heroSubtitle: 'Bespoke interior architecture and design for sophisticated homes. We blend timeless elegance with modern function.',
    aboutTitle: 'Our Philosophy',
    aboutText: 'We believe that interior design is not just about making spaces beautiful, but about curating environments that inspire and enrich daily life. Our work is defined by clean lines, rich natural textures, and a harmonious balance between light and form. Every project is a collaborative journey to translate our client\'s unique essence into a tangible, sophisticated environment.',
    contactEmail: 'studio@elizavance.com',
    contactPhone: '+1 (555) 123-4567',
    contactAddress: '124 Elegant Way, Suite A, New York, NY 10001',
    copyrightText: '© 2026 Studio Eliza Vance. All Rights Reserved.',
    heroTag: 'Interior Architecture & Design',
    footerManifesto: 'Curating architectural balance, rich natural textures, and bespoke modern environments.',
    portfolioDesc: 'A gallery of luxury residential and commercial environments curated with spatial elegance.',
    servicesDesc: 'From luxury residential designs to curated art programs, we guide you through space planning, selection, and placement.',
    contactDesc: 'We design residential and commercial environments worldwide. Fill out our project form to tell us about your layout goals.',
    instagramUrl: '#',
    pinterestUrl: '#',
    linkedinUrl: '#',
  };

  const projects = await prisma.project.findMany({
    include: { images: true },
    orderBy: { createdAt: 'desc' },
  });

  const services = await prisma.service.findMany({
    take: 3,
  });

  const testimonials = await prisma.testimonial.findMany({
    take: 3,
    orderBy: { createdAt: 'desc' },
  });

  // Map icon names to Lucide elements
  const getIcon = (name: string) => {
    switch (name) {
      case 'Home': return <Home className="w-6 h-6 text-soft-clay" />;
      case 'Briefcase': return <Briefcase className="w-6 h-6 text-soft-clay" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-soft-clay" />;
      default: return <Sparkles className="w-6 h-6 text-soft-clay" />;
    }
  };

  return (
    <>
      <GSAPWrapper />
      <Navbar siteName={settings.siteName} />
      
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative min-h-[85vh] flex items-center bg-primary-white px-6 sm:px-8 lg:px-12 py-20 border-b border-primary-beige overflow-hidden">
          <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-center">
            
            {/* Hero Text */}
            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="text-xs uppercase tracking-widest font-semibold text-soft-clay block mb-4 gsap-reveal-text">
                  {settings.heroTag || 'Interior Architecture & Design'}
                </span>
                <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight text-charcoal gsap-reveal-text">
                  {settings.heroTitle}
                </h1>
              </div>

              <p className="text-base sm:text-lg text-charcoal/70 font-light leading-relaxed max-w-xl gsap-reveal-text">
                {settings.heroSubtitle}
              </p>

              <div className="flex gap-4 gsap-reveal-text">
                <a
                  href="#portfolio"
                  className="inline-flex items-center gap-2 bg-charcoal text-primary-white px-8 py-4 rounded-xl text-sm font-semibold tracking-widest uppercase hover:bg-charcoal/90 transition-all shadow-sm"
                >
                  View Portfolio
                </a>
                <a
                  href="#contact"
                  className="inline-flex items-center gap-2 border border-charcoal/20 text-charcoal px-8 py-4 rounded-xl text-sm font-semibold tracking-widest uppercase hover:bg-primary-beige/55 transition-all"
                >
                  Get In Touch
                </a>
              </div>
            </div>

            {/* Hero Image with Parallax & Premium Mask Reveal */}
            <div className="lg:col-span-6">
              <div className="relative aspect-[4/3] w-full bg-primary-beige overflow-hidden rounded-3xl shadow-lg border border-primary-beige gsap-reveal-image gsap-parallax">
                {projects.length > 0 ? (
                  <img
                    src={projects[0].coverImage}
                    alt={projects[0].title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-charcoal/30 text-sm">
                    [ Luxury Interior Design Asset ]
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* PORTFOLIO GALLERY */}
        <section id="portfolio" className="py-24 lg:py-36 bg-primary-white px-6 sm:px-8 lg:px-12 border-b border-primary-beige">
          <div className="max-w-7xl mx-auto space-y-16">
            
            <div className="flex flex-col md:flex-row justify-between items-baseline gap-4">
              <div className="space-y-3">
                <span className="text-xs uppercase tracking-widest font-semibold text-soft-clay block gsap-reveal-text">Selected Work</span>
                <h2 className="font-serif text-3xl sm:text-4xl tracking-wide gsap-reveal-text">Featured Projects</h2>
              </div>
              <p className="text-sm font-light text-charcoal/50 max-w-xs leading-relaxed gsap-reveal-text">
                {settings.portfolioDesc || 'A gallery of luxury residential and commercial environments curated with spatial elegance.'}
              </p>
            </div>

            {projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <div key={project.id} className="space-y-4">
                    <Link href={`/projects/${project.slug}`} className="group block space-y-4">
                      {/* Premium Image reveals for grid entries */}
                      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-primary-beige border border-primary-beige/50 gsap-reveal-image gsap-parallax">
                        <img
                          src={project.coverImage}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                          <span className="text-primary-white flex items-center gap-1 text-sm tracking-wider uppercase font-semibold">
                            View Project <ArrowUpRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-start pt-2 gsap-reveal-text">
                        <div>
                          <h3 className="font-serif text-xl tracking-wide group-hover:text-soft-clay transition-colors">{project.title}</h3>
                          <p className="text-xs text-charcoal/60 font-light mt-1">{project.location} • {project.year}</p>
                        </div>
                        <span className="text-[10px] uppercase font-semibold tracking-wider text-soft-clay px-3 py-1 border border-primary-beige rounded-full bg-primary-beige/20">
                          {project.category}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-primary-beige/20 border border-dashed border-primary-beige rounded-2xl text-charcoal/40 font-light text-sm">
                No projects found. Add your portfolio projects in the dashboard.
              </div>
            )}
          </div>
        </section>

        {/* SERVICES SECTION */}
        <section id="services" className="py-24 lg:py-36 bg-primary-white px-6 sm:px-8 lg:px-12 border-b border-primary-beige">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
            
            <div className="lg:col-span-4 space-y-6">
              <span className="text-xs uppercase tracking-widest font-semibold text-soft-clay block gsap-reveal-text">What We Do</span>
              <h2 className="font-serif text-3xl sm:text-4xl tracking-wide leading-tight gsap-reveal-text">Bespoke Design Services</h2>
              <p className="text-sm font-light text-charcoal/70 leading-relaxed max-w-sm gsap-reveal-text">
                {settings.servicesDesc || 'From luxury residential designs to curated art programs, we guide you through space planning, selection, and placement.'}
              </p>
            </div>

            {/* GSAP Stagger effect for services grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-8 gsap-stagger-container">
              {services.map((service) => (
                <div key={service.id} className="p-8 rounded-2xl bg-primary-beige/30 border border-primary-beige/50 hover:border-soft-clay/35 transition-colors space-y-6 gsap-stagger-item">
                  <div className="p-3 bg-primary-white w-fit rounded-xl border border-primary-beige">
                    {getIcon(service.icon)}
                  </div>
                  <h3 className="font-serif text-xl tracking-wide">{service.title}</h3>
                  <p className="text-sm font-light text-charcoal/70 leading-relaxed">{service.description}</p>
                  {service.priceRange && (
                    <span className="block text-[10px] uppercase font-semibold text-soft-clay tracking-widest">
                      Tier: {service.priceRange}
                    </span>
                  )}
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ABOUT / PHILOSOPHY SECTION */}
        <section id="about" className="py-24 lg:py-36 bg-primary-beige/20 px-6 sm:px-8 lg:px-12 border-b border-primary-beige">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <span className="text-xs uppercase tracking-widest font-semibold text-soft-clay block gsap-reveal-text">Philosophy</span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl tracking-wide text-charcoal leading-snug gsap-reveal-text">
              {settings.aboutTitle}
            </h2>
            <p className="text-base sm:text-lg lg:text-xl font-light text-charcoal/70 leading-relaxed max-w-3xl mx-auto italic gsap-reveal-text">
              "{settings.aboutText}"
            </p>
          </div>
        </section>

        {/* TESTIMONIALS */}
        {testimonials.length > 0 && (
          <section className="py-24 lg:py-36 bg-primary-white px-6 sm:px-8 lg:px-12 border-b border-primary-beige">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="text-center space-y-3">
                <span className="text-xs uppercase tracking-widest font-semibold text-soft-clay block gsap-reveal-text">Kind Words</span>
                <h2 className="font-serif text-3xl sm:text-4xl tracking-wide gsap-reveal-text">Client Testimonials</h2>
              </div>

              {/* GSAP Stagger effect for testimonial grids */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gsap-stagger-container">
                {testimonials.map((t) => (
                  <div key={t.id} className="p-8 rounded-2xl bg-primary-white border border-primary-beige flex flex-col justify-between h-full space-y-6 gsap-stagger-item">
                    <p className="text-sm font-light text-charcoal/80 leading-relaxed italic">
                      "{t.quote}"
                    </p>
                    <div>
                      <h4 className="text-sm font-semibold tracking-wide">{t.clientName}</h4>
                      {t.company && <p className="text-xs text-charcoal/50 font-light mt-0.5">{t.company}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CONTACT / INQUIRY SECTION */}
        <section id="contact" className="py-24 lg:py-36 bg-primary-white px-6 sm:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            
            {/* Office Info */}
            <div className="lg:col-span-5 space-y-10">
              <div className="space-y-4">
                <span className="text-xs uppercase tracking-widest font-semibold text-soft-clay block gsap-reveal-text">Connect</span>
                <h2 className="font-serif text-4xl tracking-wide gsap-reveal-text">Let's Create Your Space</h2>
                <p className="text-sm font-light text-charcoal/70 leading-relaxed max-w-sm gsap-reveal-text">
                  {settings.contactDesc || 'We design residential and commercial environments worldwide. Fill out our project form to tell us about your layout goals.'}
                </p>
              </div>

              <div className="space-y-6 gsap-stagger-container">
                <div className="flex items-start gap-4 gsap-stagger-item">
                  <div className="p-3 bg-primary-beige/40 rounded-xl border border-primary-beige">
                    <Mail className="w-5 h-5 text-soft-clay" />
                  </div>
                  <div>
                    <span className="block text-xs uppercase tracking-widest font-semibold text-charcoal/50">Email</span>
                    <a href={`mailto:${settings.contactEmail}`} className="text-sm font-light hover:text-soft-clay transition-colors">{settings.contactEmail}</a>
                  </div>
                </div>

                {settings.contactPhone && (
                  <div className="flex items-start gap-4 gsap-stagger-item">
                    <div className="p-3 bg-primary-beige/40 rounded-xl border border-primary-beige">
                      <Phone className="w-5 h-5 text-soft-clay" />
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-widest font-semibold text-charcoal/50">Phone</span>
                      <a href={`tel:${settings.contactPhone}`} className="text-sm font-light hover:text-soft-clay transition-colors">{settings.contactPhone}</a>
                    </div>
                  </div>
                )}

                {settings.contactAddress && (
                  <div className="flex items-start gap-4 gsap-stagger-item">
                    <div className="p-3 bg-primary-beige/40 rounded-xl border border-primary-beige">
                      <MapPin className="w-5 h-5 text-soft-clay" />
                    </div>
                    <div>
                      <span className="block text-xs uppercase tracking-widest font-semibold text-charcoal/50">Studio Location</span>
                      <p className="text-sm font-light leading-relaxed text-charcoal/80">{settings.contactAddress}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Project Inquiry Form */}
            <div className="lg:col-span-7 flex justify-end gsap-reveal-image">
              <ContactForm />
            </div>

          </div>
        </section>

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
