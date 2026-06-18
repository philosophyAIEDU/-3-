import React from 'react';
import { useAppState } from '../store';

export const Gallery: React.FC = () => {
  const { state } = useAppState();

  return (
    <section className="px-6 md:px-margin-desktop py-stack-lg border-b-2 border-outline bg-background" id="portfolio-gallery">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-outline pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-outline">restaurant</span>
            <span className="font-label-caps text-label-caps text-outline uppercase font-bold tracking-widest border-b border-outline/30 pb-0.5">Signature Dishes</span>
          </div>
          <h2 className="font-headline-md text-[2.5rem] text-on-surface mb-2 tracking-tighter uppercase font-bold">
            시그니처 컬렉션
          </h2>
          <p className="font-body-md text-on-surface font-semibold">
            셰프 강민우가 엄선하여 조리한 요리 예술과 미학적 플레이팅 컬렉션입니다.
          </p>
        </div>
        
        <div className="flex gap-4 mt-6 md:mt-0">
          <span className="font-label-caps text-xs uppercase text-outline opacity-60 font-bold">
            TOTAL DISHES: {state.portfolio.length}
          </span>
        </div>
      </div>

      {/* Grid of Dishes */}
      {state.portfolio.length === 0 ? (
        <div className="border-4 border-outline p-16 text-center bg-surface">
          <span className="material-symbols-outlined text-5xl text-outline opacity-50 mb-4 animate-spin">progress_activity</span>
          <p className="font-label-caps text-label-caps uppercase tracking-widest font-bold">포트폴리오 요리를 동기화하는 중...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="gallery-grid">
          {state.portfolio.map((item, index) => (
            <article 
              key={item.id} 
              className="group border-4 border-outline bg-surface p-4 flex flex-col justify-between shadow-[6px_6px_0px_0px_#1A1A1A] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_#1A1A1A] transition-all duration-300 bg-surface"
            >
              <div>
                {/* Image Frame */}
                <div className="relative aspect-[4/3] overflow-hidden border-2 border-outline bg-background mb-4">
                  <img 
                    src={item.imageUrl} 
                    alt={item.altText} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    crossOrigin="anonymous"
                    referrerPolicy="no-referrer"
                  />
                  {/* Serial Number Badge */}
                  <div className="absolute top-2 left-2 bg-outline text-background font-display-lg px-3 py-1 text-sm italic border-2 border-background">
                    {index + 1 < 10 ? `0${index + 1}` : index + 1}
                  </div>
                </div>

                {/* Text Content */}
                <h3 className="font-display-lg text-2xl text-on-surface leading-tight mb-3 uppercase font-bold group-hover:text-secondary transition-colors duration-200">
                  {item.title}
                </h3>
              </div>

              <div>
                <p className="font-body-md text-on-surface/90 border-t-2 border-outline border-dashed pt-3 pb-2 text-sm font-semibold leading-relaxed">
                  {item.altText}
                </p>
                {/* Visual indicator of high-end gastronomy */}
                <div className="flex justify-between items-center text-[10px] font-label-caps text-outline opacity-60 mt-2">
                  <span>CULINARY ART</span>
                  <span>EPICUREAN LAB</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
