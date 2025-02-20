'use client';

import React from 'react';
import { useChatStore } from '@/app/store/chatStore';
import ApartmentCard from '@/app/components/ApartmentCard';
import ApartmentDetailModal from '@/app/components/ApartmentDetailModal';
import Pagination from '@/app/components/Pagination';
import { ApartmentInfo } from '@/app/types/api';

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

  React.useEffect(() => {
    fetchApartments();
  }, [currentPage, fetchApartments]);

  // 분양 상태 필터링 함수
  const getSaleStatus = React.useCallback((apt: ApartmentInfo) => {
    const today = new Date();
    const recDate = new Date(apt.RCRIT_PBLANC_DE);
    const annDate = new Date(apt.PRZWNER_PRESNATN_DE);

    if (today < recDate) return 'upcoming';
    if (today > annDate) return 'completed';
    return 'ongoing';
  }, []);

  // 필터링된 아파트 목록
  const filteredApartments = React.useMemo(() => {
    return apartmentList.filter((apt) => {
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
  }, [apartmentList, filters.period, filters.saleStatus, getSaleStatus]);

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
          <ApartmentCard
            key={`${apt.HOUSE_MANAGE_NO}-${apt.PBLANC_NO}`}
            apartment={apt}
            onDetailClick={setSelectedApartment}
          />
        ))}
      </div>

      {/* 페이지네이션 */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      {/* 상세 정보 모달 */}
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