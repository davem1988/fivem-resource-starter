import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createDefaultProjectStructure } from '@/utils/projectTemplates';

export async function GET() {
  const { userId } = auth();

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: 'Projects not found' }, { status: 404 });
    }

    if (user.projects.rootFolder === null) {  
      user.projects.rootFolder = createDefaultProjectStructure(user.projects.title, user.projects.description, user.username)
      await user.projects.save();
    }

    return NextResponse.json({ projects: user.projects });
  } catch (error) {
    console.error('Error in projects GET route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, description } = await request.json();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = {
      title,
      description,
      rootFolder: createDefaultProjectStructure(title, description, user.username)
    };

    await connectDB();

    const result = await User.findOneAndUpdate(
      { clerkId: userId },
      { $push: { projects: project } },
      { new: true, upsert: true }
    );

    if (!result) {
      return NextResponse.json({ error: 'Failed to create project' }, { status: 500 });
    }

    console.log(result);
    const newProject = result.projects[result.projects.length - 1];
    
    return NextResponse.json({
      message: 'Project created successfully',
      project: {
        id: newProject._id,
        title: newProject.title,
        description: newProject.description,
        rootFolder: newProject.rootFolder,
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
