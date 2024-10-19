import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { createDefaultProjectStructure } from '@/utils/projectTemplates';

export async function GET(request: Request, { params }: { params: { projectId: string } }) {
  const { userId } = auth();
  const { projectId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = user.projects.id(projectId);

    if (!project) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    console.error('Error in project GET route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { projectId: string, title: string, description: string } }) {
  const { userId } = auth();
  const { projectId } = params;
  const { title, description } = await request.json();
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }  

  try {
    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const project = user.projects.id(projectId);

    if (project) {
      return NextResponse.json({ project: project }, { status: 200 });
    }   

    const newProject = {
      title,
      description,
      rootFolder: createDefaultProjectStructure(title, description, user.username)
    };

    user.projects.push(newProject);
    await user.save();

    return NextResponse.json({ project: newProject });
  } catch (error) {
    console.error('Error in project POST route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}   

export async function DELETE(request: Request, { params }: { params: { projectId: string } }) {
  const { userId } = auth();
  const { projectId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const projectIndex = user.projects.findIndex((project: any) => project._id.toString() === projectId);

    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    user.projects.splice(projectIndex, 1);
    await user.save();

    return NextResponse.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error in project DELETE route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { projectId: string } }) {
  const { userId } = auth();
  const { projectId } = params;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();

    const user = await User.findOne({ clerkId: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const projectIndex = user.projects.findIndex((p: any) => p._id.toString() === projectId);

    if (projectIndex === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }

    const updatedProject = await request.json();

    user.projects[projectIndex] = updatedProject;
    await user.save();

    return NextResponse.json({ message: 'Project updated successfully', project: updatedProject });
  } catch (error) {
    console.error('Error in project PUT route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
