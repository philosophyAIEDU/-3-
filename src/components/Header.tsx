import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="fixed w-full top-0 z-40 bg-surface border-b-2 border-outline px-6 md:px-margin-desktop h-20 flex items-center justify-between">
            <div className="font-display-lg text-2xl tracking-tight text-on-surface">셰프의 캔버스 <span className="text-secondary italic text-lg ml-2 border-l-2 border-outline/30 pl-2">Epicurean Lab</span></div>
            <nav className="hidden md:flex gap-8 font-label-caps tracking-widest uppercase font-bold text-on-surface">
                <a href="#hero" className="hover:text-secondary hover:underline transition-colors">Lab Core</a>
                <a href="#portfolio-gallery" className="hover:text-secondary hover:underline transition-colors">Collections</a>
                <a href="#ai-control-panel" className="text-secondary flex items-center gap-1 hover:underline"><span className="material-symbols-outlined text-[14px]">auto_awesome</span> Neural Engine</a>
                <a href="#guestbook-container" className="hover:text-secondary hover:underline transition-colors">Guestbook</a>
            </nav>
            <button className="md:hidden text-on-surface border-2 border-outline p-1 font-bold">
                <span className="material-symbols-outlined">menu</span>
            </button>
        </header>
    )
};
