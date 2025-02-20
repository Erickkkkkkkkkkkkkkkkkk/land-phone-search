'use client';

import React from 'react';
import { useChatStore } from '@/app/store/chatStore';
import { AREA_CODES } from '@/app/types/api';
import { Button } from '@/app/components/ui/button';

export const RegionSelect = () => {
  const { filters, setRegion, fetchApartments } = useChatStore();

  const handleRegionChange = (region: string) => {
    console.log('Selected region:', region);
    setRegion(region);
  };

  // Use a ref to store the last fetched region to avoid duplicate API calls
  const lastFetchedRegion = React.useRef<string | null>(null);

  React.useEffect(() => {
    // If the region hasn't changed since the last fetch, skip the API call
    if (lastFetchedRegion.current === filters.region) {
      return;
    }
    lastFetchedRegion.current = filters.region;
    console.log('Region filter changed:', filters.region);
    fetchApartments();
  }, [filters.region, fetchApartments]);

  return (
    <div className="w-full p-4">
      <h3 className="text-lg font-semibold mb-4">지역 선택</h3>
      <div className="grid grid-cols-4 gap-2">
        <Button
          onClick={() => handleRegionChange('전체')}
          variant={filters.region === '전체' ? 'default' : 'outline'}
          className={`
            ${filters.region === '전체'
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : 'bg-background hover:bg-accent hover:text-accent-foreground'}
            transition-colors duration-200
          `}
        >
          전체
        </Button>
        {Object.entries(AREA_CODES).map(([region]) => (
          <Button
            key={region}
            onClick={() => handleRegionChange(region)}
            variant={filters.region === region ? 'default' : 'outline'}
            className={`
              ${filters.region === region
                ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                : 'bg-background hover:bg-accent hover:text-accent-foreground'}
              transition-colors duration-200
            `}
          >
            {region}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default RegionSelect;