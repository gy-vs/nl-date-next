import * as chrono from "../../src";
import { testSingleCase } from "../test_util";

const REF_DATE = new Date("2024-03-06T08:00:00Z");

describe("ParsingOption.defaultTime (zh)", () => {
    test("date-only expressions use the default time (start and end)", () => {
        testSingleCase(chrono.zh.hans, "3月5日", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T00:00:00Z"));
        });

        testSingleCase(chrono.zh.hans, "3月5日", REF_DATE, { defaultTime: { hour: 18, minute: 30 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T18:30:00Z"));
        });

        testSingleCase(chrono.zh.hans, "星期五", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-08T00:00:00Z"));
        });

        testSingleCase(chrono.zh.hant, "3月5日", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T00:00:00Z"));
        });

        testSingleCase(
            chrono.zh.hans,
            "3月5日 - 3月7日",
            REF_DATE,
            { defaultTime: { hour: 18, minute: 30 } },
            (result) => {
                expect(result.start).toBeDate(new Date("2024-03-05T18:30:00Z"));
                expect(result.end).toBeDate(new Date("2024-03-07T18:30:00Z"));
            }
        );
    });

    test("relative dates without time use the default time", () => {
        testSingleCase(chrono.zh.hans, "明天", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-07T00:00:00Z"));
        });

        testSingleCase(chrono.zh.hans, "今天", REF_DATE, { defaultTime: { hour: 18, minute: 30 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-06T18:30:00Z"));
        });

        testSingleCase(chrono.zh.hans, "3天后", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-09T00:00:00Z"));
        });
    });

    test("explicit clock time is unaffected", () => {
        testSingleCase(chrono.zh.hans, "下午3点", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-06T15:00:00Z"));
            expect(result.start.isCertain("hour")).toBe(true);
        });

        testSingleCase(chrono.zh.hans, "3月5日下午3点", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T15:00:00Z"));
        });

        testSingleCase(chrono.zh.hans, "3小时后", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-06T11:00:00Z"));
        });
    });

    test("time-of-day words are unaffected", () => {
        testSingleCase(chrono.zh.hans, "明晚", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-07T22:00:00Z"));
        });

        testSingleCase(chrono.zh.hans, "明天早上", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-07T06:00:00Z"));
        });

        testSingleCase(chrono.zh.hans, "下午", REF_DATE, { defaultTime: { hour: 18, minute: 30 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-06T15:00:00Z"));
        });

        testSingleCase(chrono.zh.hans, "现在", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-06T08:00:00Z"));
        });
    });

    test("works with forwardDate using the default time for the past check", () => {
        testSingleCase(
            chrono.zh.hans,
            "3月5日",
            REF_DATE,
            { forwardDate: true, defaultTime: { hour: 0 } },
            (result) => {
                expect(result.start).toBeDate(new Date("2025-03-05T00:00:00Z"));
            }
        );

        testSingleCase(
            chrono.zh.hans,
            "今天",
            REF_DATE,
            { forwardDate: true, defaultTime: { hour: 18, minute: 30 } },
            (result) => {
                expect(result.start).toBeDate(new Date("2024-03-06T18:30:00Z"));
            }
        );
    });

    test("not passing defaultTime keeps the library default behavior", () => {
        testSingleCase(chrono.zh.hans, "3月5日", REF_DATE, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T12:00:00Z"));
        });
        testSingleCase(chrono.zh.hans, "明天", REF_DATE, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-07T12:00:00Z"));
        });
    });
});
