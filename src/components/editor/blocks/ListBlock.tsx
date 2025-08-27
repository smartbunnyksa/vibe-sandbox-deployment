'use client';

import { useRef, useEffect } from 'react';
import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface ListBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}

export function ListBlock({
  block,
  onContentChange,
  onFocus,
  onBlur,
  focused
}: ListBlockProps) {
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

  const getListSymbol = () => {
    switch (block.type) {
      case 'bullet-list':
        return '•';
      case 'numbered-list':
        return '1.';
      default:
        return '•';
    }
  };

  const getPlaceholder = () => {
    switch (block.type) {
      case 'bullet-list':
        return 'List item';
      case 'numbered-list':
        return 'List item';
      default:
        return 'List item';
    }
  };

  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground mt-0.5 text-sm font-medium min-w-[16px]">
        {getListSymbol()}
      </span>
      <Input
        ref={inputRef}
        value={block.content}
        onChange={(e) => onContentChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder={getPlaceholder()}
        className={cn(
          "border-none bg-transparent p-0 h-auto text-sm",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "placeholder:text-muted-foreground/50"
        )}
      />
    </div>
  );
}