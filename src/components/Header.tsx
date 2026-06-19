import React, { useState } from 'react';
import { useAppState } from '../store';

export const Header: React.FC = () => {
  const { state, logout } = useAppState();
  const chefName = state.currentUser?.displayName || 'Minwoo Kang';
  const avatarUrl = state.currentUser?.photoURL || '';
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed w-full top-0 z-40 bg-surface border-b-2 border-outline px-6 md:px-margin-desktop h-20 flex items-center justify-between shadow-sm">
      <div className="font-display-lg text-2xl tracking-tight text-on-surface uppercase font-bold flex items-center gap-2">
        <span>{chefName}</span>
        <span className="text-secondary italic text-base hidden sm:inline border-l-2 border-outline/30 pl-2">Epicurean Lab</span>
      </div>
      
      {/* Navigation */}
      <nav className="hidden xl:flex gap-8 font-label-caps tracking-widest uppercase font-bold text-xs text-on-surface items-center">
        <a href="#hero" className="hover:text-secondary hover:underline transition-colors">Profile</a>
        <a href="#chef-career" className="hover:text-secondary hover:underline transition-colors">Career</a>
        <a href="#portfolio-gallery" className="hover:text-secondary hover:underline transition-colors">Signature Dishes</a>
        <a href="#ai-control-panel" className="text-secondary flex items-center gap-1 hover:underline">
          <span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Plating Lab
        </a>
        <a href="#guestbook-container" className="hover:text-secondary hover:underline transition-colors">Reviews</a>
      </nav>

      {/* User Actions */}
      <div className="flex items-center gap-4">
        {state.currentUser && (
          <div className="flex items-center gap-3 border-l-2 border-outline/20 pl-4">
            <div className="w-10 h-10 overflow-hidden border-2 border-outline bg-background flex-shrink-0">
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile" 
                  className="w-full h-full object-cover grayscale" 
                  crossOrigin="anonymous"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <span className="material-symbols-outlined text-outline flex items-center justify-center h-full">person</span>
              )}
            </div>
            <button
              onClick={logout}
              className="px-4 py-2 border-2 border-outline bg-background text-on-surface font-label-caps text-xs font-bold hover:bg-secondary hover:text-background hover:border-secondary transition-all cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        )}

        <button 
          onClick={() => setMenuOpen(!menuOpen)}
          className="xl:hidden text-on-surface border-2 border-outline p-1 font-bold flex items-center justify-center bg-background cursor-pointer"
        >
          <span className="material-symbols-outlined">{menuOpen ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile Drawer (brutalist style) */}
      {menuOpen && (
        <div className="absolute top-20 left-0 right-0 bg-surface border-b-4 border-outline p-6 flex flex-col gap-4 xl:hidden z-30 shadow-[0_4px_10px_rgba(0,0,0,0.15)] font-label-caps font-bold text-sm tracking-wider">
          <a href="#hero" onClick={() => setMenuOpen(false)} className="hover:text-secondary py-2 border-b border-outline/10">Profile</a>
          <a href="#chef-career" onClick={() => setMenuOpen(false)} className="hover:text-secondary py-2 border-b border-outline/10">Career</a>
          <a href="#portfolio-gallery" onClick={() => setMenuOpen(false)} className="hover:text-secondary py-2 border-b border-outline/10">Signature Dishes</a>
          <a href="#ai-control-panel" onClick={() => setMenuOpen(false)} className="text-secondary py-2 border-b border-outline/10 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Plating Lab
          </a>
          <a href="#guestbook-container" onClick={() => setMenuOpen(false)} className="hover:text-secondary py-2">Reviews</a>
        </div>
      )}
    </header>
  );
};
