import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { verifyJWT } from '@/lib/auth';
import { AnalysisRequest } from '@/models/AnalysisRequest';

export async function GET(req: NextRequest) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  const decoded = verifyJWT(token || '');
  if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const analystId = typeof decoded === 'object' && 'userId' in decoded ? decoded.userId : null;
  if (!analystId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const requests = await AnalysisRequest.find({
    analystId,
    status: 'pending',
    }).populate({
    path: 'investorId',
    select: 'email',
    model: 'StocksUser',
    });

  return NextResponse.json({ requests });
}
