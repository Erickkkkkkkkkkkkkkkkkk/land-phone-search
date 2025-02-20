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
    setCurrentPage,
    fetchApartments,
    filters
  } = useChatStore();

  const [selectedApartment, setSelectedApartment] = React.useState<ApartmentInfo | null>(null);
  const [filteredApts, setFilteredApts] = React.useState<ApartmentInfo[]>([]);

  // 페이지당 항목 수
  const ITEMS_PER_PAGE = 10;

  // 분양 상태 필터링 함수
  const getSaleStatus = React.useCallback((apt: ApartmentInfo) => {
    const today = new Date();
    const recDate = new Date(apt.RCRIT_PBLANC_DE);
    const annDate = new Date(apt.PRZWNER_PRESNATN_DE);

    if (today < recDate) return 'upcoming';
    if (today > annDate) return 'completed';
    return 'ongoing';
  }, []);

  // 필터링된 아파트 목록 (전체)
  const filteredApartments = React.useMemo(() => {
    console.log('apartmentList 변경됨:', apartmentList);
    console.log('현재 필터 상태:', filters);

    return apartmentList.filter((apt) => {
      // 지역 필터링
      const isRegionMatch = filters.region === '전체' || apt.SUBSCRPT_AREA_CODE_NM === filters.region;
      
      // 기간 필터링
      let isPeriodMatch = true;
      if (filters.period.startDate && filters.period.endDate) {
        const filterStart = new Date(filters.period.startDate);
        const filterEnd = new Date(filters.period.endDate);
        const saleStart = new Date(apt.RCRIT_PBLANC_DE);
        const saleEnd = new Date(apt.PRZWNER_PRESNATN_DE);
        
        isPeriodMatch = saleEnd >= filterStart && saleStart <= filterEnd;
      }

      // 분양 상태 필터링
      const status = getSaleStatus(apt);
      const isStatusMatch = (
        (status === 'upcoming' && filters.saleStatus.upcoming) ||
        (status === 'ongoing' && filters.saleStatus.ongoing) ||
        (status === 'completed' && filters.saleStatus.completed)
      );

      // 디버깅: 분양완료 상태인 경우 상세 정보 출력
      if (status === 'completed') {
        console.log(`분양완료 아파트 정보:`, {
          이름: apt.HOUSE_NM,
          지역: apt.SUBSCRPT_AREA_CODE_NM,
          모집공고일: apt.RCRIT_PBLANC_DE,
          당첨자발표일: apt.PRZWNER_PRESNATN_DE,
          상태매칭: isStatusMatch,
          지역매칭: isRegionMatch,
          기간매칭: isPeriodMatch
        });
      }

      const isMatched = isRegionMatch && isPeriodMatch && isStatusMatch;
      return isMatched;
    });
  }, [apartmentList, filters, getSaleStatus]);

  // 현재 페이지의 아파트 목록
  const currentPageApartments = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredApartments.slice(startIndex, endIndex);
  }, [filteredApartments, currentPage]);

  // 총 페이지 수 계산
  const totalPages = React.useMemo(() => {
    return Math.ceil(filteredApartments.length / ITEMS_PER_PAGE);
  }, [filteredApartments]);

  // filteredApartments가 변경될 때마다 상태 업데이트
  React.useEffect(() => {
    console.log('필터링된 아파트 수:', filteredApartments.length);
    console.log('필터링된 아파트 목록:', filteredApartments);
    
    // 분양완료 아파트 수 확인
    const completedCount = filteredApartments.filter(
      apt => getSaleStatus(apt) === 'completed'
    ).length;
    console.log('분양완료 아파트 수:', completedCount);

    // 현재 페이지가 총 페이지 수를 초과하면 1페이지로 리셋
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }

    setFilteredApts(currentPageApartments);
  }, [filteredApartments, currentPageApartments, currentPage, totalPages, setCurrentPage, getSaleStatus]);

  React.useEffect(() => {
    fetchApartments();
  }, [fetchApartments]);

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

  if (filteredApts.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>검색 조건에 맞는 분양 정보가 없습니다.</p>
      </div>
    );
  }

  console.log('렌더링 시점의 filteredApts:', filteredApts);

  return (
    <div className="space-y-6 p-4">
      {/* 분양 정보 목록 */}
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredApts.map((apt) => (
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