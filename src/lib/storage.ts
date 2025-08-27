import { Workspace, Page, Block } from './types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'notion-app-workspace';

export class StorageManager {
  static getWorkspace(): Workspace {
    if (typeof window === 'undefined') {
      return this.createDefaultWorkspace();
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaultWorkspace = this.createDefaultWorkspace();
      this.saveWorkspace(defaultWorkspace);
      return defaultWorkspace;
    }

    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Error parsing workspace from storage:', error);
      return this.createDefaultWorkspace();
    }
  }

  static saveWorkspace(workspace: Workspace): void {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(workspace));
    } catch (error) {
      console.error('Error saving workspace to storage:', error);
    }
  }

  static createDefaultWorkspace(): Workspace {
    const welcomePageId = uuidv4();
    const welcomePage = this.createWelcomePage(welcomePageId);
    
    return {
      id: uuidv4(),
      name: 'My Workspace',
      pages: {
        [welcomePageId]: welcomePage
      },
      recentPages: [welcomePageId],
      favorites: []
    };
  }

  static createWelcomePage(id: string): Page {
    const blocks: Block[] = [
      {
        id: uuidv4(),
        type: 'heading-1',
        content: 'Welcome to Your Notion-like Workspace',
        properties: {},
        order: 0
      },
      {
        id: uuidv4(),
        type: 'text',
        content: 'This is your personal note-taking space. You can create pages, organize them in a hierarchy, and use various block types to structure your content.',
        properties: {},
        order: 1
      },
      {
        id: uuidv4(),
        type: 'heading-2',
        content: 'Getting Started',
        properties: {},
        order: 2
      },
      {
        id: uuidv4(),
        type: 'bullet-list',
        content: 'Click the "+" button to create a new page',
        properties: {},
        order: 3
      },
      {
        id: uuidv4(),
        type: 'bullet-list',
        content: 'Use the sidebar to navigate between pages',
        properties: {},
        order: 4
      },
      {
        id: uuidv4(),
        type: 'bullet-list',
        content: 'Try different block types by typing "/" in the editor',
        properties: {},
        order: 5
      },
      {
        id: uuidv4(),
        type: 'bullet-list',
        content: 'Use Cmd+K (Mac) or Ctrl+K (Windows) to open the command palette',
        properties: {},
        order: 6
      },
      {
        id: uuidv4(),
        type: 'todo',
        content: 'Complete this checklist to get familiar with the app',
        properties: { checked: false },
        order: 7
      },
      {
        id: uuidv4(),
        type: 'todo',
        content: 'Create your first page',
        properties: { checked: false },
        order: 8
      },
      {
        id: uuidv4(),
        type: 'todo',
        content: 'Try adding different types of content blocks',
        properties: { checked: false },
        order: 9
      }
    ];

    return {
      id,
      title: 'Welcome',
      content: blocks,
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      tags: ['welcome'],
      emoji: '👋'
    };
  }

  static createNewPage(title: string = 'Untitled', parentId?: string): Page {
    const pageId = uuidv4();
    const initialBlock: Block = {
      id: uuidv4(),
      type: 'text',
      content: '',
      properties: {},
      order: 0
    };

    return {
      id: pageId,
      title,
      content: [initialBlock],
      parentId,
      children: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isFavorite: false,
      tags: [],
      emoji: '📄'
    };
  }

  static exportToMarkdown(page: Page): string {
    let markdown = `# ${page.title}\n\n`;
    
    page.content.forEach(block => {
      switch (block.type) {
        case 'heading-1':
          markdown += `# ${block.content}\n\n`;
          break;
        case 'heading-2':
          markdown += `## ${block.content}\n\n`;
          break;
        case 'heading-3':
          markdown += `### ${block.content}\n\n`;
          break;
        case 'bullet-list':
          markdown += `- ${block.content}\n`;
          break;
        case 'numbered-list':
          markdown += `1. ${block.content}\n`;
          break;
        case 'code':
          const language = block.properties.language || '';
          markdown += `\`\`\`${language}\n${block.content}\n\`\`\`\n\n`;
          break;
        case 'quote':
          markdown += `> ${block.content}\n\n`;
          break;
        case 'todo':
          const checked = block.properties.checked ? 'x' : ' ';
          markdown += `- [${checked}] ${block.content}\n`;
          break;
        case 'divider':
          markdown += `---\n\n`;
          break;
        case 'text':
        default:
          markdown += `${block.content}\n\n`;
          break;
      }
    });

    return markdown;
  }
}