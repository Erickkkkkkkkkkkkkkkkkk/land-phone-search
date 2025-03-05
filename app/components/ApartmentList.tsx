'use client';

import React from 'react';
import { useChatStore } from '@/app/store/chatStore';
import { Button } from '@/app/components/ui/button';
import { Globe, Info } from 'lucide-react';
import ApartmentDetailModal from '@/app/components/ApartmentDetailModal';
import { ApartmentInfo, HOUSE_CODES } from '@/app/types/api';
import SaleStatusBadge from '@/app/components/SaleStatusBadge';

export const ApartmentList = () => {
  const {
    apartmentList,
    currentPage,
    setCurrentPage,
    fetchApartments,
    filters,
    isLoading,
    error
  } = useChatStore();

  const [selectedApartment, setSelectedApartment] = React.useState<ApartmentInfo | null>(null);
  
  // 화면 크기에 따른 페이지당 아이템 수 설정
  const [itemsPerPage, setItemsPerPage] = React.useState<number>(typeof window !== 'undefined' && window.innerWidth >= 1024 ? 9 : 10);

  React.useEffect(() => {
    // 페이지 변경 시에만 API 호출 (전체 선택 상태일 때)
    if (filters.region === '전체' && currentPage > 1) {
      fetchApartments();
    }
  }, [currentPage, fetchApartments, filters.region]);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerPage(9);
      } else {
        setItemsPerPage(10);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 분양 상태 필터링 함수
  const getSaleStatus = (apt: ApartmentInfo) => {
    const today = new Date();
    const recDate = new Date(apt.RCRIT_PBLANC_DE);
    const annDate = new Date(apt.PRZWNER_PRESNATN_DE);

    if (today < recDate) return 'upcoming';
    if (today > annDate) return 'completed';
    return 'ongoing';
  };

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

  // 필터링된 아파트 목록 계산
  const filteredApartments = React.useMemo(() => {
    return apartmentList.filter((apt) => {
      // 지역 필터링
      if (filters.region !== '전체' && apt.SUBSCRPT_AREA_CODE_NM !== filters.region) {
        return false;
      }

      // 기간 필터링
      if (filters.period.startDate && filters.period.endDate) {
        const filterStart = new Date(filters.period.startDate);
        const filterEnd = new Date(filters.period.endDate);
        const saleStart = new Date(apt.RCRIT_PBLANC_DE);
        const saleEnd = new Date(apt.PRZWNER_PRESNATN_DE);
        
        if (!(saleEnd >= filterStart && saleStart <= filterEnd)) {
          return false;
        }
      }

      // 분양 상태 필터링
      const status = getSaleStatus(apt);
      return filters.saleStatus[status];
    });
  }, [apartmentList, filters]);

  // 현재 페이지의 아파트 목록 계산
  const currentPageApartments = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredApartments.slice(startIndex, endIndex);
  }, [filteredApartments, currentPage, itemsPerPage]);

  // 총 페이지 수 계산
  const totalFilteredPages = React.useMemo(() => {
    return Math.ceil(filteredApartments.length / itemsPerPage);
  }, [filteredApartments, itemsPerPage]);

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
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {currentPageApartments.map((apt) => (
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
              
              <div className="p-2 border-t border-gray-300">
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-row">
                    <span className="font-medium text-gray-600">지역:</span>
                    <span className="ml-2">{apt.SUBSCRPT_AREA_CODE_NM}</span>
                  </div>
                  <div className="flex flex-row">
                    <span className="font-medium text-gray-600">주택구분:</span>
                    <span className="ml-2">{getHouseTypeName(apt.HOUSE_SECD) || 'N/A'}</span>
                  </div>
                </div>
              </div>
              
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
            </div>
          </div>
        ))}
      </div>

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
          {currentPage} / {totalFilteredPages}
        </span>
        <Button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === totalFilteredPages}
          variant="outline"
          className="w-full md:w-auto"
        >
          다음
        </Button>
      </div>

      {selectedApartment && (
        <ApartmentDetailModal
          apartment={selectedApartment as unknown as import("@/app/types/api").ApartmentInfo}
          isOpen={true}
          onClose={() => setSelectedApartment(null)}
        />
      )}
    </div>
  );
};

export default ApartmentList; 