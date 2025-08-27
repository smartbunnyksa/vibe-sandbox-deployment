'use client';

import { useRef, useEffect, useState } from 'react';
import { Block } from '@/lib/types';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PROGRAMMING_LANGUAGES } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { ChevronDown, Code } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface CodeBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onPropertiesChange: (properties: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}

export function CodeBlock({
  block,
  onContentChange,
  onPropertiesChange,
  onFocus,
  onBlur,
  focused
}: CodeBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [language, setLanguage] = useState(block.properties.language || 'plaintext');

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

  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    onPropertiesChange({ language: newLanguage });
  };

  return (
    <div className="space-y-2">
      {/* Language Selector */}
      <div className="flex items-center gap-2">
        <Code className="w-4 h-4 text-muted-foreground" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1">
              {language}
              <ChevronDown className="w-3 h-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="max-h-64 overflow-auto">
            {PROGRAMMING_LANGUAGES.map((lang) => (
              <DropdownMenuItem
                key={lang}
                onClick={() => handleLanguageChange(lang)}
                className="text-xs"
              >
                {lang}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Code Editor */}
      <div className="relative">
        <Textarea
          ref={textareaRef}
          value={block.content}
          onChange={(e) => onContentChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder="Enter your code..."
          className={cn(
            "min-h-[120px] resize-none",
            "bg-muted/50 border border-border rounded-md p-3",
            "font-mono text-sm",
            "focus-visible:ring-1 focus-visible:ring-ring",
            "placeholder:text-muted-foreground/50"
          )}
          style={{ height: 'auto' }}
          spellCheck={false}
        />
        
        {/* Syntax highlighting would go here in a full implementation */}
        {/* For now, we'll use plain textarea with monospace font */}
      </div>
    </div>
  );
}