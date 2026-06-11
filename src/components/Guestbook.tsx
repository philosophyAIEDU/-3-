import React from 'react';
import { useAppState } from '../store';
import { escapeHtml, formatKoreanDate } from '../utils';

export const Guestbook: React.FC = () => {
  const { state, addGuestbookEntry, showToast } = useAppState();
  const [message, setMessage] = React.useState('');

  const handlePost = () => {
    if (!message.trim()) {
      showToast('메시지를 입력해주세요.', true);
      return;
    }
    
    // Simulate network or database transaction success locally 
    // since Firebase was declined by the user.
    try {
        const safeMessage = escapeHtml(message);
        addGuestbookEntry({
        author: "익명 방문자",
        title: "Guest",
        message: safeMessage,
        avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjAoCJSX0KhN8v-LQyJBdctQfjb77iQ32rf-hdHtSW24Pk45NF-EvH_w8z3FtVkN9-tdGEQqDcg3o96YEwRV3jdsCna9WfCeIS5Uc3cAbxNW5v7R9hEEvrftoj-bVqPiZt-TSSQwioJFdlJ1zTwsMPLeDQITs3vkzkMBdydIiaROGNUQwC8qwukXSH8cDkOCvpgQ4kUEi2pOEyrWKRE0IQdRsuKpDG-xhfy3ZmaquNng2tdaWrnkpW9MZl4eL8OHi-Fb6OpihzIbE" // Fallback generic avatar
        });
        setMessage('');
        showToast('성공적으로 기록을 남겼습니다.');
    } catch (e) {
        showToast('오류가 발생했습니다. 나중에 다시 시도해주세요.', true);
    }
  };

  return (
    <section className="px-6 md:px-margin-desktop py-stack-lg max-w-4xl mx-auto" id="guestbook-container">
      <div className="text-center mb-12 border-b-2 border-outline pb-8">
        <span className="font-label-caps text-label-caps text-secondary mb-4 block uppercase font-bold">방명록</span>
        <h2 className="font-headline-md text-[2.5rem] uppercase font-bold text-on-surface">연구실에 당신의 흔적을 남겨주세요</h2>
      </div>

      <div className="bg-surface border-4 border-outline p-8 mb-12">
        <div className="flex gap-4 items-start">
          <div className="w-12 h-12 bg-outline flex items-center justify-center flex-shrink-0 text-background">
            <span className="material-symbols-outlined">person</span>
          </div>
          <div className="flex-grow">
            <textarea
              className="w-full bg-background border-2 border-outline focus:ring-0 text-on-surface font-body-md resize-none p-4 mb-4"
              placeholder="당신의 경험이나 새로운 풍미 컨셉을 공유해주세요..."
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="flex justify-between items-center pt-4 border-t-2 border-outline">
              <div className="flex gap-2">
                <button className="p-2 text-on-surface hover:text-secondary transition-colors" aria-label="Add Emotion">
                  <span className="material-symbols-outlined text-[20px]">add_reaction</span>
                </button>
                <button className="p-2 text-on-surface hover:text-secondary transition-colors" aria-label="Add Image">
                  <span className="material-symbols-outlined text-[20px]">image</span>
                </button>
              </div>
              <button 
                  onClick={handlePost}
                  className="px-6 py-2 border-2 border-outline text-on-surface font-label-caps text-label-caps hover:bg-outline hover:text-background transition-all font-bold uppercase">
                의견 남기기
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-0 border-2 border-outline" id="guestbook-feed">
        {state.guestbook.map((entry) => (
          <div key={entry.id} className="p-6 border-b-2 last:border-b-0 border-outline flex gap-4 bg-background">
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 overflow-hidden border-2 border-outline">
              <img alt="Avatar" className="w-full h-full object-cover grayscale" src={entry.avatarUrl} crossOrigin="anonymous" referrerPolicy="no-referrer" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 border-b-2 border-outline border-dashed pb-2">
                <span className="font-label-caps text-label-caps text-on-surface font-bold">{entry.author}</span>
                <span className="font-label-caps text-[10px] text-surface-variant uppercase bg-outline px-2 py-1 text-background font-bold">{entry.title}</span>
                <span className="font-label-caps text-[10px] text-outline uppercase ml-auto font-bold">{formatKoreanDate(entry.timestamp)}</span>
              </div>
              <p className="font-body-md text-body-md text-on-surface font-medium" dangerouslySetInnerHTML={{ __html: entry.message }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
