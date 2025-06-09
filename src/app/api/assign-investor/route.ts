import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';

export async function POST(req: Request) {
  const UserModal: any = User;
  await dbConnect();

  const token = (await cookies()).get('token')?.value;
  const decoded = verifyJWT(token || '');

  if (!decoded || typeof decoded !== 'object' || decoded.role !== 'analyst') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const analystId = decoded.userId;

  const body = await req.json();
  const investorIds = body.investorIds;

  if (!Array.isArray(investorIds) || investorIds.length === 0) {
    return NextResponse.json({ error: 'investorIds must be a non-empty array' }, { status: 400 });
  }

  // Assign to analyst
  await UserModal.findByIdAndUpdate(analystId, {
    $addToSet: { assignedInvestors: { $each: investorIds } },
  });

  // Assign analyst to each investor
  await UserModal.updateMany(
    { _id: { $in: investorIds } },
    { $set: { assignedAnalyst: analystId } }
  );

  return NextResponse.json({ message: 'Assignment successful' });
}
