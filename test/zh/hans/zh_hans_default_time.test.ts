import * as chrono from "../../../src";
import { testSingleCase } from "../../test_util";

// 2024-03-06, Wednesday, 08:00 UTC
const REF_DATE = new Date(Date.UTC(2024, 3 - 1, 6, 8, 0, 0));

describe("parse() with defaultTime option (Simplified Chinese)", () => {
    test("date-only inputs use the given hour and minute", () => {
        testSingleCase(chrono.zh.hans.casual, "3月5日", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 5, 0, 0, 0)));
        });

        testSingleCase(
            chrono.zh.hans.casual,
            "3月5日",
            REF_DATE,
            { defaultTime: { hour: 18, minute: 30 } },
            (result) => {
                expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 5, 18, 30, 0)));
            }
        );
    });

    test("relative date inputs use the default time", () => {
        testSingleCase(chrono.zh.hans.casual, "明天", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 7, 0, 0, 0)));
        });

        testSingleCase(chrono.zh.hans.casual, "今天", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 6, 0, 0, 0)));
        });

        testSingleCase(chrono.zh.hans.casual, "3天后", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 9, 0, 0, 0)));
        });
    });

    test("weekday inputs use the default time", () => {
        // 星期五 following the reference (2024-03-06, Wednesday) is 2024-03-08.
        testSingleCase(chrono.zh.hans.casual, "星期五", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 8, 0, 0, 0)));
        });
    });

    test("explicitly mentioned clock time is not affected", () => {
        testSingleCase(chrono.zh.hans.casual, "3月5日下午3点", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 5, 15, 0, 0)));
        });
    });

    test("day-period words are not affected", () => {
        testSingleCase(chrono.zh.hans.casual, "明天早上", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start.get("hour")).toBe(6);
        });

        testSingleCase(chrono.zh.hans.casual, "晚上", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start.get("hour")).toBe(22);
        });
    });

    test("date ranges apply the default time to both start and end", () => {
        testSingleCase(
            chrono.zh.hans.casual,
            "3月5日 - 3月7日",
            REF_DATE,
            { defaultTime: { hour: 18, minute: 30 } },
            (result) => {
                expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 5, 18, 30, 0)));
                expect(result.end).toBeDate(new Date(Date.UTC(2024, 3 - 1, 7, 18, 30, 0)));
            }
        );
    });

    test("forwardDate decides past/future with the set time", () => {
        // Reference is 2024-03-06 08:00. With defaultTime at 00:00, "3月6日" is
        // already past, so forwardDate keeps this year (the year is explicit here),
        // but a month/day without a year (weekday) is pushed to the coming week.
        testSingleCase(
            chrono.zh.hans.casual,
            "星期三",
            REF_DATE,
            { forwardDate: true, defaultTime: { hour: 0 } },
            (result) => {
                // Wednesday already passed this week at midnight -> next Wednesday.
                expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 13, 0, 0, 0)));
            }
        );
    });
});
