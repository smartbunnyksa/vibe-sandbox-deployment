'use client';

import { Page } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { 
  Search, 
  Sun, 
  Moon, 
  MoreHorizontal,
  Star,
  Download,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderProps {
  currentPage?: Page;
  onOpenCommandPalette: () => void;
}

export function Header({ currentPage, onOpenCommandPalette }: HeaderProps) {
  const { theme, setTheme } = useTheme();

  const handleExportMarkdown = () => {
    if (!currentPage) return;
    
    // This will be implemented when we add the export functionality
    console.log('Export markdown for page:', currentPage.id);
  };

  const handleToggleFavorite = () => {
    if (!currentPage) return;
    
    // This will be implemented when we connect to the workspace actions
    console.log('Toggle favorite for page:', currentPage.id);
  };

  const handleDeletePage = () => {
    if (!currentPage) return;
    
    // This will be implemented when we connect to the workspace actions
    console.log('Delete page:', currentPage.id);
  };

  return (
    <header className="h-14 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4">
      {/* Left side - Breadcrumbs */}
      <div className="flex items-center gap-2">
        {currentPage && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="text-base">{currentPage.emoji || '📄'}</span>
            <span className="font-medium text-foreground">{currentPage.title}</span>
            {currentPage.isFavorite && (
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            )}
          </div>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-1">
        {/* Search/Command Palette */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onOpenCommandPalette}
          className="gap-2 text-muted-foreground"
        >
          <Search className="w-4 h-4" />
          <span className="hidden sm:inline text-xs">Search</span>
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        {/* Page Actions */}
        {currentPage && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
                <span className="sr-only">Page actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleToggleFavorite}>
                <Star className="w-4 h-4 mr-2" />
                {currentPage.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportMarkdown}>
                <Download className="w-4 h-4 mr-2" />
                Export as Markdown
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleDeletePage} className="text-destructive">
                <Trash2 className="w-4 h-4 mr-2" />
                Delete Page
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}