import React, { useState } from 'react';
import { useAppState } from '../store';

export const AIStudio: React.FC = () => {
  const { state, setGeneratingAI, setAiImage, addPortfolioItem, showToast } = useAppState();
  const [prompt, setPrompt] = useState<string>('');
  
  // States for saving the generated item to the portfolio
  const [isSaveFormOpen, setIsSaveFormOpen] = useState<boolean>(false);
  const [dishTitle, setDishTitle] = useState<string>('');
  const [dishDescription, setDishDescription] = useState<string>('');
  const [isSavingToDb, setIsSavingToDb] = useState<boolean>(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('생성할 요리 컨셉을 묘사해주세요.', true);
      return;
    }

    setGeneratingAI(true);
    showToast('나노 바나나 이미지 엔진 구동 중...', false);
    setIsSaveFormOpen(false); // Reset form state if generating a new one
    
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          prompt: `High-end fine-dining culinary plating: ${prompt}. Photorealistic, professional food photography, shallow depth of field, exquisite lighting, highly detailed.` 
        })
      });

      if (!response.ok) {
        throw new Error(`API 오류: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setAiImage(data.imageUrl);
      showToast('플레이팅 시뮬레이션 렌더링 완료.');
      
      // Auto-populate save form fields
      setDishTitle(prompt.length > 30 ? prompt.substring(0, 27) + '...' : prompt);
      setDishDescription(`${prompt}에 기반하여 나노 바나나 AI가 렌더링한 가상의 메뉴 컨셉 플레이팅.`);
    } catch (error: any) {
      console.error(error);
      showToast('시뮬레이션 실패. 네트워크나 API 설정을 확인해주세요.', true);
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleSaveToPortfolio = async () => {
    if (!dishTitle.trim() || !dishDescription.trim()) {
      showToast('요리 제목과 설명을 입력해주세요.', true);
      return;
    }

    if (!state.aiImageCache) return;

    setIsSavingToDb(true);
    try {
      await addPortfolioItem({
        title: dishTitle,
        altText: dishDescription,
        imageUrl: state.aiImageCache,
        importance: 1 // Default level for AI-generated concepts
      });
      // Clear forms
      setIsSaveFormOpen(false);
      setPrompt('');
      setAiImage(null);
    } catch (e) {
      console.error(e);
      showToast('저장 중 오류가 발생했습니다.', true);
    } finally {
      setIsSavingToDb(false);
    }
  };

  const handleReset = () => {
    setAiImage(null);
    setPrompt('');
    setIsSaveFormOpen(false);
  };

  return (
    <section className="px-6 md:px-margin-desktop py-stack-lg max-w-7xl mx-auto border-b-2 border-outline bg-background" id="ai-control-panel">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Left Panel: Description and Inputs */}
        <div>
          <div className="flex items-center gap-3 mb-6">
            <span className="material-symbols-outlined text-outline">memory</span>
            <span className="font-label-caps text-label-caps text-outline uppercase font-bold tracking-widest border-b-2 border-outline pb-1">AI Plating & Recipe Lab</span>
          </div>
          <h2 className="font-display-lg text-[3rem] text-on-surface mb-6 leading-tight uppercase">
            상상 속 플레이팅을 시각화하다
          </h2>
          <p className="font-body-lg text-body-lg text-on-surface mb-8 leading-relaxed font-bold">
            구글의 초경량 이미지 모델인 **나노 바나나(Nano Banana API)**를 사용하여, 
            셰프 강민우가 구상하는 실험적인 요리 조합과 접시 디자인을 실시간으로 렌더링합니다. 
            시뮬레이션된 요리가 마음에 들면 아래 폼을 통해 시그니처 갤러리에 포트폴리오로 바로 보관할 수 있습니다.
          </p>

          {!state.aiImageCache || isSaveFormOpen ? (
            /* Standard Generation Panel OR Save Form Panel */
            <div className="border-4 border-outline bg-surface p-6 relative">
              {!isSaveFormOpen ? (
                // GENERATION PANEL
                <>
                  <div className="absolute top-0 right-0 bg-outline text-surface font-label-caps text-xs px-2 py-1 font-bold">IDEATION</div>
                  <label className="font-label-caps text-label-caps text-on-surface mb-3 block font-bold uppercase" htmlFor="prompt-input">
                    새 요리 구상 프롬프트
                  </label>
                  <div className="relative">
                    <input 
                      id="prompt-input"
                      type="text" 
                      className="w-full bg-background border-2 border-outline py-4 px-5 pl-12 text-on-surface font-body-md focus:border-secondary focus:outline-none transition-colors"
                      placeholder="예: 들기름 에멀전과 참다랑어 타르타르, 캐비어 레이어링..."
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      disabled={state.isGeneratingAI}
                    />
                    <span className="material-symbols-outlined absolute left-4 top-1/2 transform -translate-y-1/2 text-outline">restaurant</span>
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
                          시뮬레이션 중...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                          시뮬레이션 실행
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                // SAVE TO PORTFOLIO FORM
                <>
                  <div className="absolute top-0 right-0 bg-secondary text-background font-label-caps text-xs px-2 py-1 font-bold">SAVE TO GALLERY</div>
                  <h3 className="font-display-lg text-xl uppercase mb-4 font-bold text-secondary">
                    이 요리 컨셉을 포트폴리오에 저장
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="dish-title">
                        요리 이름 (DISH TITLE)
                      </label>
                      <input 
                        id="dish-title"
                        type="text"
                        className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface font-body-md"
                        value={dishTitle}
                        onChange={(e) => setDishTitle(e.target.value)}
                        disabled={isSavingToDb}
                      />
                    </div>
                    
                    <div>
                      <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="dish-desc">
                        요리 기법 및 재료 설명 (DESCRIPTION)
                      </label>
                      <textarea 
                        id="dish-desc"
                        className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface font-body-md"
                        rows={3}
                        value={dishDescription}
                        onChange={(e) => setDishDescription(e.target.value)}
                        disabled={isSavingToDb}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end gap-3 mt-6">
                    <button 
                      onClick={() => setIsSaveFormOpen(false)}
                      disabled={isSavingToDb}
                      className="px-6 py-2 border-2 border-outline text-on-surface hover:bg-outline hover:text-background transition-colors font-bold text-sm"
                    >
                      취소
                    </button>
                    <button 
                      onClick={handleSaveToPortfolio}
                      disabled={isSavingToDb}
                      className="px-6 py-2 bg-secondary text-background hover:bg-outline hover:text-background transition-colors font-bold text-sm flex items-center gap-2"
                    >
                      {isSavingToDb ? (
                        <>
                          <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                          저장 중...
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[16px]">save</span>
                          포트폴리오 등록
                        </>
                      )}
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            /* Options after successful generation, before saving */
            <div className="border-4 border-outline bg-surface p-6 relative flex flex-col items-center text-center">
              <span className="material-symbols-outlined text-4xl text-secondary mb-3">check_circle</span>
              <h3 className="font-display-lg text-2xl uppercase mb-2 font-bold">플레이팅 이미지 완성</h3>
              <p className="font-body-md text-sm text-on-surface/80 max-w-md mb-6 font-semibold">
                나노 바나나 엔진이 이미지를 성공적으로 합성했습니다. 이 컨셉을 셰프의 시그니처 갤러리에 저장하여 사람들과 공유해 보세요.
              </p>
              
              <div className="flex gap-4 w-full">
                <button 
                  onClick={handleReset}
                  className="flex-1 py-3 border-2 border-outline text-on-surface font-label-caps hover:bg-outline hover:text-background transition-colors font-bold uppercase text-xs"
                >
                  지우기
                </button>
                <button 
                  onClick={() => setIsSaveFormOpen(true)}
                  className="flex-1 py-3 bg-secondary text-background font-label-caps hover:bg-outline hover:text-background transition-colors font-bold uppercase text-xs flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  포트폴리오에 저장
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel: Output Canvas */}
        <div className="relative aspect-square md:aspect-[4/3] border-4 border-outline bg-background flex items-center justify-center group overflow-hidden w-full" id="ai-output-display">
          {state.isGeneratingAI ? (
            <div className="text-center p-8 absolute inset-0 flex flex-col items-center justify-center z-10 bg-surface" style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--color-surface-dim) 0, var(--color-surface-dim) 10px, transparent 10px, transparent 20px)' }}>
              <div className="font-display-lg text-[2rem] text-secondary uppercase animate-pulse bg-background border-2 border-outline px-4 py-2">
                GENERATING CONCEPTS...
              </div>
            </div>
          ) : state.aiImageCache ? (
            <div className="relative w-full h-full">
              <img 
                src={state.aiImageCache} 
                alt="AI Generated Culinary Concept" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" 
              />
              <div className="absolute top-2 right-2 bg-outline text-background px-3 py-1 font-label-caps text-[10px] border border-background">
                NANO BANANA MODEL
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-outline">
              <span className="material-symbols-outlined text-5xl mb-4 opacity-50">restaurant_menu</span>
              <p className="font-label-caps text-label-caps uppercase tracking-widest font-bold">AI PLATING CANVAS</p>
              <p className="font-body-md text-xs text-outline/70 mt-2">프롬프트를 입력하면 구글의 나노 바나나 이미지가 생성됩니다.</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
};
