import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import User from "@/models/User";

// GET request: Fetch users
export async function GET() {
  try {
    await connectToDatabase(); // Ensure MongoDB connection
    const users = await User.find({});
    return NextResponse.json({ success: true, data: users }, { status: 200 });
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}

// POST request: Add a new user
export async function POST(req: Request) {
  try {
    const body = await req.json(); // Parse request body
    await connectToDatabase(); // Ensure MongoDB connection

    const newUser = new User(body);
    const savedUser = await newUser.save();

    return NextResponse.json({ success: true, data: savedUser }, { status: 201 });
  } catch (error: unknown) {
    let message = "An unknown error occurred";
    if (error instanceof Error) {
      message = error.message;
    }
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
