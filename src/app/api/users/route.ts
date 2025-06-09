import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import { User } from '@/models/User';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const role = url.searchParams.get('role');

  await dbConnect();

  const users = await User.find(role ? { role } : {});
  return NextResponse.json({ users });
}