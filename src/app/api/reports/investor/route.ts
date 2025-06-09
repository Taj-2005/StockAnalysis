import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { Report } from '@/models/Report';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';

export async function GET() {
  await dbConnect();

  const token = (await cookies()).get('token')?.value;
  const decoded = verifyJWT(token || '');

  if (!decoded || typeof decoded !== 'object' || decoded.role !== 'investor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const reports = await Report.find({ investor: decoded.userId }).sort({ createdAt: -1 });

  return NextResponse.json({ reports });
}
