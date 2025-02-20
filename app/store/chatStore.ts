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
      // '전체'가 아닌 경우, 기존 데이터를 필터링하여 사용
      const currentData = get().apartmentList;
      if (filters.region !== '전체' && currentData.length > 0) {
        const filteredData = currentData.filter(
          apt => apt.SUBSCRPT_AREA_CODE_NM === filters.region
        );

        set({
          apartmentList: filteredData,
          totalPages: Math.ceil(filteredData.length / 10),
          currentPage: 1,
          isLoading: false,
          error: filteredData.length === 0 ? '검색 조건에 맞는 분양 정보가 없습니다.' : null
        });
        return;
      }

      // '전체' 선택 시 또는 초기 데이터가 없는 경우에만 API 호출
      const params: Omit<ApartmentApiParams, 'serviceKey'> & {
        'cond[RCRIT_PBLANC_DE::LTE]'?: string;
        'cond[RCRIT_PBLANC_DE::GTE]'?: string;
      } = {
        page: 1,
        perPage: 1000, // 전체 데이터를 한 번에 가져옴
      };

      // 공고 기간 파라미터 계산 (오늘 날짜 기준으로 1년)
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentMonth = today.getMonth();
      const computedStartDate = `${currentYear}-01-01`;
      const computedEndDate = currentMonth >= 9 ? `${currentYear + 1}-12-31` : `${currentYear}-12-31`;
      params['cond[RCRIT_PBLANC_DE::GTE]'] = computedStartDate;
      params['cond[RCRIT_PBLANC_DE::LTE]'] = computedEndDate;

      // 디버깅 로그
      console.log('API 요청 파라미터:', params);

      const response = await fetchApartmentInfo(params);
      const matchCount = response.matchCount || 0;
      
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

      // API 응답 데이터 변환
      const convertedData: ApartmentInfo[] = (response.data || []).map((item: Partial<ApartmentInfo>) => ({
        HOUSE_MANAGE_NO: item.HOUSE_MANAGE_NO || '',
        PBLANC_NO: item.PBLANC_NO || '',
        HOUSE_NM: item.HOUSE_NM || '',
        HOUSE_SECD: item.HOUSE_SECD || '',
        HOUSE_SECD_NM: item.HOUSE_SECD_NM || '',
        HOUSE_DTL_SECD: item.HOUSE_DTL_SECD || '',
        HOUSE_DTL_SECD_NM: item.HOUSE_DTL_SECD_NM || '',
        SUBSCRPT_AREA_CODE: item.SUBSCRPT_AREA_CODE || '',
        SUBSCRPT_AREA_CODE_NM: item.SUBSCRPT_AREA_CODE_NM || '',
        RCRIT_PBLANC_DE: item.RCRIT_PBLANC_DE || '',
        RCEPT_BGNDE: item.RCEPT_BGNDE || '',
        RCEPT_ENDDE: item.RCEPT_ENDDE || '',
        PRZWNER_PRESNATN_DE: item.PRZWNER_PRESNATN_DE || '',
        CNTRCT_CNCLS_BGNDE: item.CNTRCT_CNCLS_BGNDE || '',
        CNTRCT_CNCLS_ENDDE: item.CNTRCT_CNCLS_ENDDE || '',
        HMPG_ADRES: item.HMPG_ADRES || '',
        PBLANC_URL: item.PBLANC_URL || '',
        MDHS_TELNO: item.MDHS_TELNO || '',
        CNSTRCT_ENTRPS_NM: item.CNSTRCT_ENTRPS_NM || '',
        BSNS_MBY_NM: item.BSNS_MBY_NM || '',
        MVN_PREARNGE_YM: item.MVN_PREARNGE_YM || ''
      }));

      // 정상적인 경우 상태 업데이트
      set({
        apartmentList: convertedData,
        totalPages: Math.ceil(matchCount / 10),
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