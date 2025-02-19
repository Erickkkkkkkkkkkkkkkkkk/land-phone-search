import { ApartmentApiParams, ApartmentApiResponse, formatDate } from '../types/api';

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

// 날짜 범위 계산 유틸리티 함수 추가
const calculateDateRange = () => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  let startDate: Date;
  let endDate: Date;

  if (currentMonth >= 9) {
    // 9월 이후: 현재 연도의 1월 1일부터 다음 연도 12월 31일까지
    startDate = new Date(currentYear, 0, 1);
    endDate = new Date(currentYear + 1, 11, 31);
  } else if (currentMonth < 4) {
    // 4월 이전: 지난해 9월 1일부터 현재 연도 12월 31일까지
    startDate = new Date(currentYear - 1, 8, 1);
    endDate = new Date(currentYear, 11, 31);
  } else {
    // 4월부터 8월 사이: 현재 연도의 1월 1일부터 현재 연도 12월 31일까지
    startDate = new Date(currentYear, 0, 1);
    endDate = new Date(currentYear, 11, 31);
  }

  return {
    startDate: formatDate(startDate),
    endDate: formatDate(endDate)
  };
};

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

    // 지역 선택 파라미터 추가 로직
    const areaName = params.SUBSCRPT_AREA_CODE_NM;
    const isValidArea = 
      areaName !== undefined && 
      areaName !== null && 
      areaName.trim() !== '' && 
      areaName !== '전체';

    if (isValidArea) {
      searchParams.append('cond[SUBSCRPT_AREA_CODE_NM::EQ]', areaName);
    }

    // 날짜 범위 계산
    const { startDate, endDate } = calculateDateRange();

    // 날짜 파라미터 추가
    searchParams.append('cond[RCRIT_PBLANC_DE::GTE]', startDate);
    searchParams.append('cond[RCRIT_PBLANC_DE::LTE]', endDate);

    const requestUrl = `${BASE_URL}/ApplyhomeInfoDetailSvc/v1/getAPTLttotPblancDetail?${searchParams}`;
    
    // 디버깅 로그
    console.log('날짜 범위:', { startDate, endDate });
    console.log('API Request URL:', requestUrl);

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