/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppStateProvider, useAppState } from './store';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { Career } from './components/Career';
import { Gallery } from './components/Gallery';
import { AIStudio } from './components/AIStudio';
import { Guestbook } from './components/Guestbook';
import { Footer } from './components/Footer';

function MainAppContent() {
  const { state, loginWithGoogle } = useAppState();

  if (state.authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-on-background">
        <div className="flex flex-col items-center gap-4">
          <span className="material-symbols-outlined animate-spin text-5xl text-secondary">progress_activity</span>
          <p className="font-label-caps text-label-caps uppercase tracking-widest font-bold">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!state.currentUser) {
    return (
      <div className="min-h-screen relative flex flex-col justify-between bg-background text-on-background overflow-hidden">
        {/* Brutalist Grid Background Pattern */}
        <div className="absolute inset-0 z-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--color-surface-dim) 0, var(--color-surface-dim) 1px, transparent 1px, transparent 20px)' }}></div>
        
        {/* Header (Minimal) */}
        <header className="relative z-10 w-full h-20 border-b-2 border-outline px-6 md:px-margin-desktop flex items-center bg-surface justify-between">
          <div className="font-display-lg text-2xl tracking-tight text-on-surface uppercase font-bold">
            Chef Portfolio <span className="text-secondary italic text-base ml-2">Builder</span>
          </div>
        </header>

        {/* Hero Sign In Content */}
        <main className="relative z-10 flex-grow flex items-center justify-center px-6 py-12">
          <div className="max-w-xl w-full border-4 border-outline bg-surface p-8 md:p-12 relative shadow-[10px_10px_0px_0px_#1A1A1A]">
            <div className="absolute -top-4 left-6 bg-secondary text-background font-label-caps text-xs px-3 py-1 font-bold border-2 border-outline">
              WELCOME CHEF
            </div>
            
            <div className="text-center space-y-6 mt-4">
              <span className="material-symbols-outlined text-6xl text-outline mb-2">restaurant_menu</span>
              
              <h2 className="font-display-lg text-3xl md:text-4xl text-on-surface uppercase leading-tight font-bold">
                나만의 요리사 포트폴리오를 구성해보세요
              </h2>
              
              <p className="font-body-md text-sm md:text-base text-on-surface/80 leading-relaxed font-semibold">
                전통 파인다이닝 플레이팅부터 AI 시뮬레이터를 활용한 모던 요리 기법 구상까지, 
                한 곳에서 관리하고 공유하는 미식 캔버스를 지금 시작해 보세요.
              </p>

              <div className="border-t-2 border-dashed border-outline/30 pt-6">
                <button
                  onClick={loginWithGoogle}
                  className="w-full py-4 bg-outline text-background font-label-caps text-sm font-bold tracking-widest hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-3 uppercase border-2 border-transparent cursor-pointer"
                >
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google 계정으로 로그인</span>
                </button>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 w-full border-t-2 border-outline py-6 bg-surface text-center">
          <p className="font-label-caps text-xs text-outline/60 font-semibold tracking-wider">
            &copy; 2026 EPICUREAN LAB. ALL RIGHTS RESERVED.
          </p>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-body-md bg-background text-on-background scroll-smooth">
      <Header />
      <main>
        <Hero />
        <Career />
        <Gallery />
        <AIStudio />
        <Guestbook />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AppStateProvider>
      <MainAppContent />
    </AppStateProvider>
  );
}
