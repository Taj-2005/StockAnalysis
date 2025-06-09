import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import { Watchlist } from '@/models/Watchlist';

export async function POST(req: Request) {
    const WatchlistModel: any = Watchlist;
  await dbConnect();

  const token = (await cookies()).get('token')?.value;
  const decoded = verifyJWT(token || '');
  if (!decoded || typeof decoded !== 'object' || decoded.role !== 'investor') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { symbol } = await req.json();
  await WatchlistModel.updateOne(
    { user: decoded.userId },
    { $addToSet: { symbols: symbol } },
    { upsert: true }
  );

  return NextResponse.json({ message: 'Stock added to watchlist' });
}
