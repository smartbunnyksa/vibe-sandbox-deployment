export type BlockType = 
  | 'text' 
  | 'heading-1' 
  | 'heading-2' 
  | 'heading-3'
  | 'bullet-list'
  | 'numbered-list'
  | 'code'
  | 'image'
  | 'quote'
  | 'todo'
  | 'divider';

export interface BlockProperties {
  level?: number; // For headings
  language?: string; // For code blocks
  checked?: boolean; // For todos
  alignment?: 'left' | 'center' | 'right';
  [key: string]: any;
}

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  properties: BlockProperties;
  order: number;
}

export interface Page {
  id: string;
  title: string;
  content: Block[];
  parentId?: string;
  children: string[]; // Array of child page IDs
  createdAt: string;
  updatedAt: string;
  isFavorite: boolean;
  tags: string[];
  emoji?: string;
}

export interface Workspace {
  id: string;
  name: string;
  pages: { [key: string]: Page };
  recentPages: string[];
  favorites: string[];
}

export interface SearchResult {
  pageId: string;
  pageTitle: string;
  blockId?: string;
  content: string;
  score: number;
}

export interface AppState {
  workspace: Workspace;
  currentPageId?: string;
  sidebarCollapsed: boolean;
  theme: 'light' | 'dark' | 'system';
  commandPaletteOpen: boolean;
}