import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const resolvedParams = await params;
  const filePathArray = resolvedParams.path;
  
  if (!filePathArray || filePathArray.length === 0) {
    return new NextResponse('Path is required', { status: 400 });
  }

  const normalizedPath = path.normalize(filePathArray.join('/')).replace(/^(\.\.(\/|\\|$))+/, '');
  const trainingDir = path.resolve(process.cwd(), '..');
  const fullPath = path.join(trainingDir, normalizedPath);

  if (!fullPath.startsWith(trainingDir)) {
    return new NextResponse('Invalid path', { status: 403 });
  }

  try {
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) {
      return new NextResponse('Not a file', { status: 400 });
    }

    const fileStream = fs.createReadStream(fullPath);
    // Explicit any needed as response stream type differs slightly in Next.js
    const readableStream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      }
    });

    // Determine the content type based on the file extension
    let contentType = 'application/octet-stream';
    const ext = path.extname(fullPath).toLowerCase();
    
    if (ext === '.html') contentType = 'text/html; charset=utf-8';
    else if (ext === '.css') contentType = 'text/css; charset=utf-8';
    else if (ext === '.js') contentType = 'application/javascript; charset=utf-8';
    else if (ext === '.json') contentType = 'application/json; charset=utf-8';
    else if (ext === '.png') contentType = 'image/png';
    else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
    else if (ext === '.mp4') contentType = 'video/mp4';

    return new NextResponse(readableStream as any, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  } catch (error) {
    console.error('Error serving raw file:', error);
    return new NextResponse('File not found', { status: 404 });
  }
}
