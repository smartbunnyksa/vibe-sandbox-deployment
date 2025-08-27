export const BLOCK_TYPES = {
  TEXT: 'text',
  HEADING_1: 'heading-1',
  HEADING_2: 'heading-2',
  HEADING_3: 'heading-3',
  BULLET_LIST: 'bullet-list',
  NUMBERED_LIST: 'numbered-list',
  CODE: 'code',
  IMAGE: 'image',
  QUOTE: 'quote',
  TODO: 'todo',
  DIVIDER: 'divider'
} as const;

export const KEYBOARD_SHORTCUTS = {
  COMMAND_PALETTE: ['cmd+k', 'ctrl+k'],
  NEW_PAGE: ['cmd+n', 'ctrl+n'],
  SEARCH: ['cmd+f', 'ctrl+f'],
  TOGGLE_SIDEBAR: ['cmd+\\', 'ctrl+\\'],
  SAVE: ['cmd+s', 'ctrl+s']
} as const;

export const PROGRAMMING_LANGUAGES = [
  'javascript',
  'typescript',
  'python',
  'java',
  'cpp',
  'c',
  'csharp',
  'php',
  'ruby',
  'go',
  'rust',
  'swift',
  'kotlin',
  'html',
  'css',
  'scss',
  'sql',
  'bash',
  'shell',
  'json',
  'xml',
  'yaml',
  'markdown',
  'dockerfile',
  'plaintext'
];

export const PAGE_TEMPLATES = [
  {
    id: 'blank',
    name: 'Blank Page',
    description: 'Start with an empty page',
    emoji: '📄',
    blocks: []
  },
  {
    id: 'meeting-notes',
    name: 'Meeting Notes',
    description: 'Template for meeting notes',
    emoji: '🗓️',
    blocks: [
      { type: 'heading-1', content: 'Meeting Notes - {{date}}' },
      { type: 'heading-2', content: 'Attendees' },
      { type: 'bullet-list', content: '' },
      { type: 'heading-2', content: 'Agenda' },
      { type: 'bullet-list', content: '' },
      { type: 'heading-2', content: 'Discussion' },
      { type: 'text', content: '' },
      { type: 'heading-2', content: 'Action Items' },
      { type: 'todo', content: '' }
    ]
  },
  {
    id: 'project-plan',
    name: 'Project Plan',
    description: 'Template for project planning',
    emoji: '📋',
    blocks: [
      { type: 'heading-1', content: 'Project: {{title}}' },
      { type: 'heading-2', content: 'Overview' },
      { type: 'text', content: '' },
      { type: 'heading-2', content: 'Objectives' },
      { type: 'bullet-list', content: '' },
      { type: 'heading-2', content: 'Timeline' },
      { type: 'text', content: '' },
      { type: 'heading-2', content: 'Tasks' },
      { type: 'todo', content: '' }
    ]
  }
];