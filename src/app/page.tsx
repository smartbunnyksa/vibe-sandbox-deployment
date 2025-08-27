'use client';

import { useEffect, useState } from 'react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { Editor } from '@/components/editor/Editor';
import { CommandPalette } from '@/components/layout/CommandPalette';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';

export default function HomePage() {
  const {
    workspace,
    currentPageId,
    setCurrentPageId,
    createPage,
    getCurrentPage,
    getRootPages,
    addToRecentPages
  } = useWorkspace();
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  // Set initial page if none selected
  useEffect(() => {
    if (!currentPageId && workspace.recentPages.length > 0) {
      const firstRecentPage = workspace.recentPages[0];
      if (workspace.pages[firstRecentPage]) {
        setCurrentPageId(firstRecentPage);
      }
    }
  }, [currentPageId, workspace.recentPages, workspace.pages, setCurrentPageId]);

  const handleCreatePage = () => {
    const newPageId = createPage('Untitled');
    setCurrentPageId(newPageId);
    addToRecentPages(newPageId);
  };

  const handleSelectPage = (pageId: string) => {
    setCurrentPageId(pageId);
    addToRecentPages(pageId);
  };

  const currentPage = getCurrentPage();
  const rootPages = getRootPages();

  // Show welcome screen if no pages exist
  if (Object.keys(workspace.pages).length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Welcome to Notes</h1>
          <p className="text-muted-foreground max-w-md">
            Create your first page to get started with your personal workspace.
          </p>
          <Button onClick={handleCreatePage} size="lg" className="gap-2">
            <PlusCircle className="w-5 h-5" />
            Create Your First Page
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar
        workspace={workspace}
        currentPageId={currentPageId}
        onSelectPage={handleSelectPage}
        onCreatePage={handleCreatePage}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentPage={currentPage}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        />
        
        <main className="flex-1 overflow-hidden">
          {currentPage ? (
            <Editor
              page={currentPage}
              key={currentPage.id} // Force re-render when page changes
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-muted-foreground">
                  Select a page to start editing
                </h2>
                <Button onClick={handleCreatePage} className="gap-2">
                  <PlusCircle className="w-4 h-4" />
                  Create New Page
                </Button>
              </div>
            </div>
          )}
        </main>
      </div>

      <CommandPalette
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
        workspace={workspace}
        onSelectPage={handleSelectPage}
        onCreatePage={handleCreatePage}
      />
    </div>
  );
}