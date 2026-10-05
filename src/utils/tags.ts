/**
 * Tag indicating that the hour of a component comes from a time-of-day word
 * (e.g. "morning", "evening", "noon", "tonight") rather than an explicit clock time.
 *
 * When the `defaultTime` option is set, results tagged with this marker keep their
 * implied time instead of being overridden by the default time.
 */
export const IMPLIED_TIME_OF_DAY_TAG = "result/impliedTimeOfDay";
