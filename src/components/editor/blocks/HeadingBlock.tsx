'use client';

import { useRef, useEffect } from 'react';
import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface HeadingBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}

export function HeadingBlock({
  block,
  onContentChange,
  onFocus,
  onBlur,
  focused
}: HeadingBlockProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when block becomes focused
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
      // Move cursor to end
      const length = inputRef.current.value.length;
      inputRef.current.setSelectionRange(length, length);
    }
  }, [focused]);

  const getHeadingStyles = () => {
    switch (block.type) {
      case 'heading-1':
        return 'text-3xl font-bold';
      case 'heading-2':
        return 'text-2xl font-semibold';
      case 'heading-3':
        return 'text-xl font-medium';
      default:
        return 'text-lg font-medium';
    }
  };

  const getPlaceholder = () => {
    switch (block.type) {
      case 'heading-1':
        return 'Heading 1';
      case 'heading-2':
        return 'Heading 2';
      case 'heading-3':
        return 'Heading 3';
      default:
        return 'Heading';
    }
  };

  return (
    <Input
      ref={inputRef}
      value={block.content}
      onChange={(e) => onContentChange(e.target.value)}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={getPlaceholder()}
      className={cn(
        "border-none bg-transparent p-0 h-auto",
        "focus-visible:ring-0 focus-visible:ring-offset-0",
        "placeholder:text-muted-foreground/50",
        getHeadingStyles()
      )}
    />
  );
}