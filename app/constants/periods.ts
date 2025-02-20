import { PresetPeriodType } from '@/app/utils/date';

export const PRESET_PERIODS: Array<{
  label: string;
  type: PresetPeriodType;
}> = [
  { label: '이번 주', type: 'currentWeek' },
  { label: '이번 달', type: 'currentMonth' },
  { label: '다음 주', type: 'nextWeek' },
  { label: '다음 달', type: 'nextMonth' },
] as const; 