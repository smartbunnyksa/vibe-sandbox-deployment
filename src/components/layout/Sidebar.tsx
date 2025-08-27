'use client';

import { useState } from 'react';
import { Workspace } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { PageTree } from '@/components/pages/PageTree';
import { cn } from '@/lib/utils';
import { 
  PlusCircle, 
  Search, 
  Star, 
  Clock, 
  ChevronLeft,
  ChevronRight,
  Settings
} from 'lucide-react';

interface SidebarProps {
  workspace: Workspace;
  currentPageId?: string;
  onSelectPage: (pageId: string) => void;
  onCreatePage: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  workspace,
  currentPageId,
  onSelectPage,
  onCreatePage,
  collapsed,
  onToggleCollapse
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const favoritePages = workspace.favorites
    .map(id => workspace.pages[id])
    .filter(Boolean);

  const recentPages = workspace.recentPages
    .slice(0, 5)
    .map(id => workspace.pages[id])
    .filter(Boolean);

  const rootPages = Object.values(workspace.pages)
    .filter(page => !page.parentId)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  if (collapsed) {
    return (
      <div className="w-12 bg-muted/30 border-r border-border flex flex-col items-center py-4 space-y-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="w-8 h-8"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={onCreatePage}
          className="w-8 h-8"
        >
          <PlusCircle className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="w-64 bg-muted/30 border-r border-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-sm text-foreground">
            {workspace.name}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="w-6 h-6"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
        </div>
        
        <Button
          onClick={onCreatePage}
          className="w-full justify-start gap-2 text-sm"
          variant="ghost"
        >
          <PlusCircle className="w-4 h-4" />
          New Page
        </Button>
      </div>

      {/* Navigation Sections */}
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {/* Search */}
          <div className="px-2 py-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground cursor-pointer">
              <Search className="w-4 h-4" />
              <span>Search</span>
            </div>
          </div>

          {/* Favorites */}
          {favoritePages.length > 0 && (
            <>
              <div className="px-2 py-1">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Star className="w-3 h-3" />
                  Favorites
                </div>
              </div>
              <div className="space-y-1">
                {favoritePages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => onSelectPage(page.id)}
                    className={cn(
                      "w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent/50 transition-colors flex items-center gap-2",
                      currentPageId === page.id && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span className="text-xs">{page.emoji || '📄'}</span>
                    <span className="truncate">{page.title}</span>
                  </button>
                ))}
              </div>
              <Separator className="my-2" />
            </>
          )}

          {/* Recent */}
          {recentPages.length > 0 && (
            <>
              <div className="px-2 py-1">
                <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  <Clock className="w-3 h-3" />
                  Recent
                </div>
              </div>
              <div className="space-y-1">
                {recentPages.map(page => (
                  <button
                    key={page.id}
                    onClick={() => onSelectPage(page.id)}
                    className={cn(
                      "w-full text-left px-2 py-1.5 text-sm rounded-md hover:bg-accent/50 transition-colors flex items-center gap-2",
                      currentPageId === page.id && "bg-accent text-accent-foreground"
                    )}
                  >
                    <span className="text-xs">{page.emoji || '📄'}</span>
                    <span className="truncate">{page.title}</span>
                  </button>
                ))}
              </div>
              <Separator className="my-2" />
            </>
          )}

          {/* All Pages */}
          <div className="px-2 py-1">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              All Pages
            </div>
          </div>
          
          <PageTree
            pages={rootPages}
            workspace={workspace}
            currentPageId={currentPageId}
            onSelectPage={onSelectPage}
            level={0}
          />
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start gap-2 text-muted-foreground"
        >
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>
    </div>
  );
}