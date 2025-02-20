import { create } from 'zustand';
import { ApartmentInfo } from '../types/apartment';
import { ApartmentApiParams } from '../types/api';
import { fetchApartmentInfo } from '../services/apartmentService';
import { ApiError } from '../services/apartmentService';

interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'bot';
  timestamp: Date;
}

interface SearchFilters {
  region: string;
  period: {
    startDate: string | undefined;
    endDate: string | undefined;
  };
  saleStatus: {
    upcoming: boolean;
    ongoing: boolean;
    completed: boolean;
  };
}

interface ChatStore {
  // 채팅 관련 상태
  messages: ChatMessage[];
  
  // 분양 정보 관련 상태
  apartmentList: ApartmentInfo[];
  filters: SearchFilters;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  
  // 채팅 관련 액션
  addMessage: (content: string, type: 'user' | 'bot') => void;
  clearMessages: () => void;
  
  // 필터 관련 액션
  setRegion: (region: string) => void;
  setPeriod: (startDate: string | undefined, endDate: string | undefined) => void;
  setSaleStatusFilter: (key: 'upcoming' | 'ongoing' | 'completed', value: boolean) => void;
  resetFilters: () => void;
  
  // 페이지네이션 액션
  setCurrentPage: (page: number) => void;
  
  // API 관련 액션
  fetchApartments: () => Promise<void>;
  clearError: () => void;
}

// 신규 추가: 이번 달 범위를 계산하는 함수
type Period = { startDate: string; endDate: string };

const getCurrentMonthRange = (): Period => {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = (now.getMonth() + 1).toString().padStart(2, '0');
  const startDate = `${yyyy}-${mm}-01`;
  const lastDay = new Date(yyyy, now.getMonth() + 1, 0).getDate();
  const endDate = `${yyyy}-${mm}-${lastDay.toString().padStart(2, '0')}`;
  return { startDate, endDate };
};

export const useChatStore = create<ChatStore>((set, get) => ({
  // 초기 상태
  messages: [],
  apartmentList: [],
  filters: {
    region: '전체',
    period: { startDate: undefined, endDate: undefined },
    saleStatus: {
      upcoming: true,
      ongoing: true,
      completed: true
    }
  },
  currentPage: 1,
  totalPages: 1,
  isLoading: false,
  error: null,

  // 채팅 관련 액션
  addMessage: (content, type) => set((state) => ({
    messages: [
      ...state.messages,
      {
        id: crypto.randomUUID(),
        content,
        type,
        timestamp: new Date(),
      },
    ],
  })),
  
  clearMessages: () => set({ messages: [] }),

  // 필터 관련 액션
  setRegion: (region) => {
    set((state) => ({
      filters: { ...state.filters, region: region || '전체' },
      currentPage: 1,
    }));
  },
  
  setPeriod: (startDate: string | undefined, endDate: string | undefined) => {
    set((state) => ({
      filters: {
        ...state.filters,
        period: { startDate, endDate }
      },
      currentPage: 1,
    }));
  },
  
  setSaleStatusFilter: (key: 'upcoming' | 'ongoing' | 'completed', value: boolean) => {
    set((state) => ({
      filters: {
        ...state.filters,
        saleStatus: {
          ...state.filters.saleStatus,
          [key]: value
        }
      },
      currentPage: 1,
    }));
  },
  
  resetFilters: () => set({
    filters: {
      region: '전체',
      period: getCurrentMonthRange(),
      saleStatus: {
        upcoming: true,
        ongoing: true,
        completed: true
      }
    },
    currentPage: 1,
  }),

  // 페이지네이션 액션
  setCurrentPage: (page) => set({ currentPage: page }),

  // API 관련 액션
  fetchApartments: async () => {
    const { filters } = get();
    set({ isLoading: true, error: null });

    try {
      // API 요청 파라미터 구성
      const params: Omit<ApartmentApiParams, 'serviceKey'> & {
        'cond[RCRIT_PBLANC_DE::LTE]'?: string;
        'cond[RCRIT_PBLANC_DE::GTE]'?: string;
      } = {
        page: 1,
        perPage: 1000, // 임시로 큰 값을 설정
        SUBSCRPT_AREA_CODE_NM: filters.region !== '전체' ? filters.region : undefined,
      };

      // 디버깅 로그
      console.log('API 요청 파라미터:', params);
      console.log('지역 선택 상태:', {
        region: filters.region,
        isValid: filters.region !== '전체',
        paramValue: params.SUBSCRPT_AREA_CODE_NM
      });

      // 먼저 전체 데이터 수를 확인하기 위한 요청
      const countResponse = await fetchApartmentInfo({
        ...params,
        perPage: 1
      });

      const totalCount = countResponse.matchCount || 0;

      if (totalCount === 0) {
        set({
          apartmentList: [],
          totalPages: 0,
          currentPage: 1,
          isLoading: false,
          error: '검색 조건에 맞는 분양 정보가 없습니다.'
        });
        return;
      }

      // 전체 데이터를 가져오기 위한 요청
      const response = await fetchApartmentInfo({
        ...params,
        perPage: totalCount
      });

      // 정상적인 경우
      set({
        apartmentList: response.data || [],
        totalPages: 1, // 클라이언트 측에서 페이징 처리하므로 1로 설정
        currentPage: 1,
        isLoading: false,
        error: null
      });

    } catch (error) {
      console.error('Store Error:', error);
      set({
        error: error instanceof ApiError 
          ? error.message 
          : '분양 정보를 불러오는 중 오류가 발생했습니다.',
        isLoading: false,
        apartmentList: [],
        totalPages: 0,
        currentPage: 1,
      });
    }
  },

  clearError: () => set({ error: null }),
})); 