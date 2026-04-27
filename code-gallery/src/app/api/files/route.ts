import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  children?: FileNode[];
}

const IGNORED_DIRS = ['code-gallery', '.git', 'node_modules', '.vercel', '.next'];

function getFiles(dir: string, baseDir: string): FileNode[] {
  const nodes: FileNode[] = [];
  try {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      if (IGNORED_DIRS.includes(file)) continue;

      const fullPath = path.join(dir, file);
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        nodes.push({
          name: file,
          type: 'folder',
          path: relativePath,
          children: getFiles(fullPath, baseDir)
        });
      } else {
        nodes.push({
          name: file,
          type: 'file',
          path: relativePath
        });
      }
    }
  } catch (error) {
    console.error('Error reading directory:', error);
  }
  return nodes.sort((a, b) => {
    if (a.type === b.type) {
      return a.name.localeCompare(b.name);
    }
    return a.type === 'folder' ? -1 : 1;
  });
}

export async function GET() {
  const trainingDir = path.resolve(process.cwd(), '..');
  const fileTree = getFiles(trainingDir, trainingDir);
  return NextResponse.json(fileTree);
}
