export * from './api';

export interface ApartmentInfo {
  HOUSE_MANAGE_NO: string;           // 주택관리번호
  PBLANC_NO: string;                // 공고번호
  HOUSE_NM: string;                 // 주택명
  RCRIT_PBLANC_DE: string;         // 모집공고일
  PRZWNER_PRESNATN_DE: string;     // 당첨자발표일
  SUBSCRPT_AREA_CODE_NM: string;   // 공급지역명
  HOUSE_SECD_NM: string;           // 주택구분명
  HOUSE_DTL_SECD_NM: string;       // 주택상세구분명
  HSSPLY_ADRES: string;            // 공급위치
  TOT_SUPLY_HSHLDCO: number;       // 총공급가구수
  RCRIT_PBLANC_URL: string;        // 모집공고URL
  BSNS_MBY_NM: string;             // 사업주체명
  CNSTRCT_ENTRPS_NM: string;       // 시공업체명
  MDHS_TELNO: string;              // 문의처
  SPSPLY_RCEPT_BGNDE?: string;     // 특별공급 접수시작일
  SPSPLY_RCEPT_ENDDE?: string;     // 특별공급 접수종료일
  GNRL_RCEPT_BGNDE?: string;       // 일반공급 접수시작일
  GNRL_RCEPT_ENDDE?: string;       // 일반공급 접수종료일
} 