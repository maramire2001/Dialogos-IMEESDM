import { readdirSync } from 'fs';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  const dir = join(process.cwd(), 'public', 'cvs');
  const files = readdirSync(dir).filter(f => f.endsWith('.pdf'));
  const cvs = files.map(name => ({
    name: name.replace('.pdf', ''),
    url: `/cvs/${encodeURIComponent(name)}`,
  }));
  return NextResponse.json(cvs);
}
