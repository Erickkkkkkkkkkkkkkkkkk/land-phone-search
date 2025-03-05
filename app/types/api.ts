export interface ApartmentApiParams {
  page: number;
  perPage: number;
  serviceKey: string;
  returnType?: string;
  SUBSCRPT_AREA_CODE_NM?: string; // 공급지역 이름
  HOUSE_DTL_SECD_LIST?: string[]; // 주택상세구분 코드
  HOUSE_SECD_LIST?: string[]; // 주택구분 코드
  SEARCH_BEGIN_DATE?: string; // 검색 시작일
  SEARCH_END_DATE?: string; // 검색 종료일
  'cond[RCRIT_PBLANC_DE::LTE]'?: string;
  'cond[RCRIT_PBLANC_DE::GTE]'?: string;
}

export interface ApartmentApiResponse {
  page: number;
  perPage: number;
  totalCount: number;
  currentCount: number;
  matchCount: number;
  data: ApartmentInfo[];
}

export interface ApartmentInfo {
  HOUSE_MANAGE_NO: string;           // 주택관리번호
  PBLANC_NO: string;                // 공고번호
  HOUSE_NM: string;                 // 주택명
  RCRIT_PBLANC_DE: string;         // 모집공고일
  PRZWNER_PRESNATN_DE: string;     // 당첨자발표일
  HOUSE_SECD?: string;             // 주택구분코드
  HOUSE_DTL_SECD?: string;         // 주택상세구분코드
  HOUSE_SECD_NM?: string;          // 주택구분명
  HOUSE_DTL_SECD_NM?: string;      // 주택상세구분명
  SUBSCRPT_AREA_CODE?: string;     // 공급지역코드
  SUBSCRPT_AREA_CODE_NM?: string;  // 공급지역명
  RCEPT_BGNDE?: string;            // 접수시작일
  HSSPLY_ADRES?: string;           // 공급위치
  TOT_SUPLY_HSHLDCO?: string;      // 총공급가구수
  PBLANC_URL?: string;             // 공고URL
  RCRIT_PBLANC_URL?: string;       // 모집공고URL
  BSNS_MBY_NM?: string;            // 사업주체명
  CNSTRCT_ENTRPS_NM?: string;      // 시공업체명
  MDHS_TELNO?: string;             // 문의처
  HMPG_ADRES?: string;             // 홈페이지주소
  SPSPLY_RCEPT_BGNDE?: string;     // 특별공급 접수시작일
  SPSPLY_RCEPT_ENDDE?: string;     // 특별공급 접수종료일
  GNRL_RCEPT_BGNDE?: string;       // 일반공급 접수시작일
  GNRL_RCEPT_ENDDE?: string;       // 일반공급 접수종료일
}

export type AreaCode = keyof typeof AREA_CODES;
export type HouseCode = keyof typeof HOUSE_CODES;
export type HouseDetailCode = keyof typeof HOUSE_DETAIL_CODES;

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

export const HOUSE_DETAIL_CODES = {
  '민영': '01',
  '국민': '03'
} as const;

export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}; 