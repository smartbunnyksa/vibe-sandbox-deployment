'use client';

import { useState, useCallback, useEffect } from 'react';
import { Page, Block } from '@/lib/types';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useDebounce } from '@/hooks/useDebounce';
import { BlockEditor } from './BlockEditor';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, GripVertical } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  restrictToVerticalAxis,
  restrictToParentElement,
} from '@dnd-kit/modifiers';

interface EditorProps {
  page: Page;
}

export function Editor({ page }: EditorProps) {
  const { updatePage, updatePageContent } = useWorkspace();
  const [title, setTitle] = useState(page.title);
  const [blocks, setBlocks] = useState<Block[]>(page.content || []);
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);

  // Debounce title and content updates
  const debouncedTitle = useDebounce(title, 500);
  const debouncedBlocks = useDebounce(blocks, 1000);

  // Auto-save title changes
  useEffect(() => {
    if (debouncedTitle !== page.title) {
      updatePage(page.id, { title: debouncedTitle });
    }
  }, [debouncedTitle, page.title, page.id, updatePage]);

  // Auto-save content changes
  useEffect(() => {
    if (JSON.stringify(debouncedBlocks) !== JSON.stringify(page.content)) {
      updatePageContent(page.id, debouncedBlocks);
    }
  }, [debouncedBlocks, page.content, page.id, updatePageContent]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addBlock = useCallback((type: string = 'text', afterBlockId?: string) => {
    const newBlock: Block = {
      id: uuidv4(),
      type: type as any,
      content: '',
      properties: {},
      order: blocks.length
    };

    setBlocks(prevBlocks => {
      if (afterBlockId) {
        const index = prevBlocks.findIndex(block => block.id === afterBlockId);
        if (index !== -1) {
          const newBlocks = [...prevBlocks];
          newBlocks.splice(index + 1, 0, newBlock);
          // Update order numbers
          return newBlocks.map((block, i) => ({ ...block, order: i }));
        }
      }
      return [...prevBlocks, newBlock];
    });

    // Focus the new block
    setTimeout(() => setFocusedBlockId(newBlock.id), 0);
  }, [blocks.length]);

  const updateBlock = useCallback((blockId: string, updates: Partial<Block>) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId ? { ...block, ...updates } : block
      )
    );
  }, []);

  const deleteBlock = useCallback((blockId: string) => {
    setBlocks(prevBlocks => {
      const newBlocks = prevBlocks.filter(block => block.id !== blockId);
      // Update order numbers
      return newBlocks.map((block, i) => ({ ...block, order: i }));
    });
  }, []);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        const newItems = arrayMove(items, oldIndex, newIndex);
        // Update order numbers
        return newItems.map((block, i) => ({ ...block, order: i }));
      });
    }
  };

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        addBlock();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [addBlock]);

  // Ensure there's always at least one block
  useEffect(() => {
    if (blocks.length === 0) {
      addBlock();
    }
  }, [blocks.length, addBlock]);

  return (
    <div className="flex flex-col h-full">
      {/* Page Title */}
      <div className="p-6 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{page.emoji || '📄'}</span>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Untitled"
            className="text-2xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
      </div>

      {/* Content Area */}
      <ScrollArea className="flex-1">
        <div className="max-w-4xl mx-auto p-6 pt-8">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}
          >
            <SortableContext
              items={blocks.map(block => block.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {blocks.map((block, index) => (
                  <BlockEditor
                    key={block.id}
                    block={block}
                    onUpdate={updateBlock}
                    onDelete={deleteBlock}
                    onAddBlock={addBlock}
                    focused={focusedBlockId === block.id}
                    onFocus={() => setFocusedBlockId(block.id)}
                    onBlur={() => setFocusedBlockId(null)}
                    isLast={index === blocks.length - 1}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {/* Add Block Button */}
          <div className="mt-4">
            <Button
              variant="ghost"
              onClick={() => addBlock()}
              className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-8"
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">Add a block</span>
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}