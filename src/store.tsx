import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, getDocs, doc, updateDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from './firebase';

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
  currentUser: User | null;
  authLoading: boolean;
  isAdmin: boolean;
}

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  addGuestbookEntry: (entry: Omit<GuestbookEntry, 'id' | 'timestamp'>) => Promise<void>;
  addPortfolioItem: (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => Promise<void>;
  updatePortfolioItem: (item: PortfolioItem) => Promise<void>;
  deletePortfolioItem: (itemId: string) => Promise<void>;
  deleteGuestbookEntry: (entryId: string) => Promise<void>;
  setGeneratingAI: (isGenerating: boolean) => void;
  setAiImage: (url: string | null) => void;
  showToast: (message: string, isError?: boolean) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
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
    portfolio: [],
    guestbook: [],
    isGeneratingAI: false,
    aiImageCache: null,
    currentUser: null,
    authLoading: true,
    isAdmin: false
  });

  // Track Firebase Auth state changes and set up Firestore listeners
  useEffect(() => {
    let unsubscribeGuestbook: (() => void) | null = null;
    let unsubscribePortfolio: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      // 1. Unsubscribe from previous subscriptions if user changes
      if (unsubscribeGuestbook) {
        unsubscribeGuestbook();
        unsubscribeGuestbook = null;
      }
      if (unsubscribePortfolio) {
        unsubscribePortfolio();
        unsubscribePortfolio = null;
      }

      if (user) {
        // Designate admin based on email
        const isAdminUser = user.email === 'warmcomfortforyou@gmail.com';
        
        setState(prev => ({
          ...prev,
          currentUser: user,
          authLoading: false,
          isAdmin: isAdminUser
        }));

        // 2. Seed default data for the user atomically using batch writes if empty
        try {
          const portfolioRef = collection(db, 'users', user.uid, 'portfolio');
          const portSnapshot = await getDocs(portfolioRef);
          if (portSnapshot.empty) {
            const batch = writeBatch(db);
            INITIAL_PORTFOLIO.forEach((item) => {
              const newDocRef = doc(portfolioRef);
              batch.set(newDocRef, {
                ...item,
                createdAt: Date.now()
              });
            });
            await batch.commit();
          }

          const guestbookRef = collection(db, 'users', user.uid, 'guestbook');
          const guestSnapshot = await getDocs(guestbookRef);
          if (guestSnapshot.empty) {
            const batch = writeBatch(db);
            INITIAL_GUESTBOOK.forEach((item) => {
              const newDocRef = doc(guestbookRef);
              batch.set(newDocRef, {
                ...item,
                timestamp: Date.now()
              });
            });
            await batch.commit();
          }
        } catch (err) {
          console.error("Error seeding default data for user:", err);
        }

        // 3. Real-time subscription to user-specific guestbook (newest first)
        const qGuestbook = query(collection(db, 'users', user.uid, 'guestbook'), orderBy('timestamp', 'desc'));
        unsubscribeGuestbook = onSnapshot(qGuestbook, (snapshot) => {
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
          showToast("방명록 데이터베이스 동기화에 실패했습니다.", true);
        });

        // 4. Real-time subscription to user-specific portfolio (highest importance first)
        const qPortfolio = query(collection(db, 'users', user.uid, 'portfolio'), orderBy('importance', 'desc'));
        unsubscribePortfolio = onSnapshot(qPortfolio, (snapshot) => {
          const items: PortfolioItem[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data();
            items.push({
              id: doc.id,
              title: data.title || '',
              altText: data.altText || '',
              imageUrl: data.imageUrl || '',
              importance: Number(data.importance) || 0,
              createdAt: data.createdAt || Date.now()
            });
          });
          setState(prev => ({ ...prev, portfolio: items }));
        }, (error) => {
          console.error("Portfolio subscription error:", error);
          showToast("시그니처 컬렉션 동기화에 실패했습니다.", true);
        });

      } else {
        // User logged out
        setState(prev => ({
          ...prev,
          currentUser: null,
          authLoading: false,
          portfolio: [],
          guestbook: [],
          isAdmin: false
        }));
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeGuestbook) unsubscribeGuestbook();
      if (unsubscribePortfolio) unsubscribePortfolio();
    };
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      showToast('구글 계정으로 성공적으로 로그인되었습니다.');
    } catch (e: any) {
      console.error(e);
      showToast('로그인에 실패했습니다. 다시 시도해 주세요.', true);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      showToast('성공적으로 로그아웃되었습니다.');
    } catch (e: any) {
      console.error(e);
      showToast('로그아웃에 실패했습니다.', true);
    }
  };

  const addGuestbookEntry = async (entry: Omit<GuestbookEntry, 'id' | 'timestamp'>) => {
    const user = auth.currentUser;
    if (!user) {
      showToast('로그인이 필요합니다.', true);
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'guestbook'), {
        ...entry,
        timestamp: Date.now()
      });
      showToast('방명록에 소중한 리뷰가 기록되었습니다.');
    } catch (e) {
      console.error(e);
      showToast('기록 저장 중 오류가 발생했습니다.', true);
    }
  };

  const addPortfolioItem = async (item: Omit<PortfolioItem, 'id' | 'createdAt'>) => {
    const user = auth.currentUser;
    if (!user) {
      showToast('로그인이 필요합니다.', true);
      return;
    }
    if (user.email !== 'warmcomfortforyou@gmail.com') {
      showToast('관리자 권한이 없습니다. (warmcomfortforyou@gmail.com 전용)', true);
      return;
    }
    try {
      await addDoc(collection(db, 'users', user.uid, 'portfolio'), {
        ...item,
        createdAt: Date.now()
      });
      showToast('포트폴리오에 성공적으로 저장되었습니다.');
    } catch (e) {
      console.error(e);
      showToast('포트폴리오 저장에 실패했습니다.', true);
    }
  };

  const updatePortfolioItem = async (item: PortfolioItem) => {
    const user = auth.currentUser;
    if (!user) {
      showToast('로그인이 필요합니다.', true);
      return;
    }
    if (user.email !== 'warmcomfortforyou@gmail.com') {
      showToast('관리자 권한이 없습니다.', true);
      return;
    }
    try {
      const docRef = doc(db, 'users', user.uid, 'portfolio', item.id);
      await updateDoc(docRef, {
        title: item.title,
        altText: item.altText,
        importance: Number(item.importance)
      });
      showToast('성공적으로 요리 정보가 수정되었습니다.');
    } catch (e) {
      console.error(e);
      showToast('수정에 실패했습니다.', true);
    }
  };

  const deletePortfolioItem = async (itemId: string) => {
    const user = auth.currentUser;
    if (!user) {
      showToast('로그인이 필요합니다.', true);
      return;
    }
    if (user.email !== 'warmcomfortforyou@gmail.com') {
      showToast('관리자 권한이 없습니다.', true);
      return;
    }
    try {
      const docRef = doc(db, 'users', user.uid, 'portfolio', itemId);
      await deleteDoc(docRef);
      showToast('시그니처 요리가 포트폴리오에서 삭제되었습니다.');
    } catch (e) {
      console.error(e);
      showToast('삭제에 실패했습니다.', true);
    }
  };

  const deleteGuestbookEntry = async (entryId: string) => {
    const user = auth.currentUser;
    if (!user) {
      showToast('로그인이 필요합니다.', true);
      return;
    }
    if (user.email !== 'warmcomfortforyou@gmail.com') {
      showToast('관리자 권한이 없습니다.', true);
      return;
    }
    try {
      const docRef = doc(db, 'users', user.uid, 'guestbook', entryId);
      await deleteDoc(docRef);
      showToast('방명록 리뷰를 삭제했습니다.');
    } catch (e) {
      console.error(e);
      showToast('삭제에 실패했습니다.', true);
    }
  };

  const setGeneratingAI = (isGenerating: boolean) => {
    setState(prev => ({ ...prev, isGeneratingAI: isGenerating }));
  };

  const setAiImage = (url: string | null) => {
    setState(prev => ({ ...prev, aiImageCache: url }));
  };

  return (
    <AppContext.Provider value={{
      state,
      setState,
      addGuestbookEntry,
      addPortfolioItem,
      updatePortfolioItem,
      deletePortfolioItem,
      deleteGuestbookEntry,
      setGeneratingAI,
      setAiImage,
      showToast,
      loginWithGoogle,
      logout
    }}>
      {children}
      {toast && (
        <div className={`fixed bottom-8 p-4 right-8 z-50 transform transition-transform border-4 border-outline bg-background ${toast.isError ? 'text-secondary' : 'text-on-surface'}`}>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined font-bold">{toast.isError ? 'error' : 'check_circle'}</span>
            <span className="font-label-caps font-bold uppercase tracking-widest text-xs">{toast.message}</span>
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
