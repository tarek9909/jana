import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/db';
import { getSession } from '@/backend/auth';

// Public GET: Retrieve site settings
export async function GET() {
  try {
    let settings = await prisma.siteSettings.findFirst({
      where: { id: 1 },
    });

    if (!settings) {
      // Create defaults if not present
      settings = await prisma.siteSettings.create({
        data: {
          id: 1,
          siteName: 'Studio Eliza Vance',
          heroTitle: 'Curating Luxury Spaces',
          heroSubtitle: 'Bespoke interior architecture and design for sophisticated homes.',
          aboutTitle: 'Our Philosophy',
          aboutText: 'We believe that interior design is not just about making spaces beautiful, but about curating environments that inspire and enrich daily life. Our work is defined by clean lines, rich natural textures, and a harmonious balance between light and form. Every project is a collaborative journey to translate our client\'s unique essence into a tangible, sophisticated environment.',
          contactEmail: 'studio@elizavance.com',
          contactPhone: '+1 (555) 123-4567',
          contactAddress: '124 Elegant Way, Suite A, New York, NY 10001',
          primaryBeige: '#F4EFEA',
          primaryWhite: '#FAFAF9',
          primaryCharcoal: '#1C1B1A',
          primaryAccent: '#8B7E74',
          copyrightText: '© 2026 Studio Eliza Vance. All Rights Reserved.',
          heroTag: 'Interior Architecture & Design',
          footerManifesto: 'Curating architectural balance, rich natural textures, and bespoke modern environments.',
          portfolioDesc: 'A gallery of luxury residential and commercial environments curated with spatial elegance.',
          servicesDesc: 'From luxury residential designs to curated art programs, we guide you through space planning, selection, and placement.',
          contactDesc: 'We design residential and commercial environments worldwide. Fill out our project form to tell us about your layout goals.',
          instagramUrl: '#',
          pinterestUrl: '#',
          linkedinUrl: '#',
        },
      });
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Protected PUT: Update site settings
export async function PUT(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();

    const updatedSettings = await prisma.siteSettings.upsert({
      where: { id: 1 },
      update: {
        siteName: data.siteName,
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        aboutTitle: data.aboutTitle,
        aboutText: data.aboutText,
        contactEmail: data.contactEmail,
        contactPhone: data.contactPhone,
        contactAddress: data.contactAddress,
        primaryBeige: data.primaryBeige,
        primaryWhite: data.primaryWhite,
        primaryCharcoal: data.primaryCharcoal,
        primaryAccent: data.primaryAccent,
        copyrightText: data.copyrightText,
        heroTag: data.heroTag,
        footerManifesto: data.footerManifesto,
        portfolioDesc: data.portfolioDesc,
        servicesDesc: data.servicesDesc,
        contactDesc: data.contactDesc,
        instagramUrl: data.instagramUrl,
        pinterestUrl: data.pinterestUrl,
        linkedinUrl: data.linkedinUrl,
      },
      create: {
        id: 1,
        siteName: data.siteName || 'Studio Eliza Vance',
        heroTitle: data.heroTitle || 'Curating Luxury Spaces',
        heroSubtitle: data.heroSubtitle || 'Bespoke interior architecture and design for sophisticated homes.',
        aboutTitle: data.aboutTitle || 'Our Philosophy',
        aboutText: data.aboutText || '',
        contactEmail: data.contactEmail || 'studio@elizavance.com',
        contactPhone: data.contactPhone,
        contactAddress: data.contactAddress,
        primaryBeige: data.primaryBeige || '#F4EFEA',
        primaryWhite: data.primaryWhite || '#FAFAF9',
        primaryCharcoal: data.primaryCharcoal || '#1C1B1A',
        primaryAccent: data.primaryAccent || '#8B7E74',
        copyrightText: data.copyrightText || '© 2026 Studio Eliza Vance. All Rights Reserved.',
        heroTag: data.heroTag || 'Interior Architecture & Design',
        footerManifesto: data.footerManifesto || 'Curating architectural balance, rich natural textures, and bespoke modern environments.',
        portfolioDesc: data.portfolioDesc || 'A gallery of luxury residential and commercial environments curated with spatial elegance.',
        servicesDesc: data.servicesDesc || 'From luxury residential designs to curated art programs, we guide you through space planning, selection, and placement.',
        contactDesc: data.contactDesc || 'We design residential and commercial environments worldwide. Fill out our project form to tell us about your layout goals.',
        instagramUrl: data.instagramUrl || '#',
        pinterestUrl: data.pinterestUrl || '#',
        linkedinUrl: data.linkedinUrl || '#',
      },
    });

    return NextResponse.json(updatedSettings);
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
