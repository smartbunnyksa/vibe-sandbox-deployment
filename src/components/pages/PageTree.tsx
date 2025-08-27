'use client';

import { useState } from 'react';
import { Page, Workspace } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronRight, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface PageTreeProps {
  pages: Page[];
  workspace: Workspace;
  currentPageId?: string;
  onSelectPage: (pageId: string) => void;
  level: number;
}

export function PageTree({
  pages,
  workspace,
  currentPageId,
  onSelectPage,
  level
}: PageTreeProps) {
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());

  const toggleExpanded = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const getChildPages = (parentId: string): Page[] => {
    const parent = workspace.pages[parentId];
    if (!parent) return [];
    return parent.children.map(id => workspace.pages[id]).filter(Boolean);
  };

  return (
    <div className="space-y-1">
      {pages.map((page) => {
        const hasChildren = page.children.length > 0;
        const isExpanded = expandedPages.has(page.id);
        const childPages = getChildPages(page.id);
        const paddingLeft = level * 12;

        return (
          <div key={page.id}>
            {/* Page Item */}
            <div
              className={cn(
                "group flex items-center gap-1 rounded-md hover:bg-accent/50 transition-colors",
                currentPageId === page.id && "bg-accent text-accent-foreground"
              )}
              style={{ paddingLeft: `${paddingLeft + 8}px` }}
            >
              {/* Expand/Collapse Button */}
              {hasChildren ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => toggleExpanded(page.id)}
                  className="w-4 h-4 p-0 hover:bg-accent"
                >
                  {isExpanded ? (
                    <ChevronDown className="w-3 h-3" />
                  ) : (
                    <ChevronRight className="w-3 h-3" />
                  )}
                </Button>
              ) : (
                <div className="w-4 h-4" />
              )}

              {/* Page Content */}
              <button
                onClick={() => onSelectPage(page.id)}
                className="flex-1 flex items-center gap-2 py-1.5 text-left text-sm min-w-0"
              >
                <span className="text-xs flex-shrink-0">
                  {page.emoji || '📄'}
                </span>
                <span className="truncate">{page.title}</span>
              </button>

              {/* Actions Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="w-4 h-4 p-0 opacity-0 group-hover:opacity-100 hover:bg-accent"
                  >
                    <MoreHorizontal className="w-3 h-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem>
                    Add Sub-page
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Duplicate
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-destructive">
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Child Pages */}
            {hasChildren && isExpanded && (
              <PageTree
                pages={childPages}
                workspace={workspace}
                currentPageId={currentPageId}
                onSelectPage={onSelectPage}
                level={level + 1}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}