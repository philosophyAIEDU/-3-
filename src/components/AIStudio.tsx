import React, { useState, useEffect } from 'react';
import { useAppState } from '../store';

interface GeneratedDish {
  id: string;
  url?: string;
  prompt?: string;
  loading: boolean;
  error?: string;
}

const PLATING_STYLES = [
  { label: '모던 과학요리', value: 'modernist scientific gastronomy plating style' },
  { label: '클래식 프렌치', value: 'classic French fine dining presentation' },
  { label: '북유럽 미니멀', value: 'Nordic minimalist plating' },
  { label: '모던 한식', value: 'contemporary Korean fine plating' },
  { label: '일식 가이세키', value: 'refined Japanese Kaiseki style' },
];

const MAIN_INGREDIENTS = [
  { label: '랍스터 & 캐비어', value: 'buttered lobster tail with black caviar' },
  { label: '수비드 한우', value: 'sous-vide Hanwoo beef tenderloin medallion' },
  { label: '참돔 타르타르', value: 'wild sea bream tartare' },
  { label: '트러플 머쉬룸', value: 'glazed mushrooms with shaved black truffles' },
  { label: '믹스베리 디저트', value: 'mascarpone cheese quenelle with mixed berries' },
];

const PLATES = [
  { label: '흑색 현무암 접시', value: 'on a textured black basalt stone slate plate' },
  { label: '백색 매트 세라믹', value: 'on a matte white round ceramic plate' },
  { label: '자연식 대리석', value: 'on a polished gray marble slab' },
  { label: '전통 옹기 식기', value: 'on a traditional dark Korean clay pottery dish' },
];

const GARNISHES = [
  { label: '식용꽃 & 마이크로 허브', value: 'garnished with edible flowers and microgreens' },
  { label: '딜 오일 & 사프란 폼', value: 'drizzled with dill herb oil and saffron foam' },
  { label: '금박 & 크럼블', value: 'decorated with delicate gold leaf and hazelnut soil crumble' },
  { label: '훈연 향 클로쉬', value: 'served under a glass cloche with swirling wood smoke' },
];

const VARIATION_MODIFIERS = [
  "classic fine-dining style, bright elegant studio lighting, close-up details",
  "modernist avant-garde style, dramatic high-contrast moody lighting, artistic composition",
  "minimalist plating style, clean natural daylight, overhead flatlay perspective",
  "rustic gourmet presentation, warm cozy chef's table background, macro lens detail"
];

export const AIStudio: React.FC = () => {
  const { state, setGeneratingAI, setAiImage, addPortfolioItem, showToast } = useAppState();
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKey, setShowApiKey] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>('');
  const [variationCount, setVariationCount] = useState<number>(3);
  const [creativeVariation, setCreativeVariation] = useState<boolean>(true);
  
  const [generatedDishes, setGeneratedDishes] = useState<GeneratedDish[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  
  // Lightbox Zoom state
  const [zoomedDish, setZoomedDish] = useState<GeneratedDish | null>(null);
  
  // Save form modal state
  const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
  const [selectedDishToSave, setSelectedDishToSave] = useState<GeneratedDish | null>(null);
  const [dishTitle, setDishTitle] = useState<string>('');
  const [dishDescription, setDishDescription] = useState<string>('');
  const [isSavingToDb, setIsSavingToDb] = useState<boolean>(false);

  // Load API key from local storage on mount
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const handleSaveApiKey = () => {
    localStorage.setItem('gemini_api_key', apiKey.trim());
    showToast('Gemini API 키가 안전하게 로컬 저장소에 저장되었습니다.');
  };

  const handleClearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('gemini_api_key');
    showToast('저장된 API 키가 삭제되었습니다.');
  };

  const handleAddTag = (value: string) => {
    setPrompt(prev => {
      const trimmed = prev.trim();
      if (!trimmed) return value;
      if (trimmed.endsWith(',')) return `${trimmed} ${value}`;
      return `${trimmed}, ${value}`;
    });
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      showToast('생성할 요리 컨셉을 입력하거나 아래 추천 태그들을 조합해 주세요.', true);
      return;
    }

    setIsGenerating(true);
    setGeneratingAI(true);
    
    // Create placeholder slots
    const initialDishes: GeneratedDish[] = Array.from({ length: variationCount }).map((_, idx) => ({
      id: `dish-${idx}-${Date.now()}`,
      loading: true,
    }));
    setGeneratedDishes(initialDishes);
    showToast(`${variationCount}개의 플레이팅 시뮬레이션 렌더링을 시작합니다...`);

    const promises = initialDishes.map(async (dish, idx) => {
      // Build modified prompt
      let basePrompt = prompt.trim();
      let modifiers = `High-end fine-dining culinary plating: ${basePrompt}. Photorealistic, professional food photography, shallow depth of field, exquisite lighting, highly detailed.`;
      
      if (creativeVariation && variationCount > 1) {
        modifiers += `, ${VARIATION_MODIFIERS[idx % VARIATION_MODIFIERS.length]}`;
      }

      try {
        let imageUrl = '';
        if (apiKey.trim()) {
          // Direct client-side call to Google Gemini API
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image:generateContent?key=${apiKey.trim()}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: modifiers }
                  ]
                }
              ],
              config: {
                responseModalities: ["IMAGE"],
                imageConfig: {
                  aspectRatio: "1:1",
                  imageSize: "1K"
                }
              }
            })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error?.message || `API Error ${response.status}`);
          }

          const data = await response.json();
          const base64Data = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
          if (!base64Data) {
            throw new Error("구글 API 응답에서 이미지 데이터를 수신하지 못했습니다.");
          }
          imageUrl = `data:image/jpeg;base64,${base64Data}`;
        } else {
          // Fallback to Backend Local API call
          const response = await fetch('/api/generate-image', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              prompt: modifiers
            })
          });

          if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.error || `HTTP ${response.status}`);
          }

          const data = await response.json();
          if (data.error) {
            throw new Error(data.error);
          }
          imageUrl = data.imageUrl;
        }

        // Update the slot with generated image
        setGeneratedDishes(prev => 
          prev.map(item => 
            item.id === dish.id 
              ? { ...item, url: imageUrl, prompt: modifiers, loading: false }
              : item
          )
        );
      } catch (err: any) {
        console.error(err);
        setGeneratedDishes(prev => 
          prev.map(item => 
            item.id === dish.id 
              ? { ...item, error: err.message || '렌더링 실패', loading: false }
              : item
          )
        );
      }
    });

    await Promise.all(promises);
    setIsGenerating(false);
    setGeneratingAI(false);
    showToast('플레이팅 시뮬레이션 완료.');
  };

  const handleSaveToPortfolio = async () => {
    if (!dishTitle.trim() || !dishDescription.trim()) {
      showToast('요리 제목과 설명을 입력해주세요.', true);
      return;
    }

    if (!selectedDishToSave?.url) return;

    setIsSavingToDb(true);
    try {
      await addPortfolioItem({
        title: dishTitle,
        altText: dishDescription,
        imageUrl: selectedDishToSave.url,
        importance: 1
      });
      
      // Also cache it globally in case other components check it
      setAiImage(selectedDishToSave.url);
      
      setIsSaveModalOpen(false);
      setSelectedDishToSave(null);
      setDishTitle('');
      setDishDescription('');
    } catch (e) {
      console.error(e);
      showToast('저장 중 오류가 발생했습니다.', true);
    } finally {
      setIsSavingToDb(false);
    }
  };

  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `chef-concept-plating-${index + 1}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`시안 #${index + 1} 다운로드를 시작합니다.`);
  };

  return (
    <section className="px-6 md:px-margin-desktop py-stack-lg max-w-7xl mx-auto border-b-2 border-outline bg-background" id="ai-control-panel">
      
      {/* Upper header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-outline">memory</span>
          <span className="font-label-caps text-label-caps text-outline uppercase font-bold tracking-widest border-b-2 border-outline pb-1">AI Plating & Recipe Lab</span>
        </div>
        
        {/* Quick info about model */}
        <div className="flex items-center gap-2 bg-surface border-2 border-outline px-3 py-1 text-xs font-bold text-outline self-start sm:self-auto">
          <span className="material-symbols-outlined text-sm text-secondary animate-pulse">lens</span>
          MODEL: GEMINI-3.1-FLASH-IMAGE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Form Panel - 5 cols */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <h2 className="font-display-lg text-[3rem] text-on-surface mb-4 leading-tight uppercase">
              상상 속 플레이팅을 시각화하다
            </h2>
            <p className="font-body-md text-on-surface/80 leading-relaxed font-semibold">
              구글의 초경량 이미지 모델인 **Gemini 3.1 Flash Image**를 사용하여 셰프 강민우가 구상하는 실험적인 요리 조합과 접시 디자인을 실시간으로 렌더링합니다. 여러 개의 시안을 한 번에 생성해 플레이팅 스타일을 대조할 수 있습니다.
            </p>
          </div>

          {/* API Key Input */}
          <div className="border-4 border-outline bg-surface p-5 relative">
            <div className="absolute -top-3 right-4 bg-outline text-surface font-label-caps text-[10px] px-2 py-0.5 font-bold border-2 border-outline">API SETTING</div>
            <label className="font-label-caps text-xs text-on-surface mb-2 block font-bold uppercase" htmlFor="api-key-input">
              Gemini API Key
            </label>
            <p className="font-body-md text-[11px] text-on-surface/70 mb-3 leading-tight">
              무료/개인 API 키를 사용해 직접 이미지를 생성합니다. 입력한 키는 브라우저에만 저장됩니다. 
              <a href="https://aistudio.google.com/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline ml-1 font-bold">API 키 발급받기 →</a>
            </p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input 
                  id="api-key-input"
                  type={showApiKey ? "text" : "password"} 
                  className="w-full bg-background border-2 border-outline py-2 px-3 pr-10 text-on-surface text-xs font-mono"
                  placeholder="AIzaSy..."
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-outline hover:text-secondary flex items-center"
                >
                  <span className="material-symbols-outlined text-[18px]">{showApiKey ? 'visibility' : 'visibility_off'}</span>
                </button>
              </div>
              {apiKey ? (
                <div className="flex gap-1">
                  <button 
                    onClick={handleSaveApiKey}
                    className="bg-outline text-background px-3 py-2 text-xs font-bold hover:bg-secondary hover:text-background border-2 border-transparent transition-colors"
                  >
                    저장
                  </button>
                  <button 
                    onClick={handleClearApiKey}
                    className="border-2 border-outline text-outline px-2 py-2 text-xs font-bold hover:bg-outline hover:text-background transition-colors"
                    title="API Key 삭제"
                  >
                    <span className="material-symbols-outlined text-[16px] flex items-center">delete</span>
                  </button>
                </div>
              ) : (
                <button 
                  onClick={handleSaveApiKey}
                  className="bg-outline text-background px-3 py-2 text-xs font-bold hover:bg-secondary hover:text-background border-2 border-transparent transition-colors disabled:opacity-50"
                  disabled={!apiKey}
                >
                  저장
                </button>
              )}
            </div>
            {localStorage.getItem('gemini_api_key') && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px] text-green-700 font-bold uppercase text-left">
                <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-ping"></span>
                <span>API Key Loaded & Active</span>
              </div>
            )}
          </div>

          {/* Builder & Input Form */}
          <div className="border-4 border-outline bg-surface p-6 space-y-6 relative">
            <div className="absolute -top-3 right-4 bg-outline text-surface font-label-caps text-[10px] px-2 py-0.5 font-bold border-2 border-outline">IDEATOR</div>
            
            {/* Prompt Builder Presets */}
            <div className="space-y-4">
              <h3 className="font-label-caps text-xs text-on-surface font-bold uppercase tracking-wider border-b border-outline pb-1 text-left">
                셰프 플레이팅 가이드 태그 (클릭하여 조합)
              </h3>
              
              <div className="space-y-3 max-h-[200px] overflow-y-auto pr-1 text-left">
                <div>
                  <span className="text-[10px] font-bold text-outline/60 uppercase block mb-1">1. 요리 스타일</span>
                  <div className="flex flex-wrap gap-1">
                    {PLATING_STYLES.map(style => (
                      <button
                        key={style.label}
                        onClick={() => handleAddTag(style.value)}
                        className="text-[10px] px-2 py-1 border border-outline hover:border-secondary hover:text-secondary bg-background transition-colors font-bold uppercase"
                      >
                        {style.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-outline/60 uppercase block mb-1">2. 메인 식재료</span>
                  <div className="flex flex-wrap gap-1">
                    {MAIN_INGREDIENTS.map(ing => (
                      <button
                        key={ing.label}
                        onClick={() => handleAddTag(ing.value)}
                        className="text-[10px] px-2 py-1 border border-outline hover:border-secondary hover:text-secondary bg-background transition-colors font-bold uppercase"
                      >
                        {ing.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-outline/60 uppercase block mb-1">3. 접시 선택</span>
                  <div className="flex flex-wrap gap-1">
                    {PLATES.map(plate => (
                      <button
                        key={plate.label}
                        onClick={() => handleAddTag(plate.value)}
                        className="text-[10px] px-2 py-1 border border-outline hover:border-secondary hover:text-secondary bg-background transition-colors font-bold uppercase"
                      >
                        {plate.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold text-outline/60 uppercase block mb-1">4. 장식 & 피니싱</span>
                  <div className="flex flex-wrap gap-1">
                    {GARNISHES.map(gar => (
                      <button
                        key={gar.label}
                        onClick={() => handleAddTag(gar.value)}
                        className="text-[10px] px-2 py-1 border border-outline hover:border-secondary hover:text-secondary bg-background transition-colors font-bold uppercase"
                      >
                        {gar.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Prompt Input */}
            <div className="space-y-2 text-left">
              <label className="font-label-caps text-xs text-on-surface block font-bold uppercase" htmlFor="prompt-textarea">
                구상 프롬프트 (영문 조합 권장)
              </label>
              <div className="relative">
                <textarea 
                  id="prompt-textarea"
                  rows={4}
                  className="w-full bg-background border-2 border-outline p-3 text-on-surface font-body-md text-sm placeholder:text-outline/40"
                  placeholder="예: buttered lobster tail with black caviar, on a textured black basalt stone slate plate, decorated with delicate gold leaf..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  disabled={isGenerating}
                />
                {prompt && (
                  <button
                    onClick={() => setPrompt('')}
                    className="absolute right-2 top-2 text-outline/50 hover:text-secondary text-xs font-bold"
                  >
                    CLEAR
                  </button>
                )}
              </div>
            </div>

            {/* Config & Action */}
            <div className="space-y-4 pt-2 text-left">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="font-label-caps text-[10px] text-outline/70 block mb-1.5 font-bold uppercase">생성 시안 개수</span>
                  <div className="flex border-2 border-outline bg-background">
                    {[1, 2, 3, 4].map(num => (
                      <button
                        key={num}
                        onClick={() => setVariationCount(num)}
                        disabled={isGenerating}
                        className={`flex-1 py-1.5 text-xs font-bold transition-colors border-r last:border-r-0 border-outline ${
                          variationCount === num 
                            ? 'bg-secondary text-background' 
                            : 'bg-background text-on-surface hover:bg-outline hover:text-background'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 cursor-pointer select-none py-1">
                    <input 
                      type="checkbox"
                      checked={creativeVariation}
                      onChange={(e) => setCreativeVariation(e.target.checked)}
                      disabled={isGenerating || variationCount <= 1}
                      className="w-4 h-4 border-2 border-outline accent-secondary"
                    />
                    <div className="flex flex-col">
                      <span className="font-label-caps text-xs font-bold">다채로운 스타일</span>
                      <span className="text-[9px] text-outline/60 leading-none">각 시안의 조명/구도 변화</span>
                    </div>
                  </label>
                </div>
              </div>

              <button 
                id="generate-btn" 
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 bg-outline text-background py-4 font-label-caps text-sm hover:bg-secondary hover:text-background border-2 border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase"
              >
                {isGenerating ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[20px]">progress_activity</span>
                    시뮬레이션 구동 중...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">auto_awesome</span>
                    플레이팅 시뮬레이션 시작
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Canvas/Grid Panel - 7 cols */}
        <div className="lg:col-span-7">
          {generatedDishes.length === 0 ? (
            /* Empty state */
            <div className="border-4 border-outline bg-background flex flex-col items-center justify-center p-12 aspect-square md:aspect-[4/3] text-center text-outline">
              <span className="material-symbols-outlined text-6xl mb-4 opacity-50">restaurant_menu</span>
              <h3 className="font-display-lg text-2xl uppercase mb-2">AI Plating Canvas</h3>
              <p className="font-body-md text-xs text-outline/70 max-w-sm">
                왼쪽 패널에서 음식 아이디어 태그를 조합하여 프롬프트를 만들고 시뮬레이션을 시작하면, 이곳에 셰프 스타일의 고품질 접시 시안들이 렌더링됩니다.
              </p>
            </div>
          ) : (
            /* Grid layout based on variationCount */
            <div className={`grid gap-6 ${
              generatedDishes.length === 1 
                ? 'grid-cols-1 max-w-xl mx-auto' 
                : 'grid-cols-1 sm:grid-cols-2'
            }`}>
              {generatedDishes.map((dish, idx) => (
                <div 
                  key={dish.id} 
                  className="relative aspect-square border-4 border-outline bg-surface overflow-hidden group flex items-center justify-center"
                >
                  {dish.loading ? (
                    /* Loading State with diagonal brutalist stripes */
                    <div 
                      className="absolute inset-0 flex flex-col items-center justify-center text-center p-4" 
                      style={{ backgroundImage: 'repeating-linear-gradient(45deg, var(--color-surface-dim) 0, var(--color-surface-dim) 10px, transparent 10px, transparent 20px)' }}
                    >
                      <div className="bg-background border-2 border-outline px-3 py-1.5 font-label-caps text-[10px] font-bold uppercase tracking-wider animate-pulse mb-2">
                        RENDERING CONCEPT #{idx + 1}
                      </div>
                      <span className="material-symbols-outlined animate-spin text-outline text-2xl">progress_activity</span>
                    </div>
                  ) : dish.error ? (
                    /* Error State */
                    <div className="p-6 text-center text-secondary">
                      <span className="material-symbols-outlined text-3xl mb-2">warning</span>
                      <p className="text-xs font-bold uppercase">렌더링 실패</p>
                      <p className="text-[10px] text-outline/80 mt-1 max-w-xs">{dish.error}</p>
                    </div>
                  ) : dish.url ? (
                    /* Completed State */
                    <div className="relative w-full h-full">
                      <img 
                        src={dish.url} 
                        alt={`AI Plating Concept #${idx + 1}`} 
                        className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105" 
                      />
                      
                      {/* Concept Tag */}
                      <div className="absolute top-2 left-2 bg-outline text-background px-2 py-0.5 font-label-caps text-[9px] font-bold border border-background z-10">
                        CONCEPT #{idx + 1}
                      </div>

                      {/* Neo-brutalist Hover Overlay */}
                      <div className="absolute inset-0 bg-outline/80 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 z-20">
                        <span className="font-label-caps text-[10px] text-secondary font-bold tracking-widest uppercase mb-4">
                          플레이팅 컨셉 #{idx + 1}
                        </span>
                        
                        <div className="flex gap-2">
                          <button
                            onClick={() => setZoomedDish(dish)}
                            className="bg-background text-outline border-2 border-outline p-2 hover:bg-secondary hover:text-background hover:border-secondary transition-colors cursor-pointer"
                            title="크게 보기 (Zoom)"
                          >
                            <span className="material-symbols-outlined text-[18px] flex items-center">zoom_in</span>
                          </button>
                          <button
                            onClick={() => handleDownload(dish.url!, idx)}
                            className="bg-background text-outline border-2 border-outline p-2 hover:bg-secondary hover:text-background hover:border-secondary transition-colors cursor-pointer"
                            title="다운로드"
                          >
                            <span className="material-symbols-outlined text-[18px] flex items-center">download</span>
                          </button>
                          <button
                            onClick={() => {
                              setSelectedDishToSave(dish);
                              setDishTitle(`시그니처 시안 #${idx + 1} - ${prompt.length > 20 ? prompt.substring(0, 17) + '...' : prompt}`);
                              setDishDescription(dish.prompt || `${prompt}에 맞춰 나노 바나나 AI가 합성한 요리 디자인.`);
                              setIsSaveModalOpen(true);
                            }}
                            className="bg-secondary text-background border-2 border-secondary p-2 hover:bg-outline hover:text-background hover:border-outline transition-colors cursor-pointer"
                            title="포트폴리오(갤러리) 저장"
                          >
                            <span className="material-symbols-outlined text-[18px] flex items-center">bookmark</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* LIGHTBOX MODAL */}
      {zoomedDish && zoomedDish.url && (
        <div 
          className="fixed inset-0 bg-outline/80 backdrop-blur-md flex items-center justify-center z-50 p-4"
          onClick={() => setZoomedDish(null)}
        >
          <div 
            className="bg-surface border-4 border-outline max-w-2xl w-full relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setZoomedDish(null)}
              className="absolute top-2 right-2 bg-outline text-surface hover:bg-secondary p-1 border-2 border-outline transition-colors z-30 flex items-center justify-center cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px] font-bold">close</span>
            </button>
            <div className="aspect-square w-full bg-background border-b-4 border-outline">
              <img src={zoomedDish.url} alt="Zoomed Culinary Concept" className="w-full h-full object-cover" />
            </div>
            <div className="p-5 bg-surface text-outline text-left">
              <span className="font-label-caps text-xs text-secondary font-bold tracking-wider uppercase block mb-1">
                GENERATED PLATING CONCEPT DETAILS
              </span>
              <p className="font-body-md text-sm text-on-surface font-semibold leading-relaxed">
                {zoomedDish.prompt || 'Generated dish style'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SAVE TO PORTFOLIO MODAL */}
      {isSaveModalOpen && selectedDishToSave && selectedDishToSave.url && (
        <div className="fixed inset-0 bg-outline/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface border-4 border-outline p-6 max-w-md w-full relative">
            <div className="absolute top-0 right-0 bg-secondary text-background font-label-caps text-[10px] px-2 py-1 font-bold">SAVE TO GALLERY</div>
            <h3 className="font-display-lg text-2xl uppercase mb-4 font-bold text-secondary text-left">
              포트폴리오에 저장
            </h3>
            
            {/* Thumbnail */}
            <div className="aspect-square border-2 border-outline mb-4 overflow-hidden bg-background max-w-[120px] mx-auto">
              <img src={selectedDishToSave.url} alt="To Save" className="w-full h-full object-cover" />
            </div>

            <div className="space-y-4 text-left">
              <div>
                <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold animate-none" htmlFor="save-dish-title">
                  요리 이름 (DISH TITLE)
                </label>
                <input 
                  id="save-dish-title"
                  type="text"
                  className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface text-xs font-bold"
                  value={dishTitle}
                  onChange={(e) => setDishTitle(e.target.value)}
                  disabled={isSavingToDb}
                />
              </div>
              
              <div>
                <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold animate-none" htmlFor="save-dish-desc">
                  요리 기법 및 재료 설명 (DESCRIPTION)
                </label>
                <textarea 
                  id="save-dish-desc"
                  className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface text-xs"
                  rows={3}
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  disabled={isSavingToDb}
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                onClick={() => {
                  setIsSaveModalOpen(false);
                  setSelectedDishToSave(null);
                }}
                disabled={isSavingToDb}
                className="px-4 py-2 border-2 border-outline text-on-surface hover:bg-outline hover:text-background transition-colors font-bold text-xs cursor-pointer"
              >
                취소
              </button>
              <button 
                onClick={handleSaveToPortfolio}
                disabled={isSavingToDb}
                className="px-4 py-2 bg-secondary text-background hover:bg-outline hover:text-background transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                {isSavingToDb ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
                    등록 중...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">save</span>
                    갤러리 등록
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};
