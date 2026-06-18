import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  altText: string;
  title: string;
  importance: number;
  createdAt?: number;
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
  addGuestbookEntry: (entry: Omit<GuestbookEntry, 'id' | 'timestamp'>) => Promise<void>;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => Promise<void>;
  setGeneratingAI: (isGenerating: boolean) => void;
  setAiImage: (url: string | null) => void;
  showToast: (message: string, isError?: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_PORTFOLIO: Omit<PortfolioItem, 'id'>[] = [
  {
    importance: 3,
    title: "현대적 떡갈비 (Contemporary Korean Beef)",
    altText: "고급 블랙 마늘 퓌레와 야생 버섯, 신선한 마이크로 허브를 곁들인 수비드 한우 떡갈비.",
    imageUrl: "/images/signature_beef.png"
  },
  {
    importance: 2,
    title: "유자 폼을 곁들인 관자 구이 (Seared Scallop with Yuzu Foam)",
    altText: "팬에 시어링한 관자 위에 상큼한 유자 에어(foam)와 바다 포도, 허브 오일 드롭으로 마감한 현대식 요리.",
    imageUrl: "/images/signature_scallop.png"
  },
  {
    importance: 1,
    title: "루비 스피어 디저트 (Ruby Sphere Dessert)",
    altText: "초콜릿 흙(soil) 위에 올린 투명한 루비 색상의 초콜릿 무스 구체와 식용 금박, 꽃잎 데코레이션.",
    imageUrl: "/images/signature_dessert.png"
  }
];

const INITIAL_GUESTBOOK: Omit<GuestbookEntry, 'id'>[] = [
  {
    author: "Julian V.",
    title: "미슐랭 가이드 비평가",
    message: "\"셰프 강민우의 현대적 떡갈비는 전통과 현대 조리 과학의 경계를 허무는 놀라운 완성도를 보여줍니다. 퓌레의 텍스처가 압권입니다.\"",
    timestamp: Date.now() - 86400000,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjAoCJSX0KhN8v-LQyJBdctQfjb77iQ32rf-hdHtSW24Pk45NF-EvH_w8z3FtVkN9-tdGEQqDcg3o96YEwRV3jdsCna9WfCeIS5Uc3cAbxNW5v7R9hEEvrftoj-bVqPiZt-TSSQwioJFdlJ1zTwsMPLeDQITs3vkzkMBdydIiaROGNUQwC8qwukXSH8cDkOCvpgQ4kUEi2pOEyrWKRE0IQdRsuKpDG-xhfy3ZmaquNng2tdaWrnkpW9MZl4eL8OHi-Fb6OpihzIbE"
  },
  {
    author: "김지선",
    title: "푸드 칼럼니스트",
    message: "\"유자 폼과 관자 구이의 조합은 입안에서 바다와 신선한 시트러스 향이 폭발하는 경험이었습니다. 시각과 미각을 동시에 사로잡네요.\"",
    timestamp: Date.now() - 172800000,
    avatarUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOkQMQE02ppltFC203gONYl0Q2kYyIaxciBRfK-IdbNCu8Zxr_ZNtvUwDFtioqxS6p__OmY4daddKy_AMDJhYII2Jb5tgfQyZvb5hcz4cyb6sH5bMyTXiBl3OH1g9qkdXLz2hyOwtYPptNonrtRQVYr6u4Q47kwtURvctRdyj1IAXYK0V9vditXgydQlRmAT7wy0E1D3pIIF7XNyaQESVJ5nxUpcmbsS_W_l_BoF72xw3GqsyRs9j2fNdrjnmKyDBQdo1WqCLHjGE"
  }
];

export const AppStateProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string, isError: boolean } | null>(null);

  const showToast = (message: string, isError = false) => {
    setToast({ message, isError });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const [state, setState] = useState<AppState>({
    portfolio: INITIAL_PORTFOLIO.map((item, idx) => ({ 
      ...item, 
      id: `local-port-${idx}`, 
      createdAt: Date.now() - idx * 1000 
    })),
    guestbook: INITIAL_GUESTBOOK.map((item, idx) => ({ 
      ...item, 
      id: `local-gb-${idx}` 
    })),
    isGeneratingAI: false,
    aiImageCache: null
  });

  // Firestore initialization checks and real-time subscription
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        const portfolioRef = collection(db, 'portfolio');
        const portSnapshot = await getDocs(portfolioRef);
        if (portSnapshot.empty) {
          for (const item of INITIAL_PORTFOLIO) {
            await addDoc(portfolioRef, {
              ...item,
              createdAt: Date.now()
            });
          }
        }

        const guestbookRef = collection(db, 'guestbook');
        const guestSnapshot = await getDocs(guestbookRef);
        if (guestSnapshot.empty) {
          for (const item of INITIAL_GUESTBOOK) {
            await addDoc(guestbookRef, item);
          }
        }
      } catch (err) {
        console.error("Error initializing Firestore collection defaults:", err);
      }
    };

    initializeDatabase();

    // Subscribe to guestbook (newest first)
    const qGuestbook = query(collection(db, 'guestbook'), orderBy('timestamp', 'desc'));
    const unsubscribeGuestbook = onSnapshot(qGuestbook, (snapshot) => {
      const entries: GuestbookEntry[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        entries.push({
          id: doc.id,
          author: data.author || '',
          title: data.title || '',
          message: data.message || '',
          timestamp: data.timestamp || Date.now(),
          avatarUrl: data.avatarUrl || ''
        });
      });
      setState(prev => ({ ...prev, guestbook: entries }));
    }, (error) => {
      console.error("Guestbook subscription error:", error);
      showToast("소명록 데이터베이스를 동기화하지 못했습니다. 오프라인 모드로 자동 전환됩니다.", true);
    });

    // Subscribe to portfolio (highest importance first)
    const qPortfolio = query(collection(db, 'portfolio'), orderBy('importance', 'desc'));
    const unsubscribePortfolio = onSnapshot(qPortfolio, (snapshot) => {
      const items: PortfolioItem[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        items.push({
          id: doc.id,
          title: data.title || '',
          altText: data.altText || '',
          imageUrl: data.imageUrl || '',
          importance: data.importance || 0,
          createdAt: data.createdAt || Date.now()
        });
      });
      setState(prev => ({ ...prev, portfolio: items }));
    }, (error) => {
      console.error("Portfolio subscription error:", error);
      showToast("시그니처 컬렉션 데이터베이스 동기화에 실패하여 로컬 데이터를 불러옵니다.", true);
    });

    return () => {
      unsubscribeGuestbook();
      unsubscribePortfolio();
    };
  }, []);

  const addGuestbookEntry = async (entry: Omit<GuestbookEntry, 'id' | 'timestamp'>) => {
    try {
      await addDoc(collection(db, 'guestbook'), {
        ...entry,
        timestamp: Date.now()
      });
      showToast('소중한 의견이 기록되었습니다.');
    } catch (e) {
      console.error(e);
      showToast('오류가 발생했습니다. 다시 시도해주세요.', true);
    }
  };

  const addPortfolioItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'portfolio'), {
        ...item,
        createdAt: Date.now()
      });
      showToast('포트폴리오에 성공적으로 저장되었습니다.');
    } catch (e) {
      console.error(e);
      showToast('포트폴리오 저장에 실패했습니다.', true);
    }
  };

  const setGeneratingAI = (isGenerating: boolean) => {
    setState(prev => ({ ...prev, isGeneratingAI: isGenerating }));
  };

  const setAiImage = (url: string | null) => {
    setState(prev => ({ ...prev, aiImageCache: url }));
  };

  return (
    <AppContext.Provider value={{ state, setState, addGuestbookEntry, addPortfolioItem, setGeneratingAI, setAiImage, showToast }}>
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
