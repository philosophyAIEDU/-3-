import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="fixed w-full top-0 z-40 bg-surface border-b-2 border-outline px-6 md:px-margin-desktop h-20 flex items-center justify-between shadow-sm">
      <div className="font-display-lg text-2xl tracking-tight text-on-surface uppercase font-bold">
        Minwoo Kang 
        <span className="text-secondary italic text-base ml-2 border-l-2 border-outline/30 pl-2">Epicurean Lab</span>
      </div>
      
      <nav className="hidden xl:flex gap-8 font-label-caps tracking-widest uppercase font-bold text-xs text-on-surface">
        <a href="#hero" className="hover:text-secondary hover:underline transition-colors">Profile</a>
        <a href="#chef-career" className="hover:text-secondary hover:underline transition-colors">Career</a>
        <a href="#portfolio-gallery" className="hover:text-secondary hover:underline transition-colors">Signature Dishes</a>
        <a href="#ai-control-panel" className="text-secondary flex items-center gap-1 hover:underline">
          <span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Plating Lab
        </a>
        <a href="#guestbook-container" className="hover:text-secondary hover:underline transition-colors">Reviews</a>
      </nav>
      
      <button className="xl:hidden text-on-surface border-2 border-outline p-1 font-bold flex items-center justify-center bg-background">
        <span className="material-symbols-outlined">menu</span>
      </button>
    </header>
  );
};
