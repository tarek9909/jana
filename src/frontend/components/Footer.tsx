import Link from 'next/link';

interface FooterProps {
  siteName: string;
  contactEmail: string;
  contactPhone?: string | null;
  contactAddress?: string | null;
  copyrightText?: string | null;
  footerManifesto?: string | null;
  instagramUrl?: string | null;
  pinterestUrl?: string | null;
  linkedinUrl?: string | null;
}

export default function Footer({
  siteName,
  contactEmail,
  contactPhone,
  contactAddress,
  copyrightText,
  footerManifesto,
  instagramUrl,
  pinterestUrl,
  linkedinUrl,
}: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-charcoal text-primary-beige mt-auto border-t border-charcoal/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
          
          {/* Logo & Manifesto */}
          <div className="flex flex-col space-y-6">
            <h2 className="font-serif text-3xl tracking-widest uppercase">{siteName}</h2>
            <p className="text-sm font-light text-primary-beige/60 max-w-xs leading-relaxed">
              {footerManifesto || 'Curating architectural balance, rich natural textures, and bespoke modern environments.'}
            </p>
          </div>

          {/* Contact Details */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-beige/40">Inquiries</h3>
            <div className="flex flex-col space-y-3 font-light text-sm">
              <a href={`mailto:${contactEmail}`} className="hover:text-primary-white transition-colors">
                {contactEmail}
              </a>
              {contactPhone && (
                <a href={`tel:${contactPhone}`} className="hover:text-primary-white transition-colors">
                  {contactPhone}
                </a>
              )}
              {contactAddress && <p className="text-primary-beige/60 leading-relaxed">{contactAddress}</p>}
            </div>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col space-y-6">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-primary-beige/40">Studio</h3>
            <div className="flex flex-col space-y-3 font-light text-sm">
              <Link href="/#portfolio" className="hover:text-primary-white transition-colors">
                Portfolio
              </Link>
              <Link href="/#about" className="hover:text-primary-white transition-colors">
                Our Philosophy
              </Link>
              <Link href="/#services" className="hover:text-primary-white transition-colors">
                Design Services
              </Link>
              <Link href="/#contact" className="hover:text-primary-white transition-colors">
                Get In Touch
              </Link>
            </div>
          </div>

        </div>

        <div className="border-t border-primary-beige/10 mt-16 pt-8 flex flex-col md:flex-row justify-between items-center text-xs font-light text-primary-beige/40 space-y-4 md:space-y-0">
          <p>{copyrightText || `© ${currentYear} ${siteName}. All Rights Reserved.`}</p>
          <div className="flex space-x-6">
            <a href={instagramUrl || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-primary-white transition-colors">Instagram</a>
            <a href={pinterestUrl || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-primary-white transition-colors">Pinterest</a>
            <a href={linkedinUrl || '#'} target="_blank" rel="noopener noreferrer" className="hover:text-primary-white transition-colors">LinkedIn</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
