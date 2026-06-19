import React, { useState } from 'react';
import { useAppState } from '../store';
import { escapeHtml, formatKoreanDate } from '../utils';

export const Guestbook: React.FC = () => {
  const { state, addGuestbookEntry, deleteGuestbookEntry, showToast } = useAppState();
  
  // Form states
  const [author, setAuthor] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handlePost = async () => {
    if (!author.trim()) {
      showToast('이름을 입력해주세요.', true);
      return;
    }
    if (!message.trim()) {
      showToast('메시지를 입력해주세요.', true);
      return;
    }
    
    setIsSubmitting(true);
    try {
      const safeMessage = escapeHtml(message);
      const safeAuthor = escapeHtml(author);
      const safeRole = role.trim() ? escapeHtml(role) : 'Guest';
      
      // Dynamic random stylish avatar (we use standard public dicebear or simple placeholder avatar)
      const randomId = Math.floor(Math.random() * 100);
      const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${randomId}`;

      await addGuestbookEntry({
        author: safeAuthor,
        title: safeRole,
        message: safeMessage,
        avatarUrl: avatarUrl
      });
      
      // Clear inputs
      setMessage('');
      setAuthor('');
      setRole('');
    } catch (e) {
      showToast('기록 저장 중 요류가 발생했습니다.', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="px-6 md:px-margin-desktop py-stack-lg max-w-4xl mx-auto" id="guestbook-container">
      {/* Header */}
      <div className="text-center mb-12 border-b-2 border-outline pb-8">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="material-symbols-outlined text-secondary text-[24px]">rate_review</span>
          <span className="font-label-caps text-label-caps text-secondary uppercase font-bold tracking-widest">Guestbook</span>
        </div>
        <h2 className="font-headline-md text-[2.5rem] uppercase font-bold text-on-surface">
          다이닝 방명록 및 후기
        </h2>
        <p className="font-body-md text-on-surface/80 mt-2 font-semibold">
          에피큐리언 랩에서의 미식 경험이나 셰프 강민우에게 응원의 피드백을 들려주세요.
        </p>
      </div>

      {/* Form Card */}
      <div className="bg-surface border-4 border-outline p-6 md:p-8 mb-12 relative shadow-[6px_6px_0px_0px_#1A1A1A]">
        <div className="absolute top-0 right-0 bg-outline text-background font-label-caps text-xs px-3 py-1 font-bold">
          LEAVE A REVIEW
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 items-start mt-4">
          <div className="w-16 h-16 bg-outline flex items-center justify-center flex-shrink-0 text-background border-2 border-outline">
            <span className="material-symbols-outlined text-[32px]">person_pin</span>
          </div>
          
          <div className="flex-grow w-full space-y-4">
            {/* Input Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="guest-name">
                  이름 (NAME) *
                </label>
                <input 
                  id="guest-name"
                  type="text"
                  placeholder="예: 홍길동"
                  className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface font-body-md"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
              <div>
                <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="guest-role">
                  직함/소속 (ROLE / AFFILIATION)
                </label>
                <input 
                  id="guest-role"
                  type="text"
                  placeholder="예: 푸드 블로거, 일반 고객 등"
                  className="w-full bg-background border-2 border-outline py-2 px-3 text-on-surface font-body-md"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Message Area */}
            <div>
              <label className="font-label-caps text-xs text-on-surface mb-1 block font-bold" htmlFor="guest-message">
                후기 및 메시지 (REVIEW MESSAGE) *
              </label>
              <textarea
                id="guest-message"
                className="w-full bg-background border-2 border-outline text-on-surface font-body-md resize-none p-4"
                placeholder="식재료의 텍스처, 서비스, 매칭된 풍미 등 다이닝 경험에 관한 느낀 점을 편하게 적어주세요..."
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            {/* Actions Bar */}
            <div className="flex justify-between items-center pt-4 border-t-2 border-outline border-dashed">
              <div className="flex gap-2">
                <span className="font-label-caps text-[10px] text-outline font-bold uppercase">
                  * 필수 항목
                </span>
              </div>
              <button 
                onClick={handlePost}
                disabled={isSubmitting}
                className="px-6 py-2 bg-outline text-background font-label-caps text-xs hover:bg-secondary hover:text-background transition-all font-bold uppercase flex items-center gap-1 border-2 border-transparent disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                    등록 중...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                    의견 남기기
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feed Area */}
      <div className="space-y-6" id="guestbook-feed">
        {state.guestbook.length === 0 ? (
          <div className="border-4 border-outline p-8 text-center bg-surface">
            <p className="font-label-caps text-label-caps uppercase tracking-widest font-bold">등록된 다이닝 후기가 없습니다.</p>
            <p className="font-body-md text-xs text-outline/70 mt-1">첫 번째 소중한 후기를 등록해 보세요.</p>
          </div>
        ) : (
          state.guestbook.map((entry) => (
            <div 
              key={entry.id} 
              className="p-6 border-4 border-outline flex gap-4 bg-background hover:bg-surface transition-colors duration-300 relative shadow-[4px_4px_0px_0px_#1A1A1A]"
            >
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-outline bg-surface">
                {entry.avatarUrl ? (
                  <img 
                    alt="Avatar" 
                    className="w-full h-full object-cover grayscale" 
                    src={entry.avatarUrl} 
                    crossOrigin="anonymous" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <span className="material-symbols-outlined text-outline">person</span>
                )}
              </div>
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-3 mb-2 border-b-2 border-outline border-dashed pb-2">
                  <span className="font-display-lg text-lg text-on-surface font-bold">
                    {entry.author}
                  </span>
                  <span className="font-label-caps text-[9px] uppercase bg-outline px-2 py-0.5 text-background font-bold self-start md:self-auto">
                    {entry.title}
                  </span>
                  <div className="md:ml-auto flex items-center gap-3">
                    <span className="font-label-caps text-[10px] text-outline uppercase font-semibold">
                      {formatKoreanDate(entry.timestamp)}
                    </span>
                    <button
                      onClick={() => {
                        if (confirm(`'${entry.author}'님의 방명록 글을 삭제하시겠습니까?`)) {
                          deleteGuestbookEntry(entry.id);
                        }
                      }}
                      className="text-secondary hover:text-outline transition-colors p-0.5 border border-transparent hover:border-outline bg-background flex items-center justify-center cursor-pointer"
                      title="리뷰 삭제"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  </div>
                </div>
                <p 
                  className="font-body-md text-on-surface/90 leading-relaxed font-semibold" 
                  dangerouslySetInnerHTML={{ __html: entry.message }} 
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
