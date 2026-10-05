import { DefaultTime } from "./types";

/**
 * The normalized default time: always carries both `hour` and `minute`.
 * When no `defaultTime` option was given, the library uses 12:00 (the historical
 * implied time for date-only results).
 *
 * `customized` tells whether the caller explicitly provided the option. Paths that
 * historically implied the reference time (e.g. "today"/"tomorrow") keep doing so
 * unless the option was set, so legacy behavior stays unchanged.
 */
export interface ResolvedDefaultTime {
    hour: number;
    minute: number;
    customized: boolean;
}

export const LIBRARY_DEFAULT_TIME: ResolvedDefaultTime = { hour: 12, minute: 0, customized: false };

/**
 * Validate and normalize the `defaultTime` parsing option.
 *
 * @throws when `defaultTime` is provided but contains an invalid hour/minute
 *         (missing hour, non-integer, negative, hour >= 24, or minute >= 60).
 */
export function resolveDefaultTime(defaultTime: DefaultTime | undefined): ResolvedDefaultTime {
    if (defaultTime === undefined) {
        return LIBRARY_DEFAULT_TIME;
    }

    if (
        typeof defaultTime !== "object" ||
        defaultTime === null ||
        typeof defaultTime.hour !== "number" ||
        !Number.isInteger(defaultTime.hour) ||
        defaultTime.hour < 0 ||
        defaultTime.hour > 23
    ) {
        throw new Error(
            `Invalid defaultTime option: 'hour' must be an integer between 0 and 23 (got ${JSON.stringify(
                defaultTime
            )})`
        );
    }

    const minute = defaultTime.minute === undefined ? 0 : defaultTime.minute;
    if (typeof minute !== "number" || !Number.isInteger(minute) || minute < 0 || minute > 59) {
        throw new Error(
            `Invalid defaultTime option: 'minute' must be an integer between 0 and 59 (got ${JSON.stringify(
                defaultTime
            )})`
        );
    }

    return { hour: defaultTime.hour, minute, customized: true };
}
