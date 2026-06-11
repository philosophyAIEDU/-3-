import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t-4 border-outline bg-surface py-12 px-6 md:px-margin-desktop mt-12">
            <div className="flex flex-col md:flex-row justify-between items-center text-on-surface">
                <div className="font-display-lg text-xl mb-4 md:mb-0 uppercase font-bold tracking-tighter">Epicurean Lab</div>
                <div className="font-label-caps text-[10px] uppercase font-bold tracking-widest text-center md:text-right border-l-2 border-outline pl-4">
                    © 2026 AI Gastronomy Studios. All rights reserved.<br/>
                    Powered by Gemini 3.1 Flash Image API
                </div>
            </div>
        </footer>
    );
};
