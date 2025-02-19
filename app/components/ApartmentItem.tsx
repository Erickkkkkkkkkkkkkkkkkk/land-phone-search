'use client';

import React from 'react';
import { ApartmentInfo } from '@/app/types/api';

// 분양 상태 타입을 정의합니다.
type ApartmentStatusType = 'upcoming' | 'inProgress' | 'completed';

// 분양 상태를 결정하는 헬퍼 함수입니다.
const getApartmentStatus = (apartment: ApartmentInfo): ApartmentStatusType => {
  // 모집공고일과 당첨자발표일을 날짜 객체로 변환합니다.
  const recruitmentDate = new Date(apartment.RCRIT_PBLANC_DE);
  const announcementDate = new Date(apartment.PRZWNER_PRESNATN_DE);
  // 오늘 날짜를 연,월,일만 고려하여 생성합니다.
  const today = new Date();
  const todayNormalized = new Date(today.getFullYear(), today.getMonth(), today.getDate());

  if (todayNormalized < recruitmentDate) {
    return 'upcoming';
  } else if (todayNormalized > announcementDate) {
    return 'completed';
  } else {
    return 'inProgress';
  }
};

interface ApartmentItemProps {
  apartment: ApartmentInfo;
}

export const ApartmentItem: React.FC<ApartmentItemProps> = ({ apartment }) => {
  const status = getApartmentStatus(apartment);

  let statusIcon = '';
  let statusLabel = '';

  if (status === 'upcoming') {
    statusIcon = '⏳'; // 분양 예정
    statusLabel = '분양 예정';
  } else if (status === 'inProgress') {
    statusIcon = '🏗️'; // 분양 중
    statusLabel = '분양 중';
  } else if (status === 'completed') {
    statusIcon = '✅'; // 분양 완료
    statusLabel = '분양 완료';
  }

  return (
    <div className="flex items-center p-4 border rounded shadow-sm">
      <div className="flex-1">
        <h4 className="text-lg font-semibold">{apartment.HOUSE_NM}</h4>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-xl" title={statusLabel}>{statusIcon}</span>
        <span className="text-sm text-gray-600">{statusLabel}</span>
      </div>
    </div>
  );
};

export default ApartmentItem; 