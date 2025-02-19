import { ApartmentApiParams, ApartmentApiResponse } from '../types/api';

const BASE_URL = 'https://api.odcloud.kr/api';
const API_KEY = 'qGvXQsatfqC7L8fJoo+GPXf95HWgzNjTNotFONU4y8eKUi+mb1Ph1g+a3cqrSglWZjphsAUspokZQ1nExHom6A==';

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const fetchApartmentInfo = async (
  params: Omit<ApartmentApiParams, 'serviceKey'>
): Promise<ApartmentApiResponse> => {
  try {
    // URL 파라미터 구성
    const searchParams = new URLSearchParams();
    searchParams.append('serviceKey', API_KEY);
    searchParams.append('page', params.page.toString());
    searchParams.append('perPage', params.perPage.toString());
    searchParams.append('returnType', 'JSON');

    // 지역 선택 파라미터 추가 로직 강화
    console.log('지역 선택 파라미터 상세 디버깅:', {
      SUBSCRPT_AREA_CODE_NM: params.SUBSCRPT_AREA_CODE_NM,
      type: typeof params.SUBSCRPT_AREA_CODE_NM,
      isUndefined: params.SUBSCRPT_AREA_CODE_NM === undefined,
      isNull: params.SUBSCRPT_AREA_CODE_NM === null,
      isEmptyString: params.SUBSCRPT_AREA_CODE_NM === '',
      isWhitespace: params.SUBSCRPT_AREA_CODE_NM?.trim() === '',
      isAll: params.SUBSCRPT_AREA_CODE_NM === '전체'
    });

    // 지역 선택 파라미터 추가 조건 세분화
    const areaName = params.SUBSCRPT_AREA_CODE_NM;
    const isValidArea = 
      areaName !== undefined && 
      areaName !== null && 
      areaName.trim() !== '' && 
      areaName !== '전체';

    if (isValidArea) {
      console.log('✅ 지역 파라미터 추가:', areaName);
      searchParams.append('cond[SUBSCRPT_AREA_CODE_NM::EQ]', areaName);
    } else {
      console.log('❌ 지역 파라미터 추가 안 함:', {
        areaName,
        isValidArea
      });
    }

    // 추가: 공고 기간 선택 시 시작일과 종료일을 각각 cond[RCRIT_PBLANC_DE::LTE]와 cond[RCRIT_PBLANC_DE::GTE]에 추가
    const extendedParams = params as Omit<ApartmentApiParams, 'serviceKey'> & {
      'cond[RCRIT_PBLANC_DE::LTE]'?: string;
      'cond[RCRIT_PBLANC_DE::GTE]'?: string;
    };
    if (extendedParams['cond[RCRIT_PBLANC_DE::LTE]']) {
      searchParams.append('cond[RCRIT_PBLANC_DE::LTE]', extendedParams['cond[RCRIT_PBLANC_DE::LTE]']);
    }
    if (extendedParams['cond[RCRIT_PBLANC_DE::GTE]']) {
      searchParams.append('cond[RCRIT_PBLANC_DE::GTE]', extendedParams['cond[RCRIT_PBLANC_DE::GTE]']);
    }

    const requestUrl = `${BASE_URL}/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?${searchParams}`;
    
    // 현재 설정된 모든 파라미터 값 확인을 위한 디버깅
    console.log('현재 설정된 모든 URLSearchParams:');
    searchParams.forEach((value, key) => {
      console.log(`${key}: ${value}`);
    });

    console.log('API Request URL:', requestUrl);
    console.log('API Request Params:', {
      page: params.page,
      perPage: params.perPage,
      'cond[SUBSCRPT_AREA_CODE_NM::EQ]': params.SUBSCRPT_AREA_CODE_NM,
      SEARCH_BEGIN_DATE: params.SEARCH_BEGIN_DATE,
      SEARCH_END_DATE: params.SEARCH_END_DATE,
    });

    // API 요청
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // 응답 처리
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Response:', errorData);
      throw new ApiError(
        '분양 정보 조회에 실패했습니다.',
        response.status,
        errorData
      );
    }

    const data: ApartmentApiResponse = await response.json();
    console.log('API Response:', data);
    return data;
  } catch (error) {
    console.error('API Error:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    
    throw new ApiError(
      '분양 정보를 가져오는 중 오류가 발생했습니다.',
      500,
      error
    );
  }
};

// 지역 코드 맵핑
export const AREA_CODES = {
  '서울': '100',
  '강원': '200',
  '대전': '300',
  '충남': '312',
  '세종': '338',
  '충북': '360',
  '인천': '400',
  '경기': '410',
  '광주': '500',
  '전남': '513',
  '전북': '560',
  '부산': '600',
  '경남': '621',
  '울산': '680',
  '제주': '690',
  '대구': '700',
  '경북': '712',
} as const;

// 주택구분 코드 맵핑
export const HOUSE_CODES = {
  'APT': '01',
  '민간사전청약': '09',
  '신혼희망타운': '10',
  '도시형생활주택': '0201',
  '오피스텔': '0202',
  '민간임대': '0203',
  '생활형숙박시설': '0204',
  '공공지원민간임대': '0303',
} as const;

// 주택상세구분 코드 맵핑
export const HOUSE_DETAIL_CODES = {
  '민영': '01',
  '국민': '03',
} as const;

// 날짜 포맷 유틸리티 함수
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}; 