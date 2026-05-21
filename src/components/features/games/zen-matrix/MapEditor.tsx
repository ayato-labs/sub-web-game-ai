'use client';

import React from 'react';
import { CellState } from '@/lib/games/zen-matrix/engine';
import { cn } from '@/lib/utils';

interface MapEditorProps {
  board: CellState[][];
  onToggle: (r: number, c: number) => void;
}

export default function MapEditor({ board, onToggle }: MapEditorProps) {
  return (
    <div 
      className="grid gap-1 p-4 bg-white/5 rounded-xl border border-white/10"
      style={{ 
        gridTemplateColumns: `repeat(${board[0]?.length || 0}, minmax(0, 1fr))`,
        width: '100%',
        aspectRatio: '1 / 1'
      }}
    >
      {board.map((row, r) => (
        row.map((cell, c) => (
          <button
            key={`${r}-${c}`}
            onClick={() => onToggle(r, c)}
            className={cn(
              "w-full h-full rounded-sm transition-all duration-200",
              cell === 'empty' 
                ? "bg-slate-50 hover:bg-blue-50 border border-slate-200" 
                : "bg-white border-none shadow-[inset_0_0_10px_rgba(0,0,0,0.05)]"
            )}
          >
            {cell === 'void' && (
              <div className="w-full h-full flex items-center justify-center text-[8px] text-slate-300">
                ✕
              </div>
            )}
          </button>
        ))
      ))}
    </div>
  );
}
