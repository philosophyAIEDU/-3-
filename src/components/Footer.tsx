import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t-4 border-outline bg-surface py-12 px-6 md:px-margin-desktop mt-12">
      <div className="flex flex-col md:flex-row justify-between items-center text-on-surface max-w-7xl mx-auto w-full">
        <div className="font-display-lg text-xl mb-4 md:mb-0 uppercase font-bold tracking-tighter">
          Chef Minwoo Kang | Epicurean Lab
        </div>
        <div className="font-label-caps text-[10px] uppercase font-bold tracking-widest text-center md:text-right border-l-0 md:border-l-2 border-outline pl-0 md:pl-4 mt-2 md:mt-0 opacity-80 leading-relaxed">
          © 2026 Chef Minwoo Kang. All rights reserved.<br/>
          Powered by Gemini Image Model (Nano Banana) & Firebase Firestore
        </div>
      </div>
    </footer>
  );
};
