'use client';

import { useRef, useEffect } from 'react';
import { Block } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface TextBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}

export function TextBlock({
  block,
  onContentChange,
  onFocus,
  onBlur,
  focused
}: TextBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus when block becomes focused
  useEffect(() => {
    if (focused && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
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
    <Textarea
      ref={textareaRef}
      value={block.content}
      onChange={(e) => onContentChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Type '/' for commands"
      className={cn(
        "min-h-[32px] resize-none border-none bg-transparent p-0 text-sm",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "placeholder:text-muted-foreground/50"
      )}
      style={{ height: 'auto' }}
    />
  );
}