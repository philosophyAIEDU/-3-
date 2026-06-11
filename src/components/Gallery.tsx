import React from 'react';
import { useAppState } from '../store';

export const Gallery: React.FC = () => {
    const { state } = useAppState();

    return (
        <section className="px-6 md:px-margin-desktop py-stack-lg border-b-2 border-outline bg-background" id="portfolio-gallery">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-outline pb-8">
            <div>
                <h2 className="font-headline-md text-[2.5rem] text-on-surface mb-2 tracking-tighter uppercase font-bold">시그니처 컬렉션</h2>
                <p className="font-body-md text-on-surface font-bold">자연의 물리적 법칙을 넘어서는 질감의 조화.</p>
            </div>
            <div className="flex gap-4 mt-6 md:mt-0">
                <button className="text-secondary font-label-caps text-label-caps flex items-center gap-2 hover:opacity-80 transition-opacity font-bold">
                <span>View All</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </button>
            </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-2 border-outline" id="gallery-grid">
                {state.portfolio.map((item, index) => (
                    <article key={item.id} className="group relative aspect-[3/4] overflow-hidden border-b-2 md:border-b-0 md:border-r-2 last:border-r-0 border-outline cursor-pointer bg-surface">
                        <img 
                            src={item.imageUrl} 
                            alt={item.altText} 
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                            crossOrigin="anonymous"
                            referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-90 transition-opacity flex flex-col justify-between p-8">
                            <span className="font-headline-md text-[4rem] text-outline opacity-30 leading-none">
                                {index + 1 < 10 ? `0${index + 1}` : index + 1}
                            </span>
                            <div>
                                <h3 className="font-display-lg text-[2rem] text-on-surface leading-tight mb-2 uppercase font-bold">{item.title}</h3>
                                <p className="font-body-md text-on-surface border-t-2 border-outline pt-2 font-bold">
                                    {item.altText}
                                </p>
                            </div>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    )
}
