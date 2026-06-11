import React from 'react';

export const Hero: React.FC = () => {
    return (
        <section id="hero" className="min-h-screen flex items-center justify-center pt-20 px-6 md:px-margin-desktop relative overflow-hidden border-b-2 border-outline bg-background">
            <div className="absolute inset-0 z-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--color-surface-dim) 0, var(--color-surface-dim) 1px, transparent 1px, transparent 20px)' }}></div>

            <div className="relative z-10 max-w-4xl text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-outline bg-surface mb-8 font-bold">
                    <span className="w-3 h-3 bg-secondary"></span>
                    <span className="font-label-caps text-xs uppercase tracking-[0.2em] text-on-surface">Model: gemini-3.1-flash-image</span>
                </div>
                <h1 className="font-display-xl text-[4rem] md:text-[6rem] leading-[0.9] text-on-surface tracking-tighter mb-8 font-normal uppercase">분자 미식의 <br/><span className="text-secondary italic">재해석</span></h1>
                <p className="font-body-lg text-xl md:text-2xl text-on-surface font-medium max-w-2xl mx-auto mb-12 leading-relaxed">
                    AI 기반 레시피 파라미터를 통해 식감, 온도, 분자 구조를 통제하는 최첨단 실험실. 미각의 경계를 코드로 다시 씁니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <a href="#ai-control-panel" className="px-8 py-4 bg-outline text-background font-label-caps text-sm font-bold tracking-widest hover:bg-secondary transition-all flex items-center gap-2 uppercase">
                        <span>실험실 진입</span>
                        <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                    </a>
                </div>
            </div>
            
            <div className="absolute bottom-12 left-6 md:left-margin-desktop border-2 border-outline p-4 bg-surface max-w-[200px]">
                <p className="font-label-caps text-[10px] uppercase font-bold tracking-widest text-on-surface mb-2 border-b-2 border-outline pb-2">Systems Online</p>
                <div className="flex gap-1 h-3 mt-2">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className={`flex-1 bg-secondary ${i%2===0 ? 'opacity-100 animate-pulse' : 'opacity-40'}`}></div>
                    ))}
                </div>
            </div>
        </section>
    );
};
