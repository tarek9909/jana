import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/db';
import { getSession } from '@/backend/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const testimonialId = Number(id);

    if (isNaN(testimonialId)) {
      return NextResponse.json({ error: 'Invalid testimonial ID' }, { status: 400 });
    }

    const data = await req.json();
    const { clientName, company, quote, avatarUrl, isFeatured } = data;

    if (!clientName || !quote) {
      return NextResponse.json({ error: 'Client name and quote are required' }, { status: 400 });
    }

    const testimonial = await prisma.testimonial.update({
      where: { id: testimonialId },
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
    console.error('Error updating testimonial:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const testimonialId = Number(id);

    if (isNaN(testimonialId)) {
      return NextResponse.json({ error: 'Invalid testimonial ID' }, { status: 400 });
    }

    await prisma.testimonial.delete({
      where: { id: testimonialId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
