
// 주어진 연도와 월의 마지막 날짜를 반환 (윤년 자동 처리)
export const getLastDayOfMonth = (year: number, month: number): Date => {
  return new Date(year, month + 1, 0);
};

export type PresetPeriodType = 'currentWeek' | 'currentMonth' | 'nextWeek' | 'nextMonth';

// 프리셋 타입에 따른 시작일과 종료일을 Date 객체로 반환하는 헬퍼 함수
export const getPresetDates = (type: PresetPeriodType): { startDate: Date; endDate: Date } => {
  const today = new Date();
  
  switch (type) {
    case 'currentWeek': {
      const currentSunday = new Date(today);
      currentSunday.setDate(today.getDate() - today.getDay());
      const currentSaturday = new Date(currentSunday);
      currentSaturday.setDate(currentSunday.getDate() + 6);
      return { startDate: currentSunday, endDate: currentSaturday };
    }
    case 'currentMonth': {
      const startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      const endDate = getLastDayOfMonth(today.getFullYear(), today.getMonth());
      return { startDate, endDate };
    }
    case 'nextWeek': {
      const currentSunday = new Date(today);
      currentSunday.setDate(today.getDate() - today.getDay());
      const nextSunday = new Date(currentSunday);
      nextSunday.setDate(currentSunday.getDate() + 7);
      const nextSaturday = new Date(nextSunday);
      nextSaturday.setDate(nextSunday.getDate() + 6);
      return { startDate: nextSunday, endDate: nextSaturday };
    }
    case 'nextMonth': {
      const startDate = new Date(today.getFullYear(), today.getMonth() + 1, 1);
      const endDate = getLastDayOfMonth(today.getFullYear(), today.getMonth() + 1);
      return { startDate, endDate };
    }
  }
};

// 오늘 날짜 기준 1년 검색 기간 계산
export const calculateOneYearPeriod = (): { startDate: string; endDate: string } => {
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-indexed
  
  if (currentMonth >= 9) { // 10월 이상
    return { startDate: `${currentYear}-01-01`, endDate: `${currentYear + 1}-12-31` };
  } else if (currentMonth < 4) { // 4월 이전
    return { startDate: `${currentYear - 1}-10-01`, endDate: `${currentYear}-12-31` };
  } else {
    return { startDate: `${currentYear}-01-01`, endDate: `${currentYear}-12-31` };
  }
}; 