import { addDuration } from "./duration";
import { ResolvedDefaultTime } from "../defaultTime";

/**
 * Find the most likely year, from a raw number. For example:
 * 1997 => 1997
 * 97 => 1997
 * 12 => 2012
 */
export function findMostLikelyADYear(yearNumber: number): number {
    if (yearNumber < 100) {
        if (yearNumber > 50) {
            yearNumber = yearNumber + 1900;
        } else {
            yearNumber = yearNumber + 2000;
        }
    }

    return yearNumber;
}

/**
 * Guess the most likely year for a date without an explicit year by comparing the
 * candidate dates (this year / last year / next year) to the reference date.
 *
 * When a customized `defaultTime` is given, the candidate dates are evaluated at
 * that clock time, so e.g. defaultTime {hour: 0} treats "today's date" as already
 * past at a 08:00 reference. Otherwise the reference's own time is used (legacy
 * behavior).
 */
export function findYearClosestToRef(
    refDate: Date,
    day: number,
    month: number,
    defaultTime?: ResolvedDefaultTime
): number {
    let date = new Date(refDate);
    date.setMonth(month - 1);
    date.setDate(day);
    if (defaultTime && defaultTime.customized) {
        date.setHours(defaultTime.hour, defaultTime.minute, 0, 0);
    }
    const nextYear = addDuration(date, { "year": 1 });
    const lastYear = addDuration(date, { "year": -1 });
    if (Math.abs(nextYear.getTime() - refDate.getTime()) < Math.abs(date.getTime() - refDate.getTime())) {
        date = nextYear;
    } else if (Math.abs(lastYear.getTime() - refDate.getTime()) < Math.abs(date.getTime() - refDate.getTime())) {
        date = lastYear;
    }
    return date.getFullYear();
}
