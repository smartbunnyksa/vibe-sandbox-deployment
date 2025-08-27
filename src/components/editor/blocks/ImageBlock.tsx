'use client';

import { useState, useRef } from 'react';
import { Block } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Upload, Image as ImageIcon, Link } from 'lucide-react';

interface ImageBlockProps {
  block: Block;
  onContentChange: (content: string) => void;
  onPropertiesChange: (properties: any) => void;
  onFocus: () => void;
  onBlur: () => void;
  focused: boolean;
}

export function ImageBlock({
  block,
  onContentChange,
  onPropertiesChange,
  onFocus,
  onBlur,
  focused
}: ImageBlockProps) {
  const [showUrlInput, setShowUrlInput] = useState(!block.content);
  const [urlInput, setUrlInput] = useState(block.content);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onContentChange(urlInput.trim());
      setShowUrlInput(false);
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real implementation, you would upload the file to a server
      // For now, we'll create a placeholder URL
      const placeholderUrl = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/d912e1e6-748f-47ea-8025-06460e23ad9d.png}`;
      onContentChange(placeholderUrl);
      setShowUrlInput(false);
    }
  };

  const handleEdit = () => {
    setUrlInput(block.content);
    setShowUrlInput(true);
    onFocus();
  };

  if (showUrlInput) {
    return (
      <div className="space-y-3 p-4 border border-dashed border-border rounded-lg">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          <span>Add an image</span>
        </div>
        
        <div className="space-y-3">
          {/* URL Input */}
          <div className="flex gap-2">
            <Input
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="Paste image URL or upload a file"
              onFocus={onFocus}
              onBlur={onBlur}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleUrlSubmit();
                }
              }}
              className="flex-1"
            />
            <Button onClick={handleUrlSubmit} size="sm">
              <Link className="w-4 h-4" />
            </Button>
          </div>

          {/* File Upload */}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              size="sm"
              className="gap-2"
            >
              <Upload className="w-4 h-4" />
              Upload Image
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!block.content) {
    return (
      <div 
        className="p-4 border border-dashed border-border rounded-lg cursor-pointer hover:bg-accent/50 transition-colors"
        onClick={() => setShowUrlInput(true)}
      >
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          <span>Click to add an image</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div 
        className="relative group cursor-pointer"
        onClick={onFocus}
      >
        <img
          src={block.content}
          alt={block.properties.alt || 'Image'}
          className={cn(
            "max-w-full h-auto rounded-lg border border-border",
            focused && "ring-2 ring-blue-500/20"
          )}
          onError={(e) => {
            // Fallback for broken images
            const target = e.target as HTMLImageElement;
            target.src = `https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e40eb231-92db-4f66-8e6d-9ca31b3933f2.png`;
          }}
        />
        
        {/* Edit overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit();
            }}
          >
            Edit Image
          </Button>
        </div>
      </div>
    </div>
  );
}