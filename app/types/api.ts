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
  HOUSE_MANAGE_NO: string;
  PBLANC_NO: string;
  HOUSE_NM: string;
  RCRIT_PBLANC_DE: string;
  PRZWNER_PRESNATN_DE: string;
  HOUSE_SECD?: string;
  HOUSE_DTL_SECD?: string;
  SUBSCRPT_AREA_CODE?: string;
  SUBSCRPT_AREA_CODE_NM?: string;
  RCEPT_BGNDE?: string;
  HSSPLY_ADRES?: string;
  TOT_SUPLY_HSHLDCO?: string;
  PBLANC_URL?: string;
  BSNS_MBY_NM?: string;
  MDHS_TELNO?: string;
  HMPG_ADRES?: string;
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