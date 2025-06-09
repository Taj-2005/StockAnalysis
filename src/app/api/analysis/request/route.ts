// src/app/api/analysis/request/route.ts

import { NextResponse } from 'next/server';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';
import { AnalysisRequest } from '@/models/AnalysisRequest';

export async function POST(req: Request) {
  await dbConnect();

  const token = (await cookies()).get('token')?.value || '';
  const decoded = verifyJWT(token);

  if (!decoded || typeof decoded !== 'object' || decoded.role !== 'investor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const investorId = decoded.userId;
  const investor = await User.findById(investorId);

  if (!investor || !investor.assignedAnalyst) {
    return NextResponse.json({ error: 'No assigned analyst found.' }, { status: 400 });
  }

  const body = await req.json();
  const { stockSymbol } = body;

  if (!stockSymbol) {
    return NextResponse.json({ error: 'Stock symbol is required' }, { status: 400 });
  }

  const newRequest = await AnalysisRequest.create({
    stockSymbol,
    status: 'pending',
    investorId,
    analystId: investor.assignedAnalyst,
  });

  return NextResponse.json({ success: true, request: newRequest });
}
