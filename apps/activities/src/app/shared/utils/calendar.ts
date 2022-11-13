import { TranslateService } from "@ngx-translate/core";

export const getWeekdays = async (translate: TranslateService, days: string[]) => {
  const weekdays:any = [];
  days.forEach(async (d) => {
    weekdays.push({
      label: (
        (await translate
          .get('general.weekdays.' + d)
          .toPromise()) as string
      ).slice(0, 3),
      value: d,
    });
  });
  return weekdays;
};
export const getMonths = async (translate: TranslateService, month: string[]) => {
  const months:any = [];
  month.forEach(async (m) => {
    months.push({
      label: (
        (await translate
          .get('general.months.' + m)
          .toPromise()) as string
      ).slice(0, 3).toUpperCase(),
      value: m,
    });
  });
  return months;
};
