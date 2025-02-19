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