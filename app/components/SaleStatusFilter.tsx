'use client';

import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SaleStatusFilterProps {
  filters: {
    upcoming: boolean;
    ongoing: boolean;
    completed: boolean;
  };
  onChange: (key: 'upcoming' | 'ongoing' | 'completed', value: boolean) => void;
}

export const SaleStatusFilter: React.FC<SaleStatusFilterProps> = ({
  filters,
  onChange,
}) => {
  return (
    <div className="w-full p-4 bg-white ">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <div className="flex items-center space-x-2">
          <Switch
            id="upcoming"
            checked={filters.upcoming}
            onCheckedChange={(checked: boolean) => onChange('upcoming', checked)}
          />
          <Label htmlFor="upcoming" className="text-sm">
            분양예정
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="ongoing"
            checked={filters.ongoing}
            onCheckedChange={(checked: boolean) => onChange('ongoing', checked)}
          />
          <Label htmlFor="ongoing" className="text-sm">
            분양중
          </Label>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="completed"
            checked={filters.completed}
            onCheckedChange={(checked: boolean) => onChange('completed', checked)}
          />
          <Label htmlFor="completed" className="text-sm">
            분양완료
          </Label>
        </div>
      </div>
    </div>
  );
};

export default SaleStatusFilter; 