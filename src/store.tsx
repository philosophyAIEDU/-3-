import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  altText: string;
  title: string;
  importance: number;
}

export interface GuestbookEntry {
  id: string;
  author: string;
  title: string;
  message: string;
  timestamp: number;
  avatarUrl: string;
}

export interface AppState {
  portfolio: PortfolioItem[];
  guestbook: GuestbookEntry[];
  isGeneratingAI: boolean;
  aiImageCache: string | null;
}

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  addGuestbookEntry: (entry: Omit<GuestbookEntry, 'id' | 'timestamp'>) => void;
  setGeneratingAI: (isGenerating: boolean) => void;
  setAiImage: (url: string | null) => void;
  showToast: (message: string, isError?: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PORTFOLIO: PortfolioItem[] = [
  {
    id: "1",
    importance: 3,
    title: "AI-생성 컨셉 #041",
    altText: "Gold yuzu mousse",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuDJLZmpJ-FsN_QjejbVe6MnIt2E3eLTW32rDdTOyro67LSo32ICXYY_JVotNgEygaVY3k7LL5l5z9kcqwI4X8kCQz9iUx-8NrDCoCv5tkkZ_VK7a0Q410cc3KVAw2NYqOu7vcrBHnaG-EkJ_rAjf3al1lSz_FY809YoPtTeH1y9nL_RIdAcdu8YVb01gZsUk8ZydHMe5gWSuAVqqsshC_W4VsCSUVsIAbr5qwb7ZMccmwLrD2sgYUxCg1tKVMBjXkT3yKrCFEiNXVs"
  },
  {
    id: "2",
    importance: 2,
    title: "AI-생성 컨셉 #082",
    altText: "Molecular gastronomy coconut cream",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC8-JC-1ekDJUD7zz07LXNuGD2SjTBtHSx6JYKLix8YUFKJ9-hdNZEVqJq2s4eQ4Z08w1o0VVuDIupD5fjed0raqGPmN2lyME9kWNnVlSUFtQS8q0F3COPEFR-ecNbA-eGNcQ3RuM365ewX8w496ReaXU0UPgEIPpHAj6OzqUiYHHsSmT1TtBK_8U3S6ZVX167Y5xpQgYdeSzvVxbbZIoNbPbEpLrGo72XggtcfhNzYD7h6r2ySkbfbbJ4yPnNJ9MrbEaLS5pyv08w"
  },
  {
    id: "3",
    importance: 1,
    title: "AI-생성 컨셉 #109",
    altText: "Futuristic tasting menu course",
    imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuC37p34mv9JwjP0c610lgt6Rl8o6tJV7e5lGv04oW2H7BuUiLXBatn-Ci2TVSIcexMWL2V_rnWYKuV58sAbt38kVOIC5Ndg8bRdTvl50kB0vuqTX7Ao1kvVTiljDuU0m6kdR-fe0g8zJKjWA7agT2AYJ1HGMeACFnxD-nY_itr9dFAl2MejbywacrEhuJjD7HX2oWBrrgwMZCsMn_d90pWxh-wg97rUoziZOa70GjRAtCC0IrzxUqGHoHnBW5OmV0tVMLo0FRXW_Jw"
  }
];

const INITIAL_GUESTBOOK: GuestbookEntry[] = [
  {
    id: "g1",
    author: "Julian V.",
    title: "미슐랭 비평가",
    message: "\"AI 스튜디오가 '분자 노르딕' 스타일을 해석하는 방식은 놀라울 정도로 정확합니다. 질감 시뮬레이션은 차원이 다른 수준이네요.\"",
    timestamp: Date.now() - 86400000,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjAoCJSX0KhN8v-LQyJBdctQfjb77iQ32rf-hdHtSW24Pk45NF-EvH_w8z3FtVkN9-tdGEQqDcg3o96YEwRV3jdsCna9WfCeIS5Uc3cAbxNW5v7R9hEEvrftoj-bVqPiZt-TSSQwioJFdlJ1zTwsMPLeDQITs3vkzkMBdydIiaROGNUQwC8qwukXSH8cDkOCvpgQ4kUEi2pOEyrWKRE0IQdRsuKpDG-xhfy3ZmaquNng2tdaWrnkpW9MZl4eL8OHi-Fb6OpihzIbE"
  },
  {
    id: "g2",
    author: "Sarah K.",
    title: "디자인 리드",
    message: "\"UI 디자인의 걸작입니다. 어둡고 무드 있으며, 요리의 정수를 완벽하게 담아냈습니다. 진정한 미식 디지털 경험입니다.\"",
    timestamp: Date.now() - 172800000,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOkQMQE02ppltFC203gONYl0Q2kYyIaxciBRfK-IdbNCu8Zxr_ZNtvUwDFtioqxS6p__OmY4daddKy_AMDJhYII2Jb5tgfQyZvb5hcz4cyb6sH5bMyTXiBl3OH1g9qkdXLz2hyOwtYPptNonrtRQVYr6u4Q47kwtURvctRdyj1IAXYK0V9vditXgydQlRmAT7wy0E1D3pIIF7XNyaQESVJ5nxUpcmbsS_W_l_BoF72xw3GqsyRs9j2fNdrjnmKyDBQdo1WqCLHjGE"
  }
];

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>({
    portfolio: INITIAL_PORTFOLIO,
    guestbook: INITIAL_GUESTBOOK,
    isGeneratingAI: false,
    aiImageCache: null
  });

  const [toast, setToast] = useState<{ message: string, isError: boolean } | null>(null);

  const addGuestbookEntry = (entry: Omit<GuestbookEntry, 'id' | 'timestamp'>) => {
    setState(prev => {
      const newEntry: GuestbookEntry = {
        ...entry,
        id: Math.random().toString(36).substring(7),
        timestamp: Date.now()
      };
      
      // Sort guestbook items descending by timestamp
      const newGuestbook = [newEntry, ...prev.guestbook].sort((a, b) => b.timestamp - a.timestamp);
      
      return { ...prev, guestbook: newGuestbook };
    });
  };

  const setGeneratingAI = (isGenerating: boolean) => {
    setState(prev => ({ ...prev, isGeneratingAI: isGenerating }));
  };

  const setAiImage = (url: string | null) => {
    setState(prev => ({ ...prev, aiImageCache: url }));
  };

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Portfolio items are sorted by importance descending
  state.portfolio.sort((a, b) => b.importance - a.importance);

  return (
    <AppContext.Provider value={{ state, setState, addGuestbookEntry, setGeneratingAI, setAiImage, showToast }}>
      {children}
      {toast && (
        <div className={`fixed bottom-8 p-4 right-8 z-50 transform transition-transform border-4 border-outline bg-background ${toast.isError ? 'text-secondary' : 'text-on-surface'}`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined font-bold">{toast.isError ? 'error' : 'check_circle'}</span>
            <span className="font-label-caps font-bold uppercase tracking-widest">{toast.message}</span>
          </div>
        </div>
      )}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};
