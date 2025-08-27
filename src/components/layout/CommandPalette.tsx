'use client';

import { useState, useEffect } from 'react';
import { Workspace } from '@/lib/types';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { 
  Search, 
  Plus, 
  FileText, 
  Star, 
  Clock,
  Sun,
  Moon
} from 'lucide-react';
import { useTheme } from 'next-themes';
import Fuse from 'fuse.js';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspace: Workspace;
  onSelectPage: (pageId: string) => void;
  onCreatePage: () => void;
}

interface SearchableItem {
  id: string;
  title: string;
  type: 'page' | 'action';
  emoji?: string;
  action?: () => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  workspace,
  onSelectPage,
  onCreatePage
}: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const { setTheme } = useTheme();
  const [fuse, setFuse] = useState<Fuse<SearchableItem> | null>(null);

  // Create searchable items
  const searchableItems: SearchableItem[] = [
    // Actions
    {
      id: 'new-page',
      title: 'Create New Page',
      type: 'action',
      emoji: '➕',
      action: () => {
        onCreatePage();
        onOpenChange(false);
      }
    },
    {
      id: 'toggle-theme-dark',
      title: 'Switch to Dark Theme',
      type: 'action',
      emoji: '🌙',
      action: () => {
        setTheme('dark');
        onOpenChange(false);
      }
    },
    {
      id: 'toggle-theme-light',
      title: 'Switch to Light Theme',
      type: 'action',
      emoji: '☀️',
      action: () => {
        setTheme('light');
        onOpenChange(false);
      }
    },
    // Pages
    ...Object.values(workspace.pages).map(page => ({
      id: page.id,
      title: page.title,
      type: 'page' as const,
      emoji: page.emoji,
      action: () => {
        onSelectPage(page.id);
        onOpenChange(false);
      }
    }))
  ];

  // Initialize Fuse.js for fuzzy search
  useEffect(() => {
    const fuseInstance = new Fuse(searchableItems, {
      keys: ['title'],
      threshold: 0.3,
      includeScore: true
    });
    setFuse(fuseInstance);
  }, [workspace.pages]);

  // Get filtered results
  const getFilteredResults = () => {
    if (!search.trim() || !fuse) {
      return searchableItems;
    }
    
    const results = fuse.search(search);
    return results.map(result => result.item);
  };

  const filteredResults = getFilteredResults();
  const pages = filteredResults.filter(item => item.type === 'page');
  const actions = filteredResults.filter(item => item.type === 'action');

  // Handle keyboard shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [open, onOpenChange]);

  // Clear search when dialog closes
  useEffect(() => {
    if (!open) {
      setSearch('');
    }
  }, [open]);

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search pages and commands..."
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        {actions.length > 0 && (
          <CommandGroup heading="Actions">
            {actions.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => item.action?.()}
                className="flex items-center gap-2"
              >
                <span className="text-sm">{item.emoji}</span>
                <span>{item.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {pages.length > 0 && (
          <CommandGroup heading="Pages">
            {pages.map((item) => (
              <CommandItem
                key={item.id}
                onSelect={() => item.action?.()}
                className="flex items-center gap-2"
              >
                <span className="text-sm">{item.emoji || '📄'}</span>
                <span>{item.title}</span>
                {workspace.pages[item.id]?.isFavorite && (
                  <Star className="w-3 h-3 ml-auto fill-yellow-400 text-yellow-400" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Quick recent pages if no search */}
        {!search.trim() && workspace.recentPages.length > 0 && (
          <CommandGroup heading="Recent">
            {workspace.recentPages.slice(0, 5).map((pageId) => {
              const page = workspace.pages[pageId];
              if (!page) return null;
              
              return (
                <CommandItem
                  key={pageId}
                  onSelect={() => {
                    onSelectPage(pageId);
                    onOpenChange(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm">{page.emoji || '📄'}</span>
                  <span>{page.title}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}

        {/* Quick favorites if no search */}
        {!search.trim() && workspace.favorites.length > 0 && (
          <CommandGroup heading="Favorites">
            {workspace.favorites.slice(0, 5).map((pageId) => {
              const page = workspace.pages[pageId];
              if (!page) return null;
              
              return (
                <CommandItem
                  key={pageId}
                  onSelect={() => {
                    onSelectPage(pageId);
                    onOpenChange(false);
                  }}
                  className="flex items-center gap-2"
                >
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm">{page.emoji || '📄'}</span>
                  <span>{page.title}</span>
                </CommandItem>
              );
            })}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}