import { TermPeriod } from "@prisma/client";

export function convertTermToYears(term: number, period: TermPeriod): number {
  switch (period) {
    case TermPeriod.YEARS:
      return term;
    case TermPeriod.MONTHS:
      return term / 12;
    case TermPeriod.DAYS:
      return term / 365;
    default:
      throw new Error("Invalid term period.");
  }
}
