'use client';

import { Block } from '@/lib/types';
import { TextBlock } from './blocks/TextBlock';
import { HeadingBlock } from './blocks/HeadingBlock';
import { ListBlock } from './blocks/ListBlock';
import { CodeBlock } from './blocks/CodeBlock';
import { QuoteBlock } from './blocks/QuoteBlock';
import { TodoBlock } from './blocks/TodoBlock';
import { DividerBlock } from './blocks/DividerBlock';
import { ImageBlock } from './blocks/ImageBlock';

interface BlockRendererProps {
  block: Block;
  onContentChange: (content: string) => void;
  onPropertiesChange: (properties: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}

export function BlockRenderer({
  block,
  onContentChange,
  onPropertiesChange,
  onFocus,
  onBlur,
  focused
}: BlockRendererProps) {
  const commonProps = {
    block,
    onContentChange,
    onPropertiesChange,
    onFocus,
    onBlur,
    focused
  };

  switch (block.type) {
    case 'text':
      return <TextBlock {...commonProps} />;
    
    case 'heading-1':
    case 'heading-2':
    case 'heading-3':
      return <HeadingBlock {...commonProps} />;
    
    case 'bullet-list':
    case 'numbered-list':
      return <ListBlock {...commonProps} />;
    
    case 'code':
      return <CodeBlock {...commonProps} />;
    
    case 'quote':
      return <QuoteBlock {...commonProps} />;
    
    case 'todo':
      return <TodoBlock {...commonProps} />;
    
    case 'divider':
      return <DividerBlock {...commonProps} />;
    
    case 'image':
      return <ImageBlock {...commonProps} />;
    
    default:
      return <TextBlock {...commonProps} />;
  }
}