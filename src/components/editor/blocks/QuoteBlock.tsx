'use client';

import { useRef, useEffect } from 'react';
import { Block } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface QuoteBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}

export function QuoteBlock({
  block,
  onContentChange,
  onFocus,
  onBlur,
  focused
}: QuoteBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus when block becomes focused
  useEffect(() => {
    if (focused && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [focused]);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [block.content]);

  return (
    <div className="relative">
      {/* Quote border */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-border rounded-full" />
      
      {/* Quote content */}
      <div className="pl-6">
        <Textarea
          ref={textareaRef}
          value={block.content}
          onChange={(e) => onContentChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Enter a quote..."
          className={cn(
            "min-h-[32px] resize-none border-none bg-transparent p-0",
            "text-sm italic text-muted-foreground",
            "focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-muted-foreground/50"
          )}
          style={{ height: 'auto' }}
        />
      </div>
    </div>
  );
}