'use client';

import React, { useRef, useEffect } from 'react';
import { CellState, Block } from '@/lib/games/zen-matrix/engine';
import { cn } from '@/lib/utils';

interface GameBoardProps {
  board: CellState[][];
  onPlace: (block: Block, r: number, c: number) => void;
  activeBlocks: Block[];
}

export default function GameBoard({ board, onPlace }: GameBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleDrop = (e: any) => {
      if (!boardRef.current) return;
      const { block, rect: blockRect } = e.detail;
      
      const boardRect = boardRef.current.getBoundingClientRect();
      const cellSize = boardRect.width / board[0].length;

      // Determine scale based on window width (rough mobile check matching our CSS breakpoint)
      const isMobile = window.innerWidth < 1024;
      
      // Base cell sizes in the palette
      const baseCellSize = isMobile ? 16 : 24;
      const dragScale = isMobile ? 2.0 : 1.5;
      
      const scaledCellSize = baseCellSize * dragScale;

      const anchorX = blockRect.left + (scaledCellSize / 2);
      const anchorY = blockRect.top + (scaledCellSize / 2);

      const x = anchorX - boardRect.left;
      const y = anchorY - boardRect.top;

      // Check if the top-left anchor is within the board bounds
      if (x < 0 || x > boardRect.width || y < 0 || y > boardRect.height) return;

      const col = Math.floor(x / cellSize);
      const row = Math.floor(y / cellSize);

      onPlace(block, row, col);
    };

    window.addEventListener('blockDrop', handleDrop);
    return () => window.removeEventListener('blockDrop', handleDrop);
  }, [board, onPlace]);

  return (
    <div 
      ref={boardRef}
      className="grid gap-1 p-4 bg-white rounded-2xl border border-blue-100 shadow-xl"
      style={{ 
        gridTemplateColumns: `repeat(${board[0]?.length || 0}, minmax(0, 1fr))`,
        width: '100%',
        aspectRatio: '1 / 1'
      }}
    >
      {board.map((row, r) => (
        row.map((cell, c) => (
          <div
            key={`${r}-${c}`}
            className={cn(
              "w-full h-full rounded-sm transition-all duration-300",
              cell === 'empty' ? "bg-slate-50 border border-slate-100" :
              cell === 'filled' ? "bg-blue-500 border border-blue-400 shadow-[0_4px_10px_rgba(59,130,246,0.3)]" :
              "bg-transparent opacity-5" // void
            )}
          >
            {cell === 'filled' && (
               <div className="w-full h-full bg-gradient-to-br from-white/30 to-transparent" />
            )}
          </div>
        ))
      ))}
    </div>
  );
}
