import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { verifyJWT } from '@/lib/auth';
import { AnalysisRequest } from '@/models/AnalysisRequest';

export async function GET(req: Request) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  const decoded = verifyJWT(token || '');

  if (!decoded || typeof decoded !== 'object' || decoded.role !== 'analyst') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const analystId = decoded.userId;

  const requests = await AnalysisRequest.find({ analystId, status: 'pending' })
    .populate('investorId', 'email')
    .sort({ createdAt: -1 });

  return NextResponse.json({ requests });
}
