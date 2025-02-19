'use client';

import { create } from 'zustand';
import { ApartmentInfo, ApartmentApiParams, AREA_CODES } from '../types/api';
import { fetchApartmentInfo } from '../services/apartmentService';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface ChatStore {
  // 기존 상태
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
  
  // 분양 정보 관련 상태
  apartmentList: ApartmentInfo[];
  selectedRegion: string | null;
  selectedPeriod: {
    startDate: string | null;
    endDate: string | null;
  };
  selectedHouseType: string | null;
  currentPage: number;
  totalPages: number;
  
  // 액션
  setMessages: (messages: ChatMessage[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // 분양 정보 관련 액션
  setSelectedRegion: (region: string | null) => void;
  setSelectedPeriod: (period: { startDate: string | null; endDate: string | null }) => void;
  setSelectedHouseType: (houseType: string | null) => void;
  fetchApartments: () => Promise<void>;
  setCurrentPage: (page: number) => void;
}

const useChatStore = create<ChatStore>((set, get) => ({
  // 기존 상태 초기값
  messages: [],
  loading: false,
  error: null,
  
  // 분양 정보 관련 상태 초기값
  apartmentList: [],
  selectedRegion: null,
  selectedPeriod: {
    startDate: null,
    endDate: null,
  },
  selectedHouseType: null,
  currentPage: 1,
  totalPages: 1,
  
  // 기존 액션
  setMessages: (messages) => set({ messages }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // 분양 정보 관련 액션
  setSelectedRegion: (region) => set({ selectedRegion: region }),
  setSelectedPeriod: (period) => set({ selectedPeriod: period }),
  setSelectedHouseType: (houseType) => set({ selectedHouseType: houseType }),
  setCurrentPage: (page) => set({ currentPage: page }),
  
  fetchApartments: async () => {
    const state = get();
    set({ loading: true, error: null });
    
    try {
      const requestParams: ApartmentApiParams = {
        page: state.currentPage,
        perPage: 10,
        serviceKey: process.env.NEXT_PUBLIC_API_SERVICE_KEY || '',
      };

      // 지역 선택 시 파라미터 추가 (전체 제외)
      if (state.selectedRegion && state.selectedRegion !== '전체') {
        console.log('선택된 지역:', state.selectedRegion);
        
        // 지역 코드 변환
        const regionCode = state.selectedRegion;
        if (regionCode) {
          // 명시적으로 cond[SUBSCRPT_AREA_CODE_NM::EQ] 파라미터 추가
          requestParams['cond[SUBSCRPT_AREA_CODE_NM::EQ]'] = regionCode;
        } else {
          console.warn(`지역 코드를 찾을 수 없음: ${state.selectedRegion}`);
        }
        
        console.log('최종 파라미터:', requestParams);
      }

      // 기존 파라미터 추가 로직
      if (state.selectedHouseType) {
        requestParams.HOUSE_SECD_LIST = [state.selectedHouseType];
      }

      if (state.selectedPeriod.startDate) {
        requestParams.SEARCH_BEGIN_DATE = state.selectedPeriod.startDate;
      }

      if (state.selectedPeriod.endDate) {
        requestParams.SEARCH_END_DATE = state.selectedPeriod.endDate;
      }
      
      console.log('최종 API 요청 파라미터:', requestParams);
      const response = await fetchApartmentInfo(requestParams);
      
      set({
        apartmentList: response.data,
        totalPages: Math.ceil(response.totalCount / 10),
        loading: false,
      });
    } catch {
      set({
        error: '분양 정보를 불러오는 중 오류가 발생했습니다.',
        loading: false,
      });
    }
  },
}));

export default useChatStore; 