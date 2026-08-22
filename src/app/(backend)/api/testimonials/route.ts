import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/db';
import { getSession } from '@/backend/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isFeatured = searchParams.get('isFeatured') === 'true';

    const where: any = {};
    if (searchParams.has('isFeatured')) {
      where.isFeatured = isFeatured;
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(testimonials);
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await req.json();
    const { clientName, company, quote, avatarUrl, isFeatured } = data;

    if (!clientName || !quote) {
      return NextResponse.json({ error: 'Client name and quote are required' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        clientName,
        company,
        quote,
        avatarUrl,
        isFeatured: Boolean(isFeatured),
      },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
