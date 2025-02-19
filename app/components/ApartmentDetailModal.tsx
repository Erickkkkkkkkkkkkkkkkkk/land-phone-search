'use client';

import React from 'react';
import { ApartmentInfo } from '@/app/types/api';
import { Button } from '@/app/components/ui/button';

interface ApartmentDetailModalProps {
  apartment: ApartmentInfo;
  isOpen: boolean;
  onClose: () => void;
}

export const ApartmentDetailModal: React.FC<ApartmentDetailModalProps> = ({ apartment, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full mx-4">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">{apartment.HOUSE_NM} 분양정보</h2>
          <Button onClick={onClose} variant="outline">
            닫기
          </Button>
        </div>
        <div className="p-4">
          {apartment.PBLANC_URL ? (
            <iframe
              src={apartment.PBLANC_URL}
              title={`${apartment.HOUSE_NM} 분양정보`}
              className="w-full h-96"
            />
          ) : (
            <p className="text-gray-500">분양정보를 불러올 수 없습니다.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetailModal; 