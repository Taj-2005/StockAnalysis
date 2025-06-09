import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import { dbConnect } from '@/lib/mongodb';
import { Watchlist } from '@/models/Watchlist';
import { NextResponse } from 'next/server';

export async function GET() {
  await dbConnect();

  const token = (await cookies()).get('token')?.value;
  const decoded = verifyJWT(token || '');
  if (!decoded) {
    return NextResponse.json({ symbols: [] });
  }

  const watchlist = await Watchlist.findOne({ user: typeof decoded === 'object' && 'userId' in decoded ? decoded.userId : undefined });
  return NextResponse.json({ symbols: watchlist?.symbols || [] });
}
