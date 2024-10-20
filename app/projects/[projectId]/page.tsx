'use client';

import { useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';
import dynamic from 'next/dynamic';
import styles from './ProjectPage.module.css';
import { Plus, FolderPlus, FilePlus, Trash2, Delete, FolderMinus, Trash } from 'lucide-react';
import Tooltip from '@/components/Tooltip';
import { registerFivemLuaLanguage } from '@/utils/fivemLuaLanguageService';
import { Editor, useMonaco } from '@monaco-editor/react';
import * as monaco from 'monaco-editor';

interface File {
  name: string;
  content: string;
}

interface Folder {
  name: string;
  files: File[];
  folders: Folder[];
  path: string[]; // Add this line
}

interface Project {
  _id: string;
  title: string;
  description: string;
  rootFolder: Folder;
  createdAt: string;
  updatedAt: string;
}

// Dynamically import Monaco Editor
const MonacoEditor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

const FileTree = ({ 
  folder, 
  onFileSelect, 
  onAddFile, 
  onAddFolder, 
  onDeleteFile, 
  onDeleteFolder,
  path = [] 
}: { 
  folder: Folder; 
  onFileSelect: (file: File, path: string[]) => void;
  onAddFile: (path: string[]) => void;
  onAddFolder: (path: string[]) => void;
  onDeleteFile: (path: string[] | undefined, fileName: string) => void;
  onDeleteFolder: (path: string[] | undefined, folderName: string) => void;
  path?: string[];
}) => {
  const [expandedFolders, setExpandedFolders] = useState<{ [key: string]: boolean }>({});

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [folderName]: !prev[folderName]
    }));
  };

  return (
    <ul className={styles.fileTree} style={{ paddingLeft: `${path.length * 16}px` }}>
      {folder.files.map((file, index) => (
        <li key={`file-${index}`} onClick={() => onFileSelect(file, [...path, folder.name])} className={styles.fileItem}>
          <span className={styles.fileIcon}>📄</span> {file.name}
          <button onClick={() => onDeleteFile(path, file.name)} className={styles.deleteIcon}>
            <Tooltip text="Delete file">
            <Trash size={14} className={styles.trashIcon} />
            </Tooltip>
          </button>
        </li>
      ))}
      {folder.folders.map((subfolder, index) => (
        <li key={`folder-${index}`} className={styles.folderItem}>
          <span 
            onClick={() => toggleFolder(subfolder.name)}
            className={styles.folderIcon}
          >
            {expandedFolders[subfolder.name] ? '📂' : '📁'}
          </span>
          <span onClick={() => toggleFolder(subfolder.name)}>{subfolder.name}
            <button onClick={() => onDeleteFolder(subfolder.path, subfolder.name)} className={styles.deleteIcon}>
            <Tooltip text="Delete folder">  
              <Trash size={14} className={styles.trashIcon} />
            </Tooltip>
            </button>
          </span>
          <button onClick={() => onAddFile([...path, subfolder.name])} className={styles.addButton}>
            <Tooltip text="Add file">
              <FilePlus size={14} />
            </Tooltip>
          </button>
          <button onClick={() => onAddFolder([...path, subfolder.name])} className={styles.addButton}>
            <Tooltip text="Add folder">
              <FolderPlus size={14} />
            </Tooltip>
          </button>

          {expandedFolders[subfolder.name] && (
            <FileTree 
              folder={subfolder} 
              onFileSelect={onFileSelect} 
              path={[...path, subfolder.name]} 
              onAddFile={onAddFile} 
              onAddFolder={onAddFolder} 
              onDeleteFile={onDeleteFile} 
              onDeleteFolder={onDeleteFolder} 
            />
          )}

        </li>
      ))}
    </ul>
  );
};

export default function ProjectPage() {
  const { isLoaded, userId } = useAuth();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedFilePath, setSelectedFilePath] = useState<string[]>([]);

  const searchParams = useSearchParams();
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();

  const projectId = params.projectId as string;
  const title = searchParams.get('title') || '';
  const description = searchParams.get('description') || '';
  const monaco = useMonaco();

  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);

  useEffect(() => {
    if (isLoaded && userId && projectId) {
      fetchProject();
    }
  }, [isLoaded, userId, projectId]);


  useEffect(() => {
    if (monaco) {
      registerFivemLuaLanguage(monaco);
    }
  }, [monaco]);

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }

      const data = await response.json();
      setProject(data.project);
      setIsLoading(false);
    } catch (err) {
      setError('Error fetching project');
      setIsLoading(false);
      console.error('Error fetching project:', err);
    }
  };

  const handleFileSelect = (file: File, path: string[]) => {
    setSelectedFile(file);
    setSelectedFilePath(path);
  };

  const handleAddFile = async (path: string[] = []) => {
    const fileName = prompt('Enter file name:');
    if (!fileName) return;

    const newFile = { name: fileName, content: `--${fileName}` };
    const updatedProject = {
      ...project!,
      rootFolder: addFileToFolder(project!.rootFolder, path, newFile)
    };
    await updateProject(updatedProject);
  };

  const handleAddFolder = async (path: string[]) => {
    const folderName = prompt('Enter folder name:');
    if (!folderName) return;

    const newFolder: Folder = { name: folderName, files: [], folders: [], path: [...path, folderName] };
    const updatedRootFolder = addFolderToFolder(project!.rootFolder, path, newFolder);
    const updatedProject = { ...project!, rootFolder: updatedRootFolder };
    await updateProject(updatedProject);
  };

  const addFileToFolder = (folder: Folder, path: string[] | undefined, newFile: File): Folder => {
    if (!path || path.length === 0) {
      return { 
        ...folder, 
        files: [...(folder.files || []), { ...newFile, content: newFile.content || '' }] 
      };
    }

    const [currentFolder, ...restPath] = path;
    return {
      ...folder,
      folders: (folder.folders || []).map(f => 
        f.name === currentFolder ? addFileToFolder(f, restPath, newFile) : f
      )
    };
  };

  const addFolderToFolder = (folder: Folder, path: string[], newFolder: Folder): Folder => {
    if (path.length === 0) {
      return { ...folder, folders: [...folder.folders, newFolder] };
    }

    const [currentFolder, ...restPath] = path;
    return {
      ...folder,
      folders: folder.folders.map(f => 
        f.name === currentFolder ? addFolderToFolder(f, restPath, newFolder) : f
      )
    };
  };

  const updateProject = async (updatedProject: Project) => {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
      });

      if (response.ok) {
        setProject(updatedProject);
        showToast('Project updated successfully', 'success');
      } else {
        showToast('Failed to update project', 'error');
      }
    } catch (err) {
      showToast('Error updating project', 'error');
      console.error('Error updating project:', err);
    }
  };

  const saveProject = async () => {
    if (!project) return;

    
    const response = await fetch(`/api/projects/${projectId}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({  
        title: project?.title ?? '',
        description: project?.description ?? '',
        rootFolder: project?.rootFolder ?? null,
      }),
    });
    
    if (response.ok) {
      const updatedProject = await response.json();
      console.log('updatedProject', updatedProject);
      setProject(updatedProject);
      showToast('Project saved successfully', 'success');
    } else {
      showToast('Error saving project', 'error');
    }
  };

  const deleteProject = async () => {
    if (!project) return;

    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        showToast('Project deleted successfully', 'success');
        router.push('/projects');
      } else {
        showToast('Failed to delete project', 'error');
      }
    } catch (err) {
      showToast('Error deleting project', 'error');
      console.error('Error deleting project:', err);
    }
  };

  const exportProject = async () => {
    if (!project) return;

    try {
      const response = await fetch(`/api/projects/${project._id}/export`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${project.title}.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        showToast('Project exported successfully', 'success');
      } else {
        showToast('Failed to export project', 'error');
      }
    } catch (err) {
      showToast('Error exporting project', 'error');
      console.error('Error exporting project:', err);
    }
  };

  const handleDeleteFile = async (path: string[] | undefined, fileName: string) => {
    if (!project) return;
    
    const updatedProject = {
      ...project,
      rootFolder: deleteFileFromFolder(project.rootFolder, path, fileName)
    };

    try {
      const response = await fetch(`/api/projects/${project._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProject),
      });

      if (response.ok) {
        setProject(updatedProject);
        showToast('File deleted successfully', 'success');
      } else {
        showToast('Failed to delete file', 'error');
      }
    } catch (error) {
      console.error('Error deleting file:', error);
      showToast('Error deleting file', 'error');
    }
  };

  const handleDeleteFolder = async (path: string[] | undefined, folderName: string) => {
    if (!project) return;
    
    const updatedProject = {
      ...project,
      rootFolder: deleteFolderFromFolder(project.rootFolder, path ? path.slice(0, -1) : undefined, folderName)
    };
    await updateProject(updatedProject);
    showToast('Folder deleted successfully', 'success');
  };

  const deleteFileFromFolder = (folder: Folder, path: string[] | undefined, fileName: string): Folder => {
    if (!path || path.length === 0) {
      return {
        ...folder,
        files: (folder.files || []).filter(file => file.name !== fileName)
      };
    }

    const [currentFolder, ...restPath] = path;
    return {
      ...folder,
      folders: (folder.folders || []).map(f => 
        f.name === currentFolder 
          ? deleteFileFromFolder(f, restPath, fileName) 
          : f
      )
    };
  };

  const deleteFolderFromFolder = (folder: Folder, path: string[] | undefined, folderName: string): Folder => {
    if (!path || path.length === 0) {
      return {
        ...folder,
        folders: (folder.folders || []).filter(f => f.name !== folderName)
      };
    }

    const [currentFolder, ...restPath] = path;
    return {
      ...folder,
      folders: (folder.folders || []).map(f =>
        f.name === currentFolder ? deleteFolderFromFolder(f, restPath, folderName) : f
      )
    };
  };

  if (!isLoaded || isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  function handleFileChange(value: string) {
    if (!project || !selectedFile) return;

    const updatedProject = {
      ...project,
      rootFolder: updateFileInFolder(project.rootFolder, selectedFilePath, selectedFile.name, value)
    };

    setProject(updatedProject);
    setSelectedFile({ ...selectedFile, content: value });
  }

  // Helper function to update file content in the folder structure
  function updateFileInFolder(folder: Folder, path: string[], fileName: string, newContent: string): Folder {
    // Check if the file is in the current folder
    const updatedFiles = folder.files.map(file => 
      file.name === fileName ? { ...file, content: newContent } : file
    );

    // If we're at the end of the path or the file was found, return the updated folder
    if (path.length === 0 || updatedFiles.some(file => file.name === fileName)) {
      return { ...folder, files: updatedFiles };
    }

    // Otherwise, recurse into the next subfolder
    const [currentFolder, ...restPath] = path;
    return {
      ...folder,
      files: updatedFiles,
      folders: folder.folders.map(f => 
        f.name === currentFolder ? updateFileInFolder(f, restPath, fileName, newContent) : f
      )
    };
  }

  return (
    <div className={styles.projectContainer}>
      <header className={styles.header}>
        <h1 className={styles.title}>{project.title}</h1>
        <p className={styles.description}>{project.description}</p>
        <div className={styles.metadata}>
          <p>Created: {new Date(project.createdAt).toLocaleString()}</p>
          <p>Last updated: {new Date(project.updatedAt).toLocaleString()}</p>
        </div>
      </header>
      <div className={styles.content}>
        <aside className={styles.sidebar}>
          <div className={styles.sidebarTitle}>
            <h2>{project.rootFolder.name}</h2>
            <button onClick={() => handleAddFile([])} className={styles.addButton}>
              <Tooltip text="Add file">
                <FilePlus size={14} className={styles.fileIcon} />
              </Tooltip>
            </button>
            <button onClick={() => handleAddFolder([])} className={styles.addButton}>
              <Tooltip text="Add folder">
                <FolderPlus size={14} className={styles.folderIcon} />
              </Tooltip>
            </button>
          </div>

          <FileTree 
            folder={project.rootFolder} 
            onFileSelect={handleFileSelect} 
            onAddFile={handleAddFile} 
            onAddFolder={handleAddFolder} 
            onDeleteFile={handleDeleteFile}
            onDeleteFolder={handleDeleteFolder}
          />
        </aside>
        <main className={styles.editor}>
          {selectedFile ? (
            <>
              <h2>{selectedFile.name}</h2>
              <MonacoEditor
                height="calc(100% - 70px)"
                language="lua"
                theme="vs-dark"
                value={selectedFile.content}
                onChange={(value) => {
                    if (value !== undefined) {
                        handleFileChange(value);
                    }
                }}
                options={{
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  fontSize: 14,
                  suggestOnTriggerCharacters: true,
                }}
              />
            </>
          ) : (
            <div className={styles.placeholderText}>
              Select a file to edit
            </div>
          )}
        </main>
      </div>
      <div className={styles.buttonContainer}>
      <button className={`${styles.button} ${styles.saveButton}`} onClick={saveProject}>Save</button>
        <button className={`${styles.button} ${styles.deleteButton}`} onClick={deleteProject}>Delete Project</button>
        <button className={`${styles.button} ${styles.exportButton}`} onClick={exportProject}>Export Project</button>
      </div>
    </div>
  );
}
