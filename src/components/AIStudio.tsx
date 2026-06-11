import React, { useState } from 'react';
import { useAppState } from '../store';

export const AIStudio: React.FC = () => {
  const { state, setGeneratingAI, setAiImage, showToast } = useAppState();
  const [prompt, setPrompt] = useState<string>('');

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('생성할 요리 컨셉을 묘사해주세요.', true);
      return;
    }

    setGeneratingAI(true);
    showToast('뉴럴 미식 시뮬레이션을 시작합니다...', false);
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: `Culinary molecular gastronomy high-end plating: ${prompt}. Photorealistic, dark mood, exquisite lighting, highly detailed.` })
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiImage(data.imageUrl);
      showToast('결과 컨셉 렌더링 완료.');
    } catch (error: any) {
      console.error(error);
      showToast('시뮬레이션 실패. 네트워크나 키 설정을 확인해주세요.', true);
    } finally {
      setGeneratingAI(false);
    }
  };

  return (
    <section className="px-6 md:px-margin-desktop py-stack-lg max-w-7xl mx-auto border-b-2 border-outline bg-background" id="ai-control-panel">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-outline">memory</span>
            <span className="font-label-caps text-label-caps text-outline uppercase font-bold tracking-widest border-b-2 border-outline pb-1">Neural Gastronomy Lab</span>
          </div>
          <h2 className="font-display-lg text-[3rem] text-on-surface mb-6 leading-tight uppercase">상상 속의 요리를 시각화하다</h2>
          <p className="font-body-lg text-body-lg text-on-surface mb-10 leading-relaxed font-bold">
            Gemini 3.1 Flash Image 모델을 활용하여 실험적인 분자 미식 컨셉을 텍스트로부터 즉시 합성합니다. 새로운 질감, 불가능한 형태, 대담한 색상의 결합을 시도해보세요.
          </p>

          <div className="border-4 border-outline bg-surface p-6 relative">
            <div className="absolute top-0 right-0 bg-outline text-surface font-label-caps text-xs px-2 py-1 font-bold">INPUT REQUIRED</div>
            <label className="font-label-caps text-label-caps text-on-surface mb-3 block font-bold uppercase" htmlFor="prompt-input">
              AI 프롬프트 인풋
            </label>
            <div className="relative">
              <input 
                id="prompt-input"
                type="text" 
                className="w-full bg-background border-2 border-outline py-4 px-5 pl-12 text-on-surface font-body-md focus:border-secondary focus:outline-none transition-colors"
                placeholder="예: 액체 질소로 얼린 구형의 흑임자 무스..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={state.isGeneratingAI}
              />
              <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-outline">edit_note</span>
            </div>
            
            <div className="flex justify-end mt-6">
              <button 
                id="generate-btn" 
                onClick={handleGenerate}
                disabled={state.isGeneratingAI}
                className="flex items-center gap-2 bg-outline text-background px-8 py-3 font-label-caps text-label-caps hover:bg-secondary hover:text-background border-2 border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
              >
                {state.isGeneratingAI ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[18px]">progress_activity</span>
                    동기화 중...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    시뮬레이션 실행
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="relative aspect-square md:aspect-[4/3] border-4 border-outline bg-background flex items-center justify-center group overflow-hidden" id="ai-output-display">
          {state.isGeneratingAI ? (
             <div className="text-center p-8 absolute inset-0 flex flex-col items-center justify-center z-10 bg-surface" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--color-surface-dim) 0, var(--color-surface-dim) 10px, transparent 10px, transparent 20px)' }}>
                <div className="font-display-lg text-[2rem] text-secondary uppercase animate-pulse bg-background border-2 border-outline px-4 py-2">GENERATING...</div>
             </div>
          ) : state.aiImageCache ? (
                 <img src={state.aiImageCache} alt="AI Generated Culinary Concept" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
          ) : (
                 <div className="text-center p-8 text-outline">
                    <span className="material-symbols-outlined text-4xl mb-4 opacity-50">smart_toy</span>
                    <p className="font-label-caps text-label-caps uppercase tracking-widest font-bold">AI VISUALIZATION CANVAS</p>
                 </div>
          )}
        </div>

      </div>
    </section>
  );
};
