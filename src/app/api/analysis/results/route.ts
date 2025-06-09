import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { verifyJWT } from '@/lib/auth';
import { AnalysisRequest } from '@/models/AnalysisRequest';

export async function GET(req: Request) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  const decoded = verifyJWT(token || '');

  if (!decoded || typeof decoded !== 'object' || decoded.role !== 'investor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const investorId = decoded.userId;

  const results = await AnalysisRequest.find({ investorId, status: 'completed' })
    .populate({
    path: 'analystId',
    select: 'email',
    model: 'StocksUser',})
    .sort({ createdAt: -1 });

  return NextResponse.json({ results });
}
