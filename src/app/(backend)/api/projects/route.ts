import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/db';
import { getSession } from '@/backend/auth';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const isFeatured = searchParams.get('isFeatured') === 'true';
    const category = searchParams.get('category');

    const where: any = {};
    if (searchParams.has('isFeatured')) {
      where.isFeatured = isFeatured;
    }
    if (category) {
      where.category = category;
    }

    const projects = await prisma.project.findMany({
      where,
      include: {
        images: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
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
    const { title, slug, description, location, year, isFeatured, category, coverImage, galleryImages } = data;

    if (!title || !slug || !description || !coverImage || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const project = await prisma.project.create({
      data: {
        title,
        slug,
        description,
        location,
        year,
        isFeatured: Boolean(isFeatured),
        category,
        coverImage,
        images: {
          create: galleryImages ? galleryImages.map((url: string) => ({ url })) : [],
        },
      },
      include: {
        images: true,
      },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error creating project:', error);
    // Check for unique slug constraint violation
    if (error && (error as any).code === 'P2002') {
      return NextResponse.json({ error: 'A project with this slug already exists' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
