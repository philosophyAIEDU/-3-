import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section id="hero" className="min-h-screen flex items-center pt-28 pb-16 px-6 md:px-margin-desktop relative overflow-hidden border-b-2 border-outline bg-background">
      {/* Brutalist Grid Background Pattern */}
      <div className="absolute inset-0 z-0" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--color-surface-dim) 0, var(--color-surface-dim) 1px, transparent 1px, transparent 20px)' }}></div>

      <div className="relative z-10 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left: Chef Information */}
        <div className="lg:col-span-7 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 border-2 border-outline bg-surface mb-6 font-bold">
            <span className="w-3 h-3 bg-secondary animate-pulse"></span>
            <span className="font-label-caps text-xs uppercase tracking-[0.2em] text-on-surface">Owner Chef: Minwoo Kang</span>
          </div>
          
          <h1 className="font-display-xl text-[3.5rem] md:text-[5.5rem] leading-[1.0] text-on-surface tracking-tighter mb-8 font-normal uppercase">
            현대 요리 미학과<br/>
            <span className="text-secondary italic">현대 요리 과학</span>
          </h1>
          
          <p className="font-body-lg text-lg md:text-xl text-on-surface font-semibold max-w-2xl mb-12 leading-relaxed">
            전통 한식의 깊은 발효 맛 위에 현대 조리 과학의 혁신을 조화롭게 얹어냅니다. 
            식재료 본연의 성질을 온전히 이해하고, 새로운 질감과 온도를 선보여 접시 위에 하나의 현대 예술적 캔버스를 펼칩니다.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#portfolio-gallery" className="px-8 py-4 bg-outline text-background font-label-caps text-sm font-bold tracking-widest hover:bg-secondary hover:text-white transition-all flex items-center justify-center gap-2 uppercase border-2 border-transparent">
              <span>시그니처 메뉴 보기</span>
              <span className="material-symbols-outlined text-[18px]">restaurant</span>
            </a>
            <a href="#ai-control-panel" className="px-8 py-4 border-2 border-outline text-on-surface font-label-caps text-sm font-bold tracking-widest hover:bg-outline hover:text-background transition-all flex items-center justify-center gap-2 uppercase">
              <span>AI 플레이팅 연구실</span>
              <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            </a>
          </div>
        </div>

        {/* Right: Chef Portrait Image in Brutalist Frame */}
        <div className="lg:col-span-5 relative w-full flex justify-center">
          <div className="relative w-full max-w-[420px] aspect-[4/5] border-4 border-outline bg-surface overflow-hidden shadow-[8px_8px_0px_0px_#1A1A1A]">
            <img 
              src="/images/chef_portrait.png" 
              alt="Chef Minwoo Kang" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700"
            />
            {/* Overlay Info bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-outline text-background p-4 flex justify-between items-center border-t-2 border-outline">
              <div>
                <p className="font-display-lg text-lg text-background italic">Minwoo Kang</p>
                <p className="font-label-caps text-[9px] uppercase tracking-wider text-background/80">Executive Chef</p>
              </div>
              <div className="flex items-center gap-2 bg-secondary text-background px-3 py-1 font-bold text-xs uppercase tracking-wider">
                ACTIVE LAB
              </div>
            </div>
          </div>
          
          {/* Decorative Brutalist Elements */}
          <div className="absolute -top-4 -right-4 w-12 h-12 border-2 border-outline border-dashed -z-10"></div>
          <div className="absolute -bottom-4 -left-4 w-24 h-8 border-2 border-outline bg-surface-dim -z-10"></div>
        </div>

      </div>
      
      {/* Scroll indicator widget */}
      <div className="absolute bottom-12 left-6 md:left-margin-desktop border-2 border-outline p-4 bg-surface max-w-[200px] hidden md:block">
        <p className="font-label-caps text-[10px] uppercase font-bold tracking-widest text-on-surface mb-2 border-b-2 border-outline pb-2">Gastronomy Status</p>
        <div className="flex gap-1 h-3 mt-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`flex-1 bg-secondary ${i%2===0 ? 'opacity-100 animate-pulse' : 'opacity-40'}`}></div>
          ))}
        </div>
      </div>
    </section>
  );
};
