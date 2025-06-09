import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { verifyJWT } from '@/lib/auth';
import { AnalysisRequest } from '@/models/AnalysisRequest';
import { User } from '@/models/User';

export async function POST(req: Request) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  const decoded = verifyJWT(token || '');

  if (!decoded || typeof decoded !== 'object' || decoded.role !== 'investor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const investorId = decoded.userId;
  const { symbol } = await req.json();

  if (!symbol) {
    return NextResponse.json({ error: 'Stock symbol required' }, { status: 400 });
  }

  // Fetch assigned analyst ID from user document (you can also pass analystId from frontend if you want)
  const user = await User.findById(investorId);

  if (!user?.assignedAnalyst) {
    return NextResponse.json({ error: 'No assigned analyst found' }, { status: 400 });
  }

  const newRequest = new AnalysisRequest({
    analystId: user.assignedAnalyst,
    investorId,
    stockSymbol: symbol,
    status: 'pending',
  });

  await newRequest.save();

  return NextResponse.json({ message: 'Analysis request sent' });
}
