import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { User, IUserDocument } from '@/models/User';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';

export async function GET() {
  await dbConnect();

  const token = (await cookies()).get('token')?.value;
  const decoded = verifyJWT(token || '');

  if (!decoded || typeof decoded !== 'object' || decoded.role !== 'investor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const investorId = decoded.userId;

  // Fetch investor with assignedAnalyst as ObjectId
  const investor = await User.findById(investorId).lean();

  if (!investor) {
    return NextResponse.json({ error: 'Investor not found' }, { status: 404 });
  }

  let analyst: IUserDocument | null = null;

  if (investor.assignedAnalyst) {
    // Try to fetch analyst as full user document
    analyst = await User.findById(investor.assignedAnalyst).lean();
  }

  return NextResponse.json({ analyst });
}
