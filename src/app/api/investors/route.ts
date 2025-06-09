import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';

export async function GET() {
  await dbConnect();

  const token = (await cookies()).get('token')?.value;
  const decoded = verifyJWT(token || '');

  if (!decoded || typeof decoded !== 'object' || decoded.role !== 'analyst') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const analyst = await User.findById(decoded.userId).populate('assignedInvestors');

  return NextResponse.json({ investors: analyst.assignedInvestors });
}
