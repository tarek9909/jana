import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface RouteParams {
  params: Promise<{ filename: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { filename } = await params;
    
    // Prevent directory traversal attacks by taking only the file base name
    const sanitizedFilename = path.basename(filename);
    const filePath = path.join(process.cwd(), 'public', 'uploads', sanitizedFilename);

    try {
      const fileBuffer = await fs.readFile(filePath);
      
      // Map extensions to content types
      const ext = path.extname(sanitizedFilename).toLowerCase();
      let contentType = 'application/octet-stream';
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else if (ext === '.webp') contentType = 'image/webp';

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      });
    } catch (e) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error serving uploaded file:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
