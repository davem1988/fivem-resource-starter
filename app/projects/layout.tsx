'use client';

import React from 'react';
import '../globals.css';
import { useModal } from '../../utils/modalManager';
import CreateProjectModal from '@/components/modals/CreateProjectModal';
import { usePathname } from 'next/navigation';

export default function ProjectsLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const { activeModal, openModal, closeModal } = useModal();
    const pathname = usePathname();

    // Check if we're in a specific project
    const isInSpecificProject = /^\/projects\/[^\/]+$/.test(pathname);

    // If we're in a specific project, render children directly
    if (isInSpecificProject) {
        return <>{children}</>;
    }

    // Otherwise, render the projects layout
    return (
        <div className="main-window">
        <div className="projects-layout">
            <header className="projects-header">
                <h1>Projects</h1>
                <button className="create-project-btn" onClick={() => openModal('createProject')}>
                    Create New Project
                </button>
            </header>
            <main>{children}</main>
            <CreateProjectModal 
                isOpen={activeModal === 'createProject'} 
                onClose={closeModal} 
            />
        </div>
        </div>
    );
}
