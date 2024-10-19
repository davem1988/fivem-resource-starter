import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    let user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ user: null });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error in user GET route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const { email, username } = await req.json();

    // Check if user already exists
    let user = await User.findOne({ clerkId: userId });

    if (user) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create new user
    user = new User({
      clerkId: userId,
      email,
      username,
      projects: []
    });

    await user.save();

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error('Error in user POST route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
