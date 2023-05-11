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
  month.forEach(async (m,i) => {
    months.push({
      label: (
        (await translate
          .get('general.months.' + m)
          .toPromise()) as string
      ).slice(0, 3).toUpperCase(),
      value: m,
      number: i+1
    });
  });
  return months;
};

export function getWeekdayInNumber(day:string){
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'].indexOf(day) + 1
}
export function getWeekdayInText(day:number){
  return ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][day]
}
