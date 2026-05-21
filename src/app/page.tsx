import React from 'react';
import ZenMatrixContainer from '@/components/features/games/zen-matrix/ZenMatrixContainer';

export default function Page() {
  return (
    <main className="min-h-screen bg-slate-50 py-20 md:py-32 selection:bg-blue-500/10 selection:text-blue-600">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="mb-16">
          <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-blue-200 bg-blue-50 px-4 py-2">
            <span className="text-[10px] font-black tracking-[0.3em] text-blue-600 uppercase">
              Arcade // Strategy
            </span>
          </div>

          <h1 className="mb-4 text-5xl leading-none font-black tracking-tighter text-slate-900 md:text-7xl uppercase">
            ZEN MATRIX
          </h1>
          <p className="max-w-2xl text-lg font-medium text-slate-500">
            グリッドを構築し、空間を最適化せよ。
            <br />
            限界まで広げた盤面で、あなたの生存戦略を証明する。
          </p>
        </div>

        <ZenMatrixContainer />
      </div>
    </main>
  );
}
