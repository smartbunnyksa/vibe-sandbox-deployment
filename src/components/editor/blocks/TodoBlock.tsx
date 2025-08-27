'use client';

import { useRef, useEffect } from 'react';
import { Block } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface TodoBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onPropertiesChange: (properties: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}

export function TodoBlock({
  block,
  onContentChange,
  onPropertiesChange,
  onFocus,
  onBlur,
  focused
}: TodoBlockProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isChecked = block.properties.checked || false;

  // Auto-focus when block becomes focused
  useEffect(() => {
    if (focused && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focused]);

  const handleCheckedChange = (checked: boolean) => {
    onPropertiesChange({ checked });
  };

  return (
    <div className="flex items-start gap-3">
      <Checkbox
        checked={isChecked}
        onCheckedChange={handleCheckedChange}
        className="mt-0.5"
        aria-label="Toggle todo item"
      />
      <Input
        ref={inputRef}
        value={block.content}
        onChange={(e) => onContentChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        placeholder="Add a to-do..."
        className={cn(
          "border-none bg-transparent p-0 h-auto text-sm",
          "focus-visible:ring-0 focus-visible:ring-offset-0",
          "placeholder:text-muted-foreground/50",
          isChecked && "line-through text-muted-foreground"
        )}
      />
    </div>
  );
}