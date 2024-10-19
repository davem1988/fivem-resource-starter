'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/nextjs';
import Tooltip from '@/components/Tooltip';
import { useRouter } from 'next/navigation';
import { useToast } from '@/contexts/ToastContext';

interface Project {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProjectsPage() {
  const { isLoaded, userId } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { showToast } = useToast();

  useEffect(() => {
    if (isLoaded && userId) {
      fetchProjects();
    }
  }, [isLoaded, userId]);

  const fetchProjects = async () => {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      const data = await response.json();
      setProjects(data.projects);
      setIsLoading(false);
    } catch (err) {
      setError('Error fetching projects');
      setIsLoading(false);
      console.error('Error fetching projects:', err);
    }
  };

  const handleProjectClick = (projectId: string, title: string, description: string) => {
    router.push(`/projects/${projectId}?title=${title}&description=${description}`);
  };

  const handleDeleteProject = async (e: React.MouseEvent, projectId: string) => {
    e.stopPropagation();
    // Implement delete logic here
    const result = await fetch(`/api/projects/${projectId}`, {
      method: 'DELETE',
    });
    if (result.ok) {
      fetchProjects();
      showToast('Project deleted successfully', 'success');
    }
  };

  const handleExportProject = async (e: React.MouseEvent, projectId: string, title: string) => {
    e.stopPropagation();

    try {
      const response = await fetch(`/api/projects/${projectId}/export`);

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${title}.zip`;
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

  if (!isLoaded || isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  return (
    <div className="projects-list">
      {projects.length === 0 ? (
        <p>No projects found.</p>
      ) : (
        <ul>
          {projects.map((project) => (
            <li key={project._id} onClick={() => handleProjectClick(project._id, project.title, project.description)}>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <div className="project-actions">
                <Tooltip key={project._id} text="Delete">
                <button onClick={(e) => handleDeleteProject(e, project._id)} aria-label="Delete project">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
                </Tooltip>
                <Tooltip key={project._id} text="Export">
                <button onClick={(e) => handleExportProject(e, project._id, project.title)} aria-label="Export project">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                  </svg>
                </button>
                </Tooltip>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
