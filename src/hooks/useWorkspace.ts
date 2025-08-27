'use client';

import { useState, useEffect, useCallback } from 'react';
import { Workspace, Page, Block } from '@/lib/types';
import { StorageManager } from '@/lib/storage';
import { useDebounce } from './useDebounce';

export function useWorkspace() {
  const [workspace, setWorkspace] = useState<Workspace>(() => StorageManager.getWorkspace());
  const [currentPageId, setCurrentPageId] = useState<string | undefined>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Debounce workspace changes to avoid excessive localStorage writes
  const debouncedWorkspace = useDebounce(workspace, 1000);

  // Auto-save to localStorage
  useEffect(() => {
    if (hasUnsavedChanges) {
      StorageManager.saveWorkspace(debouncedWorkspace);
      setHasUnsavedChanges(false);
    }
  }, [debouncedWorkspace, hasUnsavedChanges]);

  const updateWorkspace = useCallback((updater: (ws: Workspace) => Workspace) => {
    setWorkspace(updater);
    setHasUnsavedChanges(true);
  }, []);

  const createPage = useCallback((title: string = 'Untitled', parentId?: string) => {
    const newPage = StorageManager.createNewPage(title, parentId);
    
    updateWorkspace(ws => {
      const updatedWorkspace = { ...ws };
      updatedWorkspace.pages[newPage.id] = newPage;
      
      // Add to recent pages
      updatedWorkspace.recentPages = [newPage.id, ...updatedWorkspace.recentPages.filter(id => id !== newPage.id)].slice(0, 10);
      
      // If it has a parent, add to parent's children
      if (parentId && updatedWorkspace.pages[parentId]) {
        updatedWorkspace.pages[parentId] = {
          ...updatedWorkspace.pages[parentId],
          children: [...updatedWorkspace.pages[parentId].children, newPage.id]
        };
      }
      
      return updatedWorkspace;
    });
    
    return newPage.id;
  }, [updateWorkspace]);

  const deletePage = useCallback((pageId: string) => {
    updateWorkspace(ws => {
      const updatedWorkspace = { ...ws };
      const page = updatedWorkspace.pages[pageId];
      
      if (!page) return ws;
      
      // Recursively delete child pages
      const deletePageRecursive = (id: string) => {
        const pageToDelete = updatedWorkspace.pages[id];
        if (pageToDelete) {
          pageToDelete.children.forEach(childId => deletePageRecursive(childId));
          delete updatedWorkspace.pages[id];
        }
      };
      
      deletePageRecursive(pageId);
      
      // Remove from parent's children
      if (page.parentId && updatedWorkspace.pages[page.parentId]) {
        updatedWorkspace.pages[page.parentId] = {
          ...updatedWorkspace.pages[page.parentId],
          children: updatedWorkspace.pages[page.parentId].children.filter(id => id !== pageId)
        };
      }
      
      // Remove from recent pages and favorites
      updatedWorkspace.recentPages = updatedWorkspace.recentPages.filter(id => id !== pageId);
      updatedWorkspace.favorites = updatedWorkspace.favorites.filter(id => id !== pageId);
      
      return updatedWorkspace;
    });
  }, [updateWorkspace]);

  const updatePage = useCallback((pageId: string, updates: Partial<Page>) => {
    updateWorkspace(ws => ({
      ...ws,
      pages: {
        ...ws.pages,
        [pageId]: {
          ...ws.pages[pageId],
          ...updates,
          updatedAt: new Date().toISOString()
        }
      }
    }));
  }, [updateWorkspace]);

  const updatePageContent = useCallback((pageId: string, blocks: Block[]) => {
    updatePage(pageId, { content: blocks });
  }, [updatePage]);

  const toggleFavorite = useCallback((pageId: string) => {
    const page = workspace.pages[pageId];
    if (!page) return;
    
    updateWorkspace(ws => {
      const isFavorite = !page.isFavorite;
      return {
        ...ws,
        pages: {
          ...ws.pages,
          [pageId]: { ...page, isFavorite }
        },
        favorites: isFavorite 
          ? [...ws.favorites, pageId]
          : ws.favorites.filter(id => id !== pageId)
      };
    });
  }, [workspace.pages, updateWorkspace]);

  const addToRecentPages = useCallback((pageId: string) => {
    updateWorkspace(ws => ({
      ...ws,
      recentPages: [pageId, ...ws.recentPages.filter(id => id !== pageId)].slice(0, 10)
    }));
  }, [updateWorkspace]);

  const getCurrentPage = useCallback(() => {
    return currentPageId ? workspace.pages[currentPageId] : undefined;
  }, [workspace.pages, currentPageId]);

  const getRootPages = useCallback(() => {
    return Object.values(workspace.pages).filter(page => !page.parentId);
  }, [workspace.pages]);

  const getChildPages = useCallback((parentId: string) => {
    const parent = workspace.pages[parentId];
    if (!parent) return [];
    return parent.children.map(id => workspace.pages[id]).filter(Boolean);
  }, [workspace.pages]);

  return {
    workspace,
    currentPageId,
    setCurrentPageId,
    hasUnsavedChanges,
    createPage,
    deletePage,
    updatePage,
    updatePageContent,
    toggleFavorite,
    addToRecentPages,
    getCurrentPage,
    getRootPages,
    getChildPages
  };
}