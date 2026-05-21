/**
 * Zen Matrix - Core Game Engine
 */

export type CellState = 'empty' | 'filled' | 'void';

export interface Block {
  id: string;
  shape: number[][]; // 2D array representing the shape (1 = block, 0 = empty)
  color: string;
}

export const BLOCK_SHAPES: Record<string, number[][]> = {
  single: [[1]],
  line2: [[1, 1]],
  line2v: [[1], [1]],
  line3: [[1, 1, 1]],
  line3v: [[1], [1], [1]],
  square2: [[1, 1], [1, 1]],
  L2: [[1, 0], [1, 1]],
  L3: [[1, 0, 0], [1, 0, 0], [1, 1, 1]],
  T3: [[1, 1, 1], [0, 1, 0]],
  I4: [[1, 1, 1, 1]],
};

export const BLOCK_COLORS = [
  '#3b82f6', // blue
  '#6366f1', // indigo
  '#a855f7', // purple
  '#ec4899', // pink
  '#ef4444', // red
  '#f59e0b', // amber
  '#10b981', // emerald
  '#06b6d4', // cyan
];

export function getRandomBlock(): Block {
  const keys = Object.keys(BLOCK_SHAPES);
  const key = keys[Math.floor(Math.random() * keys.length)];
  const color = BLOCK_COLORS[Math.floor(Math.random() * BLOCK_COLORS.length)];
  return {
    id: Math.random().toString(36).substring(7),
    shape: BLOCK_SHAPES[key],
    color,
  };
}

export function canPlaceBlock(
  board: CellState[][],
  block: Block,
  row: number,
  col: number
): boolean {
  for (let r = 0; row + r < board.length && r < block.shape.length; r++) {
    for (let c = 0; col + c < board[0].length && c < block.shape[r].length; c++) {
      if (block.shape[r][c] === 1) {
        const targetRow = row + r;
        const targetCol = col + c;

        // Out of bounds
        if (targetRow >= board.length || targetCol >= board[0].length) return false;
        
        // Target is not active (void) or already filled
        if (board[targetRow][targetCol] !== 'empty') return false;
      }
    }
    // Handle shape parts that might be out of bounds if not checked above
    if (row + block.shape.length > board.length || col + block.shape[0].length > board[0].length) {
       // Re-check for strict bounds on all 1s
       for (let r = 0; r < block.shape.length; r++) {
          for (let c = 0; c < block.shape[r].length; c++) {
            if (block.shape[r][c] === 1) {
              if (row + r >= board.length || col + c >= board[0].length) return false;
            }
          }
       }
    }
  }
  return true;
}

export function checkClearLines(board: CellState[][]): { newBoard: CellState[][]; clearedCount: number } {
  const rowsToClear: number[] = [];
  const colsToClear: number[] = [];
  const rows = board.length;
  const cols = board[0].length;

  // Check rows
  for (let r = 0; r < rows; r++) {
    let full = true;
    let hasActive = false;
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 'empty') {
        full = false;
        break;
      }
      if (board[r][c] === 'filled') hasActive = true;
    }
    if (full && hasActive) rowsToClear.push(r);
  }

  // Check columns
  for (let c = 0; c < cols; c++) {
    let full = true;
    let hasActive = false;
    for (let r = 0; r < rows; r++) {
      if (board[r][c] === 'empty') {
        full = false;
        break;
      }
      if (board[r][c] === 'filled') hasActive = true;
    }
    if (full && hasActive) colsToClear.push(c);
  }

  if (rowsToClear.length === 0 && colsToClear.length === 0) {
    return { newBoard: board, clearedCount: 0 };
  }

  const newBoard = board.map((row) => [...row]);
  
  rowsToClear.forEach((r) => {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c] === 'filled') newBoard[r][c] = 'empty';
    }
  });

  colsToClear.forEach((c) => {
    for (let r = 0; r < rows; r++) {
      if (newBoard[r][c] === 'filled') newBoard[r][c] = 'empty';
    }
  });

  return { newBoard, clearedCount: rowsToClear.length + colsToClear.length };
}

export function isGameOver(board: CellState[][], availableBlocks: Block[]): boolean {
  if (availableBlocks.length === 0) return false;
  
  for (const block of availableBlocks) {
    for (let r = 0; r < board.length; r++) {
      for (let c = 0; c < board[0].length; c++) {
        if (canPlaceBlock(board, block, r, c)) {
          return false;
        }
      }
    }
  }
  return true;
}
