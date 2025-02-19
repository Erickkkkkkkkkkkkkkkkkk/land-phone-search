'use client';

import React from 'react';
import { useChatStore } from '@/app/store/chatStore';
import { DatePicker } from '@/app/components/ui/date-picker';
import { Button } from '@/app/components/ui/button';
import { format } from 'date-fns';

// 함수: 주어진 연도와 월의 마지막 날짜를 반환 (윤년 자동 처리)
const getLastDayOfMonth = (year: number, month: number): Date => {
  return new Date(year, month + 1, 0);
};

const PRESET_PERIODS = [
  { label: '이번 주', type: 'currentWeek' },
  { label: '이번 달', type: 'currentMonth' },
  { label: '다음 주', type: 'nextWeek' },
  { label: '다음 달', type: 'nextMonth' },
] as const;

// 새로 추가: 프리셋 타입에 따른 시작일과 종료일을 Date 객체로 반환하는 헬퍼 함수
const getPresetDates = (type: string): { startDate: Date; endDate: Date } => {
  const today = new Date();
  if (type === 'currentWeek') {
    const currentSunday = new Date(today);
    currentSunday.setDate(today.getDate() - today.getDay());
    const currentSaturday = new Date(currentSunday);
    currentSaturday.setDate(currentSunday.getDate() + 6);
    return { startDate: currentSunday, endDate: currentSaturday };
  } else if (type === 'currentMonth') {
    const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
    const endDate = getLastDayOfMonth(today.getFullYear(), today.getMonth());
    return { startDate, endDate };
  } else if (type === 'nextWeek') {
    const currentSunday = new Date(today);
    currentSunday.setDate(today.getDate() - today.getDay());
    const nextSunday = new Date(currentSunday);
    nextSunday.setDate(currentSunday.getDate() + 7);
    const nextSaturday = new Date(nextSunday);
    nextSaturday.setDate(nextSunday.getDate() + 6);
    return { startDate: nextSunday, endDate: nextSaturday };
  } else if (type === 'nextMonth') {
    const startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const endDate = getLastDayOfMonth(today.getFullYear(), today.getMonth() + 1);
    return { startDate, endDate };
  }
  return { startDate: today, endDate: today };
};

export const PeriodSelect = () => {
  const { filters, setPeriod, fetchApartments } = useChatStore();

  // 수정: 프리셋 버튼 클릭 시, 헬퍼 함수를 사용하여 날짜를 계산
  const handlePresetPeriod = (type: string) => {
    const { startDate, endDate } = getPresetDates(type);
    handlePeriodChange(startDate, endDate);
  };

  const handlePeriodChange = (startDate: Date | null, endDate: Date | null) => {
    setPeriod(
      startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate ? format(endDate, 'yyyy-MM-dd') : undefined
    );
  };

  const handleClearPeriod = () => {
    setPeriod(undefined, undefined);
  };

  return (
    <div className="w-full p-4">
      <h3 className="text-lg font-semibold mb-4">공고 기간 선택</h3>
      
      {/* 프리셋 버튼 */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {PRESET_PERIODS.map(({ label, type }) => {
          const preset = getPresetDates(type);
          const presetStart = format(preset.startDate, 'yyyy-MM-dd');
          const presetEnd = format(preset.endDate, 'yyyy-MM-dd');
          
          // 선택 상태 확인 로직 개선
          const isSelected = 
            filters.period.startDate === presetStart && 
            filters.period.endDate === presetEnd;

          return (
            <Button
              key={label}
              onClick={() => handlePresetPeriod(type)}
              variant={isSelected ? "default" : "outline"}
              className={`
                ${isSelected 
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                  : 'bg-background hover:bg-accent hover:text-accent-foreground'}
                transition-colors duration-200
              `}
            >
              {label}
            </Button>
          );
        })}
      </div>

      {/* 직접 선택 */}
      <div className="flex gap-4 items-center">
        <DatePicker
          selected={filters.period.startDate ? new Date(filters.period.startDate) : null}
          onChange={(date) => handlePeriodChange(date, filters.period.endDate ? new Date(filters.period.endDate) : null)}
          placeholder="시작일"
          className="flex-1"
        />
        <span className="text-gray-500">~</span>
        <DatePicker
          selected={filters.period.endDate ? new Date(filters.period.endDate) : null}
          onChange={(date) => handlePeriodChange(filters.period.startDate ? new Date(filters.period.startDate) : null, date)}
          placeholder="종료일"
          className="flex-1"
        />
        <Button
          onClick={handleClearPeriod}
          variant="outline"
          className="ml-2"
        >
          초기화
        </Button>
      </div>
    </div>
  );
};

export default PeriodSelect; 