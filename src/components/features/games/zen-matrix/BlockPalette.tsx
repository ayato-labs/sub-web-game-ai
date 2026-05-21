'use client';

import React from 'react';
import { Block } from '@/lib/games/zen-matrix/engine';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface BlockPaletteProps {
  blocks: Block[];
  isMobile?: boolean;
}

export default function BlockPalette({ blocks, isMobile = false }: BlockPaletteProps) {
  return (
    <div className={cn(
      "flex items-center justify-center",
      isMobile ? "flex-row gap-6" : "flex-col gap-12"
    )}>
      {blocks.map((block) => (
        <div key={block.id} className={cn(
          "relative flex items-center justify-center",
          isMobile ? "w-20 h-20" : "w-32 h-32"
        )}>
          <DraggableBlock block={block} isMobile={isMobile} />
        </div>
      ))}
    </div>
  );
}

function DraggableBlock({ block, isMobile }: { block: Block, isMobile: boolean }) {
  const blockRef = React.useRef<HTMLDivElement>(null);

  // For mobile, we want the block to hover above the finger so it's not hidden.
  // We use dragElastic and whileDrag scale, but framer-motion drag constraints 
  // handle the pointer offset natively if we configure it right.
  // An alternative is an invisible drag handle, but scaling up heavily works well.
  const dragScale = isMobile ? 2.0 : 1.5;

  return (
    <motion.div
      ref={blockRef}
      drag
      dragSnapToOrigin
      whileDrag={{ 
        scale: dragScale, 
        zIndex: 100,
        // Lift the block up slightly on mobile when dragging
        y: isMobile ? -50 : 0 
      }}
      onDragEnd={(event, info) => {
        if (!blockRef.current) return;
        const rect = blockRef.current.getBoundingClientRect();
        // Emit custom event for GameBoard to handle
        const dropEvent = new CustomEvent('blockDrop', { 
          detail: { 
            block, 
            rect 
          } 
        });
        window.dispatchEvent(dropEvent);
      }}
      className="grid gap-1 cursor-grab active:cursor-grabbing touch-none"
      style={{
        // Make blocks slightly smaller on mobile palette
        gridTemplateColumns: `repeat(${block.shape[0].length}, ${isMobile ? 16 : 24}px)`,
        gridTemplateRows: `repeat(${block.shape.length}, ${isMobile ? 16 : 24}px)`,
      }}
    >
      {block.shape.map((row, r) => (
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className="w-full h-full rounded-sm"
            style={{ 
              backgroundColor: cell === 1 ? block.color : 'transparent',
              boxShadow: cell === 1 ? `0 4px 10px ${block.color}44` : 'none',
              border: cell === 1 ? '1px solid rgba(255,255,255,0.3)' : 'none'
            }}
          />
        ))
      ))}
    </motion.div>
  );
}
