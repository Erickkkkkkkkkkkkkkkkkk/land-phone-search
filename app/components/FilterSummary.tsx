import React from 'react';
import { useChatStore } from '@/app/store/chatStore';

const FilterSummary: React.FC = () => {
  const { filters } = useChatStore();
  const { region, period } = filters;
  return (
    <div className="p-4 bg-gray-50 border-b border-gray-200">
      <p className="text-sm text-gray-700">
        지역: {region} | 공고기간: {period.startDate || '-'} ~ {period.endDate || '-'}
      </p>
    </div>
  );
};

export default FilterSummary; 