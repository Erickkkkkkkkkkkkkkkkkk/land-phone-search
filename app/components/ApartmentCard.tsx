'use client';

import React from 'react';
import { Globe, Info } from 'lucide-react';
import { ApartmentInfo, HOUSE_CODES } from '@/app/types/api';
import SaleStatusBadge from '@/app/components/SaleStatusBadge';
import { formatKoreanPhoneNumber } from '@/app/utils/format';

interface ApartmentCardProps {
  apartment: ApartmentInfo;
  onDetailClick: (apartment: ApartmentInfo) => void;
}

// 주택구분 코드를 이름으로 변환하는 함수 추가
const getHouseTypeName = (code?: string): string => {
  if (!code) return 'N/A';
  
  // HOUSE_CODES 객체의 키-값 쌍을 순회하며 코드에 해당하는 이름 찾기
  for (const [name, houseCode] of Object.entries(HOUSE_CODES)) {
    if (houseCode === code) {
      return name;
    }
  }
  
  return code; // 매칭되는 코드가 없으면 원래 코드 반환
};

export const ApartmentCard: React.FC<ApartmentCardProps> = React.memo(({ 
  apartment: apt, 
  onDetailClick 
}) => {
  console.log('ApartmentCard rendered with apartment:', apt);

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
          {apt.PBLANC_URL && (
            <a
              href={apt.PBLANC_URL}
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
              <span className="ml-2">{apt.SUBSCRPT_AREA_CODE}</span>
            </div>
            <div className="flex flex-row">
              <span className="font-medium text-gray-600">주택구분:</span>
              <span className="ml-2">{getHouseTypeName(apt.HOUSE_SECD) || 'N/A'}</span>
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
            {/* Contract info removed */}
          </div>
        </div>
      </div>
    </div>
  );
});

ApartmentCard.displayName = 'ApartmentCard';

export default ApartmentCard; 