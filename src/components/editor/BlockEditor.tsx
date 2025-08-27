'use client';

import { useState, useRef, useEffect } from 'react';
import { Block, BlockType } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { BlockRenderer } from './BlockRenderer';
import { cn } from '@/lib/utils';
import { 
  GripVertical, 
  Plus, 
  MoreHorizontal,
  Type,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Code,
  Image,
  Quote,
  CheckSquare,
  Minus
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  useSortable
} from '@dnd-kit/sortable';
import {
  CSS
} from '@dnd-kit/utilities';

interface BlockEditorProps {
  block: Block;
  onUpdate: (blockId: string, updates: Partial<Block>) => void;
  onDelete: (blockId: string) => void;
  onAddBlock: (type?: string, afterBlockId?: string) => void;
  focused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  isLast: boolean;
}

const BLOCK_TYPE_OPTIONS = [
  { type: 'text', label: 'Text', icon: Type },
  { type: 'heading-1', label: 'Heading 1', icon: Heading1 },
  { type: 'heading-2', label: 'Heading 2', icon: Heading2 },
  { type: 'heading-3', label: 'Heading 3', icon: Heading3 },
  { type: 'bullet-list', label: 'Bullet List', icon: List },
  { type: 'numbered-list', label: 'Numbered List', icon: ListOrdered },
  { type: 'todo', label: 'To-do List', icon: CheckSquare },
  { type: 'code', label: 'Code', icon: Code },
  { type: 'quote', label: 'Quote', icon: Quote },
  { type: 'divider', label: 'Divider', icon: Minus },
];

export function BlockEditor({
  block,
  onUpdate,
  onDelete,
  onAddBlock,
  focused,
  onFocus,
  onBlur,
  isLast
}: BlockEditorProps) {
  const [showControls, setShowControls] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleContentChange = (content: string) => {
    onUpdate(block.id, { content });
  };

  const handleTypeChange = (newType: BlockType) => {
    onUpdate(block.id, { type: newType });
    setShowTypeSelector(false);
  };

  const handlePropertiesChange = (properties: any) => {
    onUpdate(block.id, { properties: { ...block.properties, ...properties } });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    // Handle slash command for block type selection
    if (e.key === '/' && block.content === '') {
      e.preventDefault();
      setShowTypeSelector(true);
    }
    
    // Handle Enter to create new block
    if (e.key === 'Enter' && !e.shiftKey && isLast) {
      e.preventDefault();
      onAddBlock('text', block.id);
    }
    
    // Handle Backspace to delete empty block
    if (e.key === 'Backspace' && block.content === '' && block.type === 'text') {
      e.preventDefault();
      onDelete(block.id);
    }
  };

  // Attach keyboard event listeners
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    element.addEventListener('keydown', handleKeyDown as any);
    return () => element.removeEventListener('keydown', handleKeyDown as any);
  }, [block.content, block.type, isLast]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative",
        isDragging && "opacity-50"
      )}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <div
        ref={containerRef}
        className={cn(
          "flex items-start gap-2 rounded-md transition-colors",
          focused && "ring-2 ring-blue-500/20",
          showControls && "bg-accent/30"
        )}
        onClick={onFocus}
      >
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className={cn(
            "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing",
            "mt-1 py-1"
          )}
        >
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>

        {/* Block Content */}
        <div className="flex-1 min-w-0">
          <BlockRenderer
            block={block}
            onContentChange={handleContentChange}
            onPropertiesChange={handlePropertiesChange}
            onFocus={onFocus}
            onBlur={onBlur}
            focused={focused}
          />
        </div>

        {/* Block Controls */}
        <div
          className={cn(
            "flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity",
            "mt-1 py-1"
          )}
        >
          {/* Add Block Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onAddBlock('text', block.id)}
            className="w-6 h-6 text-muted-foreground hover:text-foreground"
          >
            <Plus className="w-3 h-3" />
          </Button>

          {/* Block Type Selector */}
          <DropdownMenu open={showTypeSelector} onOpenChange={setShowTypeSelector}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-muted-foreground hover:text-foreground"
              >
                <Type className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {BLOCK_TYPE_OPTIONS.map((option) => {
                const Icon = option.icon;
                return (
                  <DropdownMenuItem
                    key={option.type}
                    onClick={() => handleTypeChange(option.type as BlockType)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{option.label}</span>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* More Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 text-muted-foreground hover:text-foreground"
              >
                <MoreHorizontal className="w-3 h-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => onAddBlock('text', block.id)}>
                Add Block Above
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onAddBlock('text', block.id)}>
                Add Block Below
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => onDelete(block.id)} className="text-destructive">
                Delete Block
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}