import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { auth } from '@clerk/nextjs/server';

export async function POST(
  request: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { projectId } = params;
    const { title, description, rootFolder } = await request.json();

    await connectDB();

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userId, 'projects._id': projectId },
      {
        $set: {
          'projects.$.title': title,
          'projects.$.description': description,
          'projects.$.rootFolder': rootFolder,
          'projects.$.updatedAt': new Date(),
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    const updatedProject = updatedUser.projects.find(
      (project: any) => project._id.toString() === projectId
    );

    return NextResponse.json(updatedProject);
  } catch (error) {
    console.error('Error saving project:', error);
    return NextResponse.json({ error: 'Failed to save project' }, { status: 500 });
  }
}
