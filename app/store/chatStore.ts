import { create } from 'zustand';
import { ApartmentInfo, ApartmentApiParams } from '../types/api';
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
    period: getCurrentMonthRange()
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
    get().fetchApartments();
  },
  
  setPeriod: (startDate: string | undefined, endDate: string | undefined) => {
    set((state) => ({
      filters: {
        ...state.filters,
        period: { startDate, endDate }
      },
      currentPage: 1,
    }));
    get().fetchApartments();
  },
  
  resetFilters: () => set({
    filters: {
      region: '전체',
      period: getCurrentMonthRange()
    },
    currentPage: 1,
  }),

  // 페이지네이션 액션
  setCurrentPage: (page) => set({ currentPage: page }),

  // API 관련 액션
  fetchApartments: async () => {
    const { filters, currentPage } = get();
    set({ isLoading: true, error: null });

    try {
      // 필터 상태 디버깅
      console.log('현재 필터 상태:', {
        region: filters.region,
        period: filters.period,
        isRegionValid: filters.region !== '전체',
      });

      // API 요청 파라미터 구성
      const params: Omit<ApartmentApiParams, 'serviceKey'> & {
        'cond[RCRIT_PBLANC_DE::LTE]'?: string;
        'cond[RCRIT_PBLANC_DE::GTE]'?: string;
      } = {
        page: currentPage,
        perPage: 10,
        SUBSCRPT_AREA_CODE_NM: filters.region !== '전체' ? filters.region : undefined,
      };

      // 공고 기간 파라미터 추가
      if (filters.period.startDate) {
        params['cond[RCRIT_PBLANC_DE::GTE]'] = filters.period.startDate;
      }
      if (filters.period.endDate) {
        params['cond[RCRIT_PBLANC_DE::LTE]'] = filters.period.endDate;
      }

      // 디버깅 로그
      console.log('API 요청 파라미터:', params);
      console.log('지역 선택 상태:', {
        region: filters.region,
        isValid: filters.region !== '전체',
        paramValue: params.SUBSCRPT_AREA_CODE_NM
      });

      const response = await fetchApartmentInfo(params);

      // 실제 데이터 수에 기반한 페이지 계산
      const matchCount = response.matchCount || 0;
      const totalPages = Math.ceil(matchCount / 10);
      
      // 데이터가 없는 경우
      if (matchCount === 0) {
        set({
          apartmentList: [],
          totalPages: 0,
          currentPage: 1,
          isLoading: false,
          error: '검색 조건에 맞는 분양 정보가 없습니다.'
        });
        return;
      }

      // 현재 페이지가 총 페이지 수를 초과한 경우
      if (currentPage > totalPages) {
        set({
          apartmentList: response.data || [],
          totalPages,
          currentPage: totalPages,
          isLoading: false,
          error: '마지막 페이지입니다.'
        });
        return;
      }

      // 정상적인 경우
      set({
        apartmentList: response.data || [],
        totalPages,
        currentPage,
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