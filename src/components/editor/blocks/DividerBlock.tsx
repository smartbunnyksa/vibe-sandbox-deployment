'use client';

import { Block } from '@/lib/types';
import { Separator } from '@/components/ui/separator';

interface DividerBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}

export function DividerBlock({
  onFocus
}: DividerBlockProps) {
  return (
    <div 
      className="py-4 cursor-pointer"
      onClick={onFocus}
    >
      <Separator className="bg-border" />
    </div>
  );
}