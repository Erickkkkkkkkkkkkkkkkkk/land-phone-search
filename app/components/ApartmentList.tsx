'use client';

import React from 'react';
import { useChatStore } from '@/app/store/chatStore';
import { Button } from '@/app/components/ui/button';
import { Globe, Info } from 'lucide-react';
import ApartmentDetailModal from '@/app/components/ApartmentDetailModal';
import { ApartmentInfo } from '@/app/types/api';
import SaleStatusBadge from '@/app/components/SaleStatusBadge';

export const ApartmentList = () => {
  const {
    apartmentList,
    isLoading,
    error,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchApartments,
    filters
  } = useChatStore();

  const [selectedApartment, setSelectedApartment] = React.useState<ApartmentInfo | null>(null);
  const formatKoreanPhoneNumber = (phone: string): string => {
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length === 8) {
      return cleaned.replace(/(\d{4})(\d{4})/, '$1-$2');
    } else if (cleaned.startsWith('02')) {
      if (cleaned.length === 9) {
        return cleaned.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3');
      } else if (cleaned.length === 10) {
        return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
      }
    } else {
      if (cleaned.length === 10) {
        return cleaned.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
      } else if (cleaned.length === 11) {
        return cleaned.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      }
    }
    return phone;
  };

  React.useEffect(() => {
    fetchApartments();
  }, [currentPage, fetchApartments]);

  // 분양 기간 필터링: filters.period가 있다면, 아파트의 판매 기간과 필터 기간이 겹치는지 체크
  const filteredApartments = apartmentList.filter((apt) => {
    if (filters.period.startDate && filters.period.endDate) {
      const filterStart = new Date(filters.period.startDate);
      const filterEnd = new Date(filters.period.endDate);
      const saleStart = new Date(apt.RCRIT_PBLANC_DE);
      const saleEnd = new Date(apt.PRZWNER_PRESNATN_DE);
      return saleEnd >= filterStart && saleStart <= filterEnd;
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 bg-red-50 rounded-lg">
        <p className="font-medium">오류가 발생했습니다</p>
        <p className="text-sm mt-1">{error}</p>        
      </div>
    );
  }

  if (filteredApartments.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>검색 조건에 맞는 분양 정보가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      {/* 분양 정보 목록 */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredApartments.map((apt) => (
          <div
            key={`${apt.HOUSE_MANAGE_NO}-${apt.PBLANC_NO}`}
            className="bg-white rounded-lg shadow-sm border border-gray-300 p-6 hover:shadow-lg transition-shadow"
          >
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
                    onClick={() => setSelectedApartment(apt)}
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
        ))}
      </div>

      {/* 페이지네이션 */}
      <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-8">
        <Button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
          variant="outline"
          className="w-full md:w-auto"
        >
          이전
        </Button>
        <span className="px-4 py-2 text-gray-600">
          {currentPage} / {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          variant="outline"
          className="w-full md:w-auto"
        >
          다음
        </Button>
      </div>

      {selectedApartment && (
        <ApartmentDetailModal
          apartment={selectedApartment}
          isOpen={true}
          onClose={() => setSelectedApartment(null)}
        />
      )}
    </div>
  );
};

export default ApartmentList; 