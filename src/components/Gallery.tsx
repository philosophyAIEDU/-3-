import React, { useState } from 'react';
import { useAppState, PortfolioItem } from '../store';

export const Gallery: React.FC = () => {
  const { state, addPortfolioItem, updatePortfolioItem, deletePortfolioItem, showToast } = useAppState();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<PortfolioItem | null>(null);

  // Form states
  const [dishTitle, setDishTitle] = useState('');
  const [dishDescription, setDishDescription] = useState('');
  const [dishImageUrl, setDishImageUrl] = useState('');
  const [dishImportance, setDishImportance] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dishTitle.trim()) {
      showToast('요리 이름을 입력해 주세요.', true);
      return;
    }
    if (!dishDescription.trim()) {
      showToast('요리 설명을 입력해 주세요.', true);
      return;
    }

    setIsSubmitting(true);
    try {
      const finalImageUrl = dishImageUrl.trim() || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800'; // Default gourmet plate
      await addPortfolioItem({
        title: dishTitle.trim(),
        altText: dishDescription.trim(),
        imageUrl: finalImageUrl,
        importance: Number(dishImportance) || 1
      });
      // Reset form
      setDishTitle('');
      setDishDescription('');
      setDishImageUrl('');
      setDishImportance(1);
      setIsAddModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDish) return;
    if (!dishTitle.trim()) {
      showToast('요리 이름을 입력해 주세요.', true);
      return;
    }
    if (!dishDescription.trim()) {
      showToast('요리 설명을 입력해 주세요.', true);
      return;
    }

    setIsSubmitting(true);
    try {
      await updatePortfolioItem({
        ...selectedDish,
        title: dishTitle.trim(),
        altText: dishDescription.trim(),
        importance: Number(dishImportance) || 1
      });
      setIsEditModalOpen(false);
      setSelectedDish(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-6 md:px-margin-desktop py-stack-lg border-b-2 border-outline bg-background" id="portfolio-gallery">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b-2 border-outline pb-8">
        <div className="text-left">
          <div className="flex items-center gap-3 mb-2">
            <span className="material-symbols-outlined text-outline">restaurant</span>
            <span className="font-label-caps text-label-caps text-outline uppercase font-bold tracking-widest border-b border-outline/30 pb-0.5">Signature Dishes</span>
          </div>
          <h2 className="font-headline-md text-[2.5rem] text-on-surface mb-2 tracking-tighter uppercase font-bold">
            시그니처 컬렉션
          </h2>
          <p className="font-body-md text-on-surface font-semibold">
            엄선하여 조리한 요리 예술과 미학적 플레이팅 컬렉션입니다. 직접 추가, 수정, 삭제할 수 있습니다.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 mt-6 md:mt-0 items-center">
          <span className="font-label-caps text-xs uppercase text-outline opacity-60 font-bold">
            TOTAL DISHES: {state.portfolio.length}
          </span>
          <button 
            onClick={() => {
              setDishTitle('');
              setDishDescription('');
              setDishImageUrl('');
              setDishImportance(1);
              setIsAddModalOpen(true);
            }}
            className="px-4 py-2 bg-secondary text-background border-2 border-secondary font-label-caps text-xs font-bold hover:bg-outline hover:text-background hover:border-outline transition-all cursor-pointer flex items-center gap-1.5 uppercase"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            새 요리 추가
          </button>
        </div>
      </div>

      {/* Grid of Dishes */}
      {state.portfolio.length === 0 ? (
        <div className="border-4 border-outline p-16 text-center bg-surface">
          <span className="material-symbols-outlined text-5xl text-outline opacity-50 mb-4">restaurant_menu</span>
          <p className="font-label-caps text-label-caps uppercase tracking-widest font-bold">포트폴리오 요리가 비어 있습니다.</p>
          <p className="font-body-md text-xs text-outline/70 mt-1">상단의 "새 요리 추가" 버튼이나 하단의 "AI 플레이팅 연구실"을 이용해 요리를 추가해보세요!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" id="gallery-grid">
          {state.portfolio.map((item, index) => (
            <article 
              key={item.id} 
              className="group border-4 border-outline bg-surface p-4 flex flex-col justify-between shadow-[6px_6px_0px_0px_#1A1A1A] hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_#1A1A1A] transition-all duration-300 bg-surface text-left"
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
                <p className="font-body-md text-on-surface/90 border-t-2 border-outline border-dashed pt-3 pb-3 text-sm font-semibold leading-relaxed min-h-[60px]">
                  {item.altText}
                </p>

                {/* Management Toolbar */}
                <div className="flex gap-2 border-t-2 border-outline/20 pt-3 pb-1">
                  <button
                    onClick={() => {
                      setSelectedDish(item);
                      setDishTitle(item.title);
                      setDishDescription(item.altText);
                      setDishImportance(item.importance);
                      setIsEditModalOpen(true);
                    }}
                    className="flex-1 py-1.5 px-2 border-2 border-outline text-on-surface bg-background text-[11px] font-bold hover:bg-outline hover:text-background transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">edit</span>
                    수정
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`'${item.title}' 요리를 삭제하시겠습니까?`)) {
                        deletePortfolioItem(item.id);
                      }
                    }}
                    className="py-1.5 px-3 border-2 border-secondary text-secondary bg-background text-[11px] font-bold hover:bg-secondary hover:text-background transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px]">delete</span>
                    삭제
                  </button>
                </div>

                {/* Gastronomy indicators */}
                <div className="flex justify-between items-center text-[10px] font-label-caps text-outline opacity-60 mt-2">
                  <span>중요도: {item.importance}</span>
                  <span>EPICUREAN LAB</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* ADD DISH MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-outline/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface border-4 border-outline p-6 max-w-md w-full relative shadow-[8px_8px_0px_0px_#1A1A1A] text-left">
            <div className="absolute top-0 right-0 bg-secondary text-background font-label-caps text-[10px] px-2 py-1 font-bold">ADD SIGNATURE</div>
            <h3 className="font-display-lg text-2xl uppercase mb-4 font-bold text-secondary">
              새 요리 추가
            </h3>
            
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="add-dish-title">
                  요리 이름 (TITLE) *
                </label>
                <input 
                  id="add-dish-title"
                  type="text"
                  required
                  placeholder="예: 송로버섯을 곁들인 수비드 한우 스테이크"
                  className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface text-xs font-bold"
                  value={dishTitle}
                  onChange={(e) => setDishTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="add-dish-image">
                  이미지 URL (IMAGE URL)
                </label>
                <input 
                  id="add-dish-image"
                  type="url"
                  placeholder="예: https://images.unsplash.com/... (비워두면 기본 이미지 지정)"
                  className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface text-xs"
                  value={dishImageUrl}
                  onChange={(e) => setDishImageUrl(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="add-dish-importance">
                    정렬 중요도 (1-5)
                  </label>
                  <select 
                    id="add-dish-importance"
                    className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface text-xs font-bold"
                    value={dishImportance}
                    onChange={(e) => setDishImportance(Number(e.target.value))}
                    disabled={isSubmitting}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} {n === 5 ? '(가장 중요)' : n === 1 ? '(일반)' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="add-dish-desc">
                  요리 기법 및 설명 (DESCRIPTION) *
                </label>
                <textarea 
                  id="add-dish-desc"
                  required
                  placeholder="요리 플레이팅 연출 방식, 가니시 종류, 미학적 의도를 상세하게 기록하세요..."
                  className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface text-xs"
                  rows={3}
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-dashed border-outline/20">
                <button 
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={isSubmitting}
                  className="px-4 py-2 border-2 border-outline text-on-surface hover:bg-outline hover:text-background transition-colors font-bold text-xs cursor-pointer"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-secondary text-background hover:bg-outline hover:text-background transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
                      저장 중...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[14px]">save</span>
                      추가 완료
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT DISH MODAL */}
      {isEditModalOpen && selectedDish && (
        <div className="fixed inset-0 bg-outline/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-surface border-4 border-outline p-6 max-w-md w-full relative shadow-[8px_8px_0px_0px_#1A1A1A] text-left">
            <div className="absolute top-0 right-0 bg-secondary text-background font-label-caps text-[10px] px-2 py-1 font-bold">EDIT SIGNATURE</div>
            <h3 className="font-display-lg text-2xl uppercase mb-4 font-bold text-secondary">
              요리 정보 수정
            </h3>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="edit-dish-title">
                  요리 이름 (TITLE) *
                </label>
                <input 
                  id="edit-dish-title"
                  type="text"
                  required
                  placeholder="요리 이름"
                  className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface text-xs font-bold"
                  value={dishTitle}
                  onChange={(e) => setDishTitle(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="edit-dish-importance">
                    정렬 중요도 (1-5)
                  </label>
                  <select 
                    id="edit-dish-importance"
                    className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface text-xs font-bold"
                    value={dishImportance}
                    onChange={(e) => setDishImportance(Number(e.target.value))}
                    disabled={isSubmitting}
                  >
                    {[1, 2, 3, 4, 5].map(n => (
                      <option key={n} value={n}>{n} {n === 5 ? '(가장 중요)' : n === 1 ? '(일반)' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="edit-dish-desc">
                  요리 기법 및 설명 (DESCRIPTION) *
                </label>
                <textarea 
                  id="edit-dish-desc"
                  required
                  className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface text-xs"
                  rows={4}
                  value={dishDescription}
                  onChange={(e) => setDishDescription(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t-2 border-dashed border-outline/20">
                <button 
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setSelectedDish(null);
                  }}
                  disabled={isSubmitting}
                  className="px-4 py-2 border-2 border-outline text-on-surface hover:bg-outline hover:text-background transition-colors font-bold text-xs cursor-pointer"
                >
                  취소
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-secondary text-background hover:bg-outline hover:text-background transition-colors font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
                      수정 중...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[14px]">save</span>
                      수정 완료
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};
