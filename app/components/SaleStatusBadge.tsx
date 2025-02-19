'use client';

import React from 'react';

interface SaleStatusBadgeProps {
  recruitmentDate: string;  // 모집공고일
  announcementDate: string; // 당첨자발표일
}

export const SaleStatusBadge: React.FC<SaleStatusBadgeProps> = ({ recruitmentDate, announcementDate }) => {
  const today = new Date();
  const recDate = new Date(recruitmentDate);
  const annDate = new Date(announcementDate);

  let status: string;
  let icon: string;

  if (today < recDate) {
    status = '분양 예정';
    icon = '⏳';
  } else if (today > annDate) {
    status = '분양 완료';
    icon = '✅';
  } else {
    status = '분양 중';
    icon = '🏗️';
  }

  return (
    <div className="flex items-center space-x-1">
      <span>{icon}</span>
      <span className="text-sm text-gray-600">{status}</span>
    </div>
  );
};

export default SaleStatusBadge; 