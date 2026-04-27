import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePathParam = searchParams.get('path');

  if (!filePathParam) {
    return NextResponse.json({ error: 'Path is required' }, { status: 400 });
  }

  const trainingDir = path.resolve(process.cwd(), '..');
  // Prevent directory traversal attacks
  const normalizedPath = path.normalize(filePathParam).replace(/^(\.\.(\/|\\|$))+/, '');
  const fullPath = path.join(trainingDir, normalizedPath);

  if (!fullPath.startsWith(trainingDir)) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 403 });
  }

  try {
    const stat = fs.statSync(fullPath);
    if (!stat.isFile()) {
      return NextResponse.json({ error: 'Not a file' }, { status: 400 });
    }

    // Don't read overly large files or binary files (except checking extension)
    if (stat.size > 5 * 1024 * 1024) { // 5MB limit
      return NextResponse.json({ error: 'File too large' }, { status: 413 });
    }

    const content = fs.readFileSync(fullPath, 'utf8');
    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json({ error: 'File not found or unreadable' }, { status: 404 });
  }
}
