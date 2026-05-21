'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CellState, Block, getRandomBlock, checkClearLines, isGameOver, canPlaceBlock } from '@/lib/games/zen-matrix/engine';
import MapEditor from './MapEditor';
import GameBoard from './GameBoard';
import BlockPalette from './BlockPalette';

type GameMode = 'edit' | 'play';

export default function ZenMatrixContainer() {
  const [mode, setMode] = useState<GameMode>('edit');
  const [gridSize, setGridSize] = useState(10);
  const [board, setBoard] = useState<CellState[][]>([]);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [availableBlocks, setAvailableBlocks] = useState<Block[]>([]);
  const [isGameOverState, setIsGameOverState] = useState(false);

  // Initialize board
  const initBoard = useCallback((size: number) => {
    const newBoard = Array(size).fill(null).map(() => Array(size).fill('empty'));
    setBoard(newBoard);
    setScore(0);
    setIsGameOverState(false);
    setAvailableBlocks([getRandomBlock(), getRandomBlock(), getRandomBlock()]);
  }, []);

  useEffect(() => {
    initBoard(gridSize);
    const savedHighScore = localStorage.getItem(`zen-matrix-highscore-${gridSize}`);
    if (savedHighScore) setHighScore(parseInt(savedHighScore));
  }, [gridSize, initBoard]);

  const toggleCell = (r: number, c: number) => {
    if (mode !== 'edit') return;
    const newBoard = board.map((row, ri) => 
      row.map((cell, ci) => {
        if (ri === r && ci === c) {
          return cell === 'empty' ? 'void' : 'empty';
        }
        return cell;
      })
    );
    setBoard(newBoard);
  };

  const startPlay = () => {
    setMode('play');
    setScore(0);
    setIsGameOverState(false);
    setAvailableBlocks([getRandomBlock(), getRandomBlock(), getRandomBlock()]);
    // Reset any 'filled' cells to 'empty' if they were somehow there
    const cleanBoard = board.map(row => row.map(cell => cell === 'filled' ? 'empty' : cell));
    setBoard(cleanBoard);
  };

  const handlePlaceBlock = (block: Block, r: number, c: number) => {
    if (mode !== 'play' || isGameOverState) return;
    
    if (!canPlaceBlock(board, block, r, c)) return;

    // Place block
    const newBoard = board.map(row => [...row]);
    for (let br = 0; br < block.shape.length; br++) {
      for (let bc = 0; bc < block.shape[br].length; bc++) {
        if (block.shape[br][bc] === 1) {
          newBoard[r + br][c + bc] = 'filled';
        }
      }
    }

    // Check lines
    const { newBoard: clearedBoard, clearedCount } = checkClearLines(newBoard);
    
    // Update score (simple logic)
    const blockScore = block.shape.flat().filter(v => v === 1).length * 10;
    const lineScore = clearedCount * 100;
    const newScore = score + blockScore + lineScore;
    
    setScore(newScore);
    if (newScore > highScore) {
      setHighScore(newScore);
      localStorage.setItem(`zen-matrix-highscore-${gridSize}`, newScore.toString());
    }

    setBoard(clearedBoard);

    // Remove used block
    const newAvailable = availableBlocks.filter(b => b.id !== block.id);
    
    if (newAvailable.length === 0) {
      setAvailableBlocks([getRandomBlock(), getRandomBlock(), getRandomBlock()]);
    } else {
      setAvailableBlocks(newAvailable);
      // Check game over with updated blocks
      if (isGameOver(clearedBoard, newAvailable)) {
        setIsGameOverState(true);
      }
    }
  };

  return (
    <div className="space-y-12">
      {/* Game Header / Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 rounded-[2rem] border border-blue-100 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-8">
          <div>
            <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1">Canvas Size</p>
            <div className="flex items-center gap-4">
              <input 
                type="range" min="6" max="15" value={gridSize} 
                onChange={(e) => setGridSize(parseInt(e.target.value))}
                disabled={mode === 'play'}
                className="accent-blue-500 w-32"
              />
              <span className="text-xl font-black text-slate-900 w-16 tabular-nums">{gridSize}x{gridSize}</span>
            </div>
          </div>
          
          <div className="h-12 w-px bg-slate-100 hidden md:block" />
          
          <div>
            <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">Score</p>
            <p className="text-2xl font-black text-slate-900 tabular-nums">{score.toLocaleString()}</p>
          </div>
          
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Best</p>
            <p className="text-2xl font-black text-slate-400 tabular-nums">{highScore.toLocaleString()}</p>
          </div>
        </div>

        <div className="flex gap-4">
          {mode === 'edit' ? (
            <button 
              onClick={startPlay}
              className="rounded-full bg-blue-600 px-10 py-3 font-black text-white uppercase transition-all hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-500/20"
            >
              Start Game
            </button>
          ) : (
            <button 
              onClick={() => setMode('edit')}
              className="rounded-full border border-slate-200 bg-white px-10 py-3 font-black text-slate-900 uppercase transition-all hover:bg-slate-50"
            >
              Back to Editor
            </button>
          )}
          <button 
            onClick={() => initBoard(gridSize)}
            className="rounded-full border border-slate-200 bg-white px-6 py-3 text-xs font-black text-slate-400 uppercase transition-all hover:text-slate-900 hover:border-slate-300"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Play Area */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-12 items-start relative">
        <div className="lg:col-span-2 flex justify-center w-full pb-32 lg:pb-0">
          {mode === 'edit' ? (
            <MapEditor board={board} onToggle={toggleCell} />
          ) : (
            <div className="relative w-full">
              <GameBoard 
                board={board} 
                onPlace={handlePlaceBlock} 
                activeBlocks={availableBlocks}
              />
              {isGameOverState && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-xl border border-red-100 animate-in fade-in zoom-in duration-500">
                  <div className="text-center">
                    <h2 className="text-6xl font-black text-red-600 tracking-tighter mb-4">GAME OVER</h2>
                    <p className="text-xl font-bold text-slate-900 mb-8">Score: {score.toLocaleString()}</p>
                    <button 
                      onClick={() => startPlay()}
                      className="rounded-full bg-slate-900 text-white px-12 py-4 font-black uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="space-y-8 w-full">
          <div className="hidden lg:block rounded-[2rem] border border-blue-100 bg-white p-8 shadow-sm">
            <h3 className="text-xs font-black tracking-[0.4em] text-slate-400 uppercase mb-8">
              {mode === 'edit' ? 'Editor Instructions' : 'Next Blocks'}
            </h3>
            {mode === 'edit' ? (
              <div className="space-y-4 text-sm font-medium text-slate-500 leading-relaxed">
                <p>1. スライダーでベースの盤面サイズを決定。</p>
                <p>2. マスをクリックして「穴（Void）」を作成。</p>
                <p>3. 独自のマップが完成したら Start を押す。</p>
                <div className="pt-4 border-t border-slate-100 text-[10px] uppercase tracking-wider">
                  Tip: 穴を増やすほどライン消去が難しくなります。
                </div>
              </div>
            ) : (
              <BlockPalette blocks={availableBlocks} />
            )}
          </div>

          {/* Mobile Sticky Palette */}
          {mode === 'play' && (
            <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-t border-slate-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
              <BlockPalette blocks={availableBlocks} isMobile={true} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
