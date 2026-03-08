const SPRINT_DAYS = 10;
const EFFECTIVE_BASE_POINTS = 9;

export function calculateCapacity(holidayDays: number, ptoDays: number) {
  const availableDays = Math.max(0, SPRINT_DAYS - holidayDays - ptoDays);
  const capacityPoints = Number(((EFFECTIVE_BASE_POINTS * availableDays) / SPRINT_DAYS).toFixed(1));

  const reasons: string[] = [];
  if (holidayDays > 0) reasons.push(`${holidayDays} holiday${holidayDays > 1 ? 's' : ''}`);
  if (ptoDays > 0) reasons.push(`${ptoDays} PTO`);

  return {
    availableDays,
    capacityPoints,
    reason: reasons.length ? reasons.join(' + ') : 'Full availability'
  };
}
