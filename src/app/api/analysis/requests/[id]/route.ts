import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { verifyJWT } from '@/lib/auth';
import { AnalysisRequest } from '@/models/AnalysisRequest';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  const token = req.headers.get('authorization')?.split(' ')[1];
  const decoded = verifyJWT(token || '');

  if (!decoded || typeof decoded !== 'object' || decoded.role !== 'analyst') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const analystId = decoded.userId;
  const { id } = params;

  const { result } = await req.json();

  if (!result) {
    return NextResponse.json({ error: 'Analysis result required' }, { status: 400 });
  }

  const request = await AnalysisRequest.findById(id);

  if (!request) {
    return NextResponse.json({ error: 'Request not found' }, { status: 404 });
  }

  if (request.analystId.toString() !== analystId) {
    return NextResponse.json({ error: 'Not authorized to update this request' }, { status: 403 });
  }

  request.result = result;
  request.status = 'completed';

  await request.save();

  return NextResponse.json({ message: 'Analysis submitted' });
}
