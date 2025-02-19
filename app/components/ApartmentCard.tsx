'use client';

import React from 'react';
import { ApartmentInfo } from '@/app/types/api';
import SaleStatusBadge from './SaleStatusBadge';

interface ApartmentCardProps {
  apartment: ApartmentInfo;
}

export const ApartmentCard: React.FC<ApartmentCardProps> = ({ apartment }) => {
  return (
    <div className="border p-4 rounded-md shadow-sm hover:shadow-md transition-shadow duration-200">
      <h2 className="text-xl font-bold mb-2">{apartment.HOUSE_NM}</h2>
      <SaleStatusBadge 
        recruitmentDate={apartment.RCRIT_PBLANC_DE} 
        announcementDate={apartment.PRZWNER_PRESNATN_DE} 
      />
      {/* You can add more details about the apartment here if needed */}
    </div>
  );
};

export default ApartmentCard; 