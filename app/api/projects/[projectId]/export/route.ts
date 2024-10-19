import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import JSZip from 'jszip';

function createZipFromFolder(folder: any): JSZip {
  const zip = new JSZip();

  function addFolderToZip(folderObj: any, zipFolder: JSZip) {
    folderObj.files.forEach((file: any) => {
      zipFolder.file(file.name, file.content);
    });

    folderObj.folders.forEach((subFolder: any) => {
      const newZipFolder = zipFolder.folder(subFolder.name);
      if (newZipFolder) {
        addFolderToZip(subFolder, newZipFolder);
      }
    });
  }

  addFolderToZip(folder, zip);
  return zip;
}

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

    const zip = createZipFromFolder(project.rootFolder);
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });

    const response = new NextResponse(zipBuffer);
    response.headers.set('Content-Type', 'application/zip');
    response.headers.set('Content-Disposition', `attachment; filename="${project.title}.zip"`);

    return response;
  } catch (error) {
    console.error('Error in project export route:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
