import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/backend/db';
import { getSession } from '@/backend/auth';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const isNum = !isNaN(Number(id));

    const project = await prisma.project.findFirst({
      where: isNum ? { id: Number(id) } : { slug: id },
      include: {
        images: true,
      },
    });

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Error fetching project details:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  try {
    const session = getSession(req);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const projectId = Number(id);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    const data = await req.json();
    const { title, slug, description, location, year, isFeatured, category, coverImage, galleryImages } = data;

    if (!title || !slug || !description || !coverImage || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Update main project details
    await prisma.project.update({
      where: { id: projectId },
      data: {
        title,
        slug,
        description,
        location,
        year,
        isFeatured: Boolean(isFeatured),
        category,
        coverImage,
      },
    });

    // Sync gallery images by replacing existing ones
    if (galleryImages) {
      await prisma.projectImage.deleteMany({
        where: { projectId },
      });

      await prisma.projectImage.createMany({
        data: galleryImages.map((url: string) => ({
          url,
          projectId,
        })),
      });
    }

    const updatedProject = await prisma.project.findUnique({
      where: { id: projectId },
      include: { images: true },
    });

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error updating project:', error);
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
    const projectId = Number(id);

    if (isNaN(projectId)) {
      return NextResponse.json({ error: 'Invalid project ID' }, { status: 400 });
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting project:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
