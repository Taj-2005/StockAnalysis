import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import {User} from '@/models/User'
import { dbConnect } from '@/lib/mongodb'

export async function POST(req: Request) {
  try {
    await dbConnect()

    const { email, password, role } = await req.json()

    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ message: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await User.create({ email, password: hashedPassword, role })

    return NextResponse.json({ message: 'Signup successful' }, { status: 201 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Error signing up' }, { status: 500 })
  }
}
