'use client';

import React from 'react';
import { Globe, Info } from 'lucide-react';
import { ApartmentInfo } from '@/app/types/api';
import SaleStatusBadge from '@/app/components/SaleStatusBadge';
import { formatKoreanPhoneNumber } from '@/app/utils/format';

interface ApartmentCardProps {
  apartment: ApartmentInfo;
  onDetailClick: (apartment: ApartmentInfo) => void;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = React.memo(({ 
  apartment: apt, 
  onDetailClick 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-semibold text-blue-500">{apt.HOUSE_NM}</h3>
          <SaleStatusBadge 
            recruitmentDate={apt.RCRIT_PBLANC_DE}
            announcementDate={apt.PRZWNER_PRESNATN_DE}
          />
        </div>
        <div className="flex gap-3">
          {apt.HMPG_ADRES && (
            <a
              href={apt.HMPG_ADRES}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-blue-500"
              aria-label={`${apt.HOUSE_NM} 홈페이지 방문 (새 창)`}
            >
              <Globe className="w-6 h-6" />
            </a>
          )}
          {apt.PBLANC_URL && (
            <button
              onClick={() => onDetailClick(apt)}
              className="text-gray-600 hover:text-blue-500"
              aria-label={`${apt.HOUSE_NM} 분양정보 보기 (모달 팝업)`}
            >
              <Info className="w-6 h-6" />
            </button>
          )}
        </div>
      </div>
      
      <div className="text-sm">
        {/* Section 1: 시행사 / 연락처 */}
        <div className="p-2 border-t border-gray-300">
          <div className="flex flex-row items-center">
            <span>
              {apt.BSNS_MBY_NM || 'N/A'} / {apt.MDHS_TELNO ? (
                <a href={`tel:${apt.MDHS_TELNO}`} className="text-blue-600 hover:underline">
                  {formatKoreanPhoneNumber(apt.MDHS_TELNO)}
                </a>
              ) : 'N/A'}
            </span>
          </div>
        </div>
        
        {/* Section 2: 지역, 주택구분 */}
        <div className="p-2 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-row">
              <span className="font-medium text-gray-600">지역:</span>
              <span className="ml-2">{apt.SUBSCRPT_AREA_CODE_NM}</span>
            </div>
            <div className="flex flex-row">
              <span className="font-medium text-gray-600">주택구분:</span>
              <span className="ml-2">{apt.HOUSE_SECD_NM || 'N/A'}</span>
            </div>
          </div>
        </div>
        
        {/* Section 3: 모집공고일, 당첨자발표 */}
        <div className="p-2 border-t border-gray-300">
          <div className="grid grid-cols-2 gap-2">
            <div className="flex flex-row">
              <span className="font-medium text-gray-600">모집공고일:</span>
              <span className="ml-2">{apt.RCRIT_PBLANC_DE}</span>
            </div>
            <div className="flex flex-row">
              <span className="font-medium text-gray-600">당첨자발표:</span>
              <span className="ml-2">{apt.PRZWNER_PRESNATN_DE}</span>
            </div>
          </div>
        </div>
        
        {/* Section 4: 계약기간, 입주예정 */}
        <div className="p-2 border-t border-gray-300">
          <div className="space-y-2">
            <div className="flex flex-row">
              <span className="font-medium text-gray-600">계약기간:</span>
              <span className="ml-2">
                {apt.CNTRCT_CNCLS_BGNDE && apt.CNTRCT_CNCLS_ENDDE
                  ? `${apt.CNTRCT_CNCLS_BGNDE} ~ ${apt.CNTRCT_CNCLS_ENDDE}`
                  : 'N/A'}
              </span>
            </div>
            <div className="flex items-center">
              <span className="font-medium text-gray-600">입주예정:</span>
              <span className="ml-2 text-white bg-blue-800 px-3 py-1 rounded-full font-semibold">
                {apt.MVN_PREARNGE_YM ? `${apt.MVN_PREARNGE_YM.slice(0,4)}년 ${apt.MVN_PREARNGE_YM.slice(4)}월` : 'N/A'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ApartmentCard.displayName = 'ApartmentCard';

export default ApartmentCard; 