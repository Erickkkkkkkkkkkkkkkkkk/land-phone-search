import { ApartmentInfo } from '@/app/types/apartment';

export type SaleStatus = 'upcoming' | 'ongoing' | 'completed';

export const getSaleStatus = (apt: ApartmentInfo): SaleStatus => {
  const today = new Date();
  const recDate = new Date(apt.RCRIT_PBLANC_DE);
  const annDate = new Date(apt.PRZWNER_PRESNATN_DE);

  if (today < recDate) return 'upcoming';
  if (today > annDate) return 'completed';
  return 'ongoing';
}; 