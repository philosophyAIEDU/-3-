import React from 'react';
import { useAppState } from '../store';


interface TimelineItem {
  period: string;
  role: string;
  organization: string;
  description: string;
}

const TIMELINE_DATA: TimelineItem[] = [
  {
    period: "2025 - PRESENT",
    role: "Owner Chef & Founder",
    organization: "Epicurean Lab (에피큐리언 랩, 서울)",
    description: "파인다이닝 조리 기법과 AI 융합 플레이팅 기술을 연구하며, 계절 식재료를 재해석한 100% 예약제 프라이빗 파인다이닝 코스를 개발 및 운영하고 있습니다."
  },
  {
    period: "2022 - 2024",
    role: "Junior Sous Chef",
    organization: "Mingles (밍글스, 미슐랭 2스타, 서울)",
    description: "모던 코리안 퀴진의 조리 프로세스를 관리하고 계절별 신메뉴 개발 팀의 핵심 인원으로 활동하였습니다."
  },
  {
    period: "2020 - 2022",
    role: "Chef de Partie (Saucier)",
    organization: "L'Atelier de Joël Robuchon (미슐랭 2스타, 파리)",
    description: "클래식 프렌치 퀴진의 핵심인 소스 파트를 전담하며 미슐랭 스타 다이닝에 부합하는 정밀하고 일관된 플레이팅 노하우를 터득했습니다."
  },
  {
    period: "2018 - 2020",
    role: "Culinary Arts Degree",
    organization: "Institut Paul Bocuse (폴 보퀴즈 요리학교, 프랑스)",
    description: "세계 최고의 요리 명문 기관에서 정통 프렌치 클래식 퀴진과 현대 과학적 조리 이론 및 실습 과정을 우수 졸업하였습니다."
  },
  {
    period: "2017",
    role: "Gold Medal (라이브 쿠킹 부문)",
    organization: "WACS 세계요리경연대회 (국제 조리사 연맹)",
    description: "한국 특산품인 '들기름'과 '간장' 에멀전을 활용한 생선 요리로 심사위원 만장일치 금메달을 획득하였습니다."
  }
];

export const Career: React.FC = () => {
  const { state } = useAppState();
  const chefName = state.currentUser?.displayName || '강민우 (Minwoo Kang)';

  return (

    <section className="px-6 md:px-margin-desktop py-stack-lg max-w-7xl mx-auto border-b-2 border-outline bg-background" id="chef-career">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        
        {/* Left Side: Chef Philosophy (Sticky on Desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-28 lg:h-fit">
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-outline">restaurant_menu</span>
            <span className="font-label-caps text-label-caps text-outline uppercase font-bold tracking-widest border-b-2 border-outline pb-1">Culinary Philosophy</span>
          </div>
          <h2 className="font-display-lg text-[3rem] text-on-surface mb-6 leading-tight uppercase">
            전통의 깊이에<br />
            <span className="text-secondary italic">현대의 감각</span>을 얹다
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface mb-8 leading-relaxed font-bold">
            한국 전통 요리의 오랜 지혜인 발효와 숙성, 그리고 제철 식재료에 대한 존중을 기본으로 삼습니다. 
            여기에 과학적인 조리 기법을 접목해 식재료 본연의 맛과 현대적인 질감을 극대화하여, 
            접시 위에서 단순한 미각을 넘어 온몸의 감각이 일깨워지는 다이닝을 실천합니다.
          </p>
          
          <div className="border-4 border-outline bg-surface p-6 relative">
            <div className="absolute top-0 right-0 bg-outline text-surface font-label-caps text-xs px-2 py-1 font-bold">ABOUT CHEF</div>
            <div className="space-y-3 font-body-md text-on-surface font-semibold">
              <p className="flex justify-between border-b border-outline/20 pb-2">
                <span>이름</span>
                <span>{chefName}</span>
              </p>
              <p className="flex justify-between border-b border-outline/20 pb-2">
                <span>전문 분야</span>
                <span>컨템포러리 코리안 & 현대 요리 과학</span>
              </p>
              <p className="flex justify-between">
                <span>활동 지역</span>
                <span>서울, 대한민국</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Side: Timeline */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6 lg:mb-10">
            <span className="material-symbols-outlined text-outline">timeline</span>
            <span className="font-label-caps text-label-caps text-outline uppercase font-bold tracking-widest border-b-2 border-outline pb-1">Professional Experience</span>
          </div>
          
          <div className="border-2 border-outline divide-y-2 divide-outline">
            {TIMELINE_DATA.map((item, index) => (
              <div 
                key={index} 
                className="p-8 hover:bg-surface transition-colors duration-300 relative group overflow-hidden"
              >
                {/* Background Pattern on Hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none" 
                     style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--color-outline) 0, var(--color-outline) 1px, transparent 1px, transparent 10px)' }}></div>
                
                <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-8 relative z-10">
                  <div className="font-display-lg text-xl text-secondary md:w-32 flex-shrink-0 font-bold uppercase tracking-wider">
                    {item.period}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-display-lg text-2xl text-on-surface mb-1 uppercase font-bold">
                      {item.role}
                    </h3>
                    <p className="font-label-caps text-xs uppercase tracking-wider text-outline opacity-70 mb-4 font-bold">
                      {item.organization}
                    </p>
                    <p className="font-body-md text-on-surface/80 leading-relaxed font-semibold">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
