export const gematriaDay = (dayNum: number): string => {
  const map: Record<number, string> = {
    1: "א׳", 2: "ב׳", 3: "ג׳", 4: "ד׳", 5: "ה׳", 6: "ו׳", 7: "ז׳", 8: "ח׳", 9: "ט׳",
    10: "י׳", 11: "יא׳", 12: "יב׳", 13: "יג׳", 14: "יד׳", 15: "טו׳", 16: "טז׳", 17: "יז׳", 18: "יח׳", 19: "יט׳",
    20: "כ׳", 21: "כא׳", 22: "כב׳", 23: "כג׳", 24: "כד׳", 25: "כה׳", 26: "כו׳", 27: "כז׳", 28: "כח׳", 29: "כט׳",
    30: "ל׳"
  };
  return map[dayNum] || String(dayNum);
};

export const getHebrewDateText = (date: Date): string => {
  try {
    const formatter = new Intl.DateTimeFormat('he-IL-u-ca-hebrew', {
      day: 'numeric',
      month: 'long',
    });
    const parts = formatter.formatToParts(date);
    const dayPart = parts.find(p => p.type === 'day')?.value;
    const monthPart = parts.find(p => p.type === 'month')?.value;

    if (dayPart && monthPart) {
      const dayNum = parseInt(dayPart, 10);
      if (dayNum === 1) {
        return `${gematriaDay(dayNum)} ${monthPart}`;
      }
      return gematriaDay(dayNum);
    }
    return formatter.format(date);
  } catch (e) {
    return '';
  }
};
