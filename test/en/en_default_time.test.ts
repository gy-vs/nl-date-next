import * as chrono from "../../src";
import { testSingleCase } from "../test_util";

const REF_DATE = new Date("2024-03-06T08:00:00Z");

describe("ParsingOption.defaultTime (en)", () => {
    test("date-only expressions use the default time (start and end)", () => {
        testSingleCase(chrono.en, "March 5", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T00:00:00Z"));
        });

        testSingleCase(chrono.en, "March 5", REF_DATE, { defaultTime: { hour: 18, minute: 30 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T18:30:00Z"));
        });

        testSingleCase(chrono.en, "Friday", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-08T00:00:00Z"));
        });

        testSingleCase(chrono.en, "2024-03-05", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T00:00:00Z"));
        });

        testSingleCase(chrono.en, "March 5 - March 7", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T00:00:00Z"));
            expect(result.end).toBeDate(new Date("2024-03-07T00:00:00Z"));
        });

        testSingleCase(
            chrono.en,
            "March 5 - March 7",
            REF_DATE,
            { defaultTime: { hour: 18, minute: 30 } },
            (result) => {
                expect(result.start).toBeDate(new Date("2024-03-05T18:30:00Z"));
                expect(result.end).toBeDate(new Date("2024-03-07T18:30:00Z"));
            }
        );
    });

    test("relative dates without time use the default time", () => {
        testSingleCase(chrono.en, "tomorrow", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-07T00:00:00Z"));
        });

        testSingleCase(chrono.en, "today", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-06T00:00:00Z"));
        });

        testSingleCase(chrono.en, "next week", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-13T00:00:00Z"));
        });

        testSingleCase(chrono.en, "in 3 days", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-09T00:00:00Z"));
        });
    });

    test("explicit clock time is unaffected", () => {
        testSingleCase(chrono.en, "March 5 at 3pm", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T15:00:00Z"));
            expect(result.start.isCertain("hour")).toBe(true);
        });

        testSingleCase(chrono.en, "March 5 at 09:15", REF_DATE, { defaultTime: { hour: 18, minute: 30 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T09:15:00Z"));
        });

        testSingleCase(chrono.en, "in 3 hours", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-06T11:00:00Z"));
        });
    });

    test("time-of-day words are unaffected", () => {
        testSingleCase(chrono.en, "tomorrow morning", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-07T06:00:00Z"));
        });

        testSingleCase(chrono.en, "this evening", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-06T20:00:00Z"));
        });

        testSingleCase(chrono.en, "tonight", REF_DATE, { defaultTime: { hour: 18, minute: 30 } }, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-06T22:00:00Z"));
        });
    });

    test("works with forwardDate using the default time for the past check", () => {
        // March 5 is in the past relative to the reference (Mar 6, 08:00),
        // so without a year it must be moved to the next year at 00:00.
        testSingleCase(chrono.en, "March 5", REF_DATE, { forwardDate: true, defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date("2025-03-05T00:00:00Z"));
        });

        // With default 18:30, "today" 18:30 is still in the future, so the date is today.
        testSingleCase(
            chrono.en,
            "today",
            REF_DATE,
            { forwardDate: true, defaultTime: { hour: 18, minute: 30 } },
            (result) => {
                expect(result.start).toBeDate(new Date("2024-03-06T18:30:00Z"));
            }
        );
    });

    test("invalid defaultTime throws", () => {
        expect(() => chrono.en.parse("March 5", REF_DATE, { defaultTime: { hour: 24 } })).toThrow(/defaultTime/);
        expect(() => chrono.en.parse("March 5", REF_DATE, { defaultTime: { hour: -1 } })).toThrow(/defaultTime/);
        expect(() => chrono.en.parseDate("March 5", REF_DATE, { defaultTime: { hour: 12, minute: 60 } })).toThrow(
            /defaultTime/
        );
        expect(() => chrono.en.parseDate("March 5", REF_DATE, { defaultTime: { hour: 12, minute: -1 } })).toThrow(
            /defaultTime/
        );
        expect(() => chrono.en.parseDate("March 5", REF_DATE, { defaultTime: { hour: 1.5 } })).toThrow(/defaultTime/);
    });

    test("not passing defaultTime keeps the library default behavior", () => {
        testSingleCase(chrono.en, "March 5", REF_DATE, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-05T12:00:00Z"));
        });
        testSingleCase(chrono.en, "tomorrow", REF_DATE, (result) => {
            expect(result.start).toBeDate(new Date("2024-03-07T08:00:00Z"));
        });
    });
});
