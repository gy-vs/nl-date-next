import * as chrono from "../../src";
import { testSingleCase } from "../test_util";

// 2024-03-06, Wednesday, 08:00 UTC
const REF_DATE = new Date(Date.UTC(2024, 3 - 1, 6, 8, 0, 0));

describe("parse() with defaultTime option (English)", () => {
    test("date-only inputs use the given hour and minute", () => {
        testSingleCase(chrono.en.casual, "March 5", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 5, 0, 0, 0)));
        });

        testSingleCase(chrono.en.casual, "2024-03-05", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 5, 0, 0, 0)));
        });

        testSingleCase(chrono.en.casual, "March 5", REF_DATE, { defaultTime: { hour: 18, minute: 30 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 5, 18, 30, 0)));
        });
    });

    test("minute defaults to 0 when omitted", () => {
        testSingleCase(chrono.en.casual, "March 5", REF_DATE, { defaultTime: { hour: 18 } }, (result) => {
            expect(result.start.get("hour")).toBe(18);
            expect(result.start.get("minute")).toBe(0);
        });
    });

    test("weekday inputs use the default time", () => {
        // Friday following the reference (2024-03-06) is 2024-03-08.
        testSingleCase(chrono.en.casual, "Friday", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 8, 0, 0, 0)));
        });
    });

    test("relative date inputs use the default time", () => {
        testSingleCase(chrono.en.casual, "tomorrow", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 7, 0, 0, 0)));
        });

        testSingleCase(chrono.en.casual, "today", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 6, 0, 0, 0)));
        });

        testSingleCase(chrono.en.casual, "in 3 days", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 9, 0, 0, 0)));
        });

        testSingleCase(chrono.en.casual, "in 3 days", REF_DATE, { defaultTime: { hour: 18, minute: 30 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 9, 18, 30, 0)));
        });
    });

    test("date ranges apply the default time to both start and end", () => {
        testSingleCase(chrono.en.casual, "March 5 - March 7", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 5, 0, 0, 0)));
            expect(result.end).toBeDate(new Date(Date.UTC(2024, 3 - 1, 7, 0, 0, 0)));
        });

        testSingleCase(
            chrono.en.casual,
            "March 5 - March 7",
            REF_DATE,
            { defaultTime: { hour: 18, minute: 30 } },
            (result) => {
                expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 5, 18, 30, 0)));
                expect(result.end).toBeDate(new Date(Date.UTC(2024, 3 - 1, 7, 18, 30, 0)));
            }
        );
    });

    test("explicitly mentioned clock time is not affected", () => {
        testSingleCase(chrono.en.casual, "March 5 at 3pm", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 5, 15, 0, 0)));
        });

        testSingleCase(chrono.en.casual, "in 3 hours", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 6, 11, 0, 0)));
        });
    });

    test("day-period words are not affected", () => {
        testSingleCase(chrono.en.casual, "tomorrow morning", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start.get("hour")).toBe(6);
        });

        testSingleCase(chrono.en.casual, "this evening", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start.get("hour")).toBe(20);
        });

        testSingleCase(chrono.en.casual, "noon", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start.get("hour")).toBe(12);
        });

        testSingleCase(chrono.en.casual, "tonight", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start.get("hour")).toBe(22);
        });
    });

    test("year inference uses the set time", () => {
        // Without a year, "December 25" from 2024-03-06 is closer as 2023 than as 2024.
        // The comparison is made at the configured time (00:00), but the year stays 2023.
        testSingleCase(chrono.en.casual, "December 25", REF_DATE, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2023, 12 - 1, 25, 0, 0, 0)));
        });

        // "December 25" is in the future relative to a reference late in the same year.
        const lateRef = new Date(Date.UTC(2024, 12 - 1, 20, 8, 0, 0));
        testSingleCase(chrono.en.casual, "December 25", lateRef, { defaultTime: { hour: 0 } }, (result) => {
            expect(result.start).toBeDate(new Date(Date.UTC(2024, 12 - 1, 25, 0, 0, 0)));
        });
    });

    test("forwardDate decides past/future with the set time", () => {
        // Reference is 2024-03-06 08:00. With defaultTime at 00:00, "March 6" is
        // already past (today at midnight), so forwardDate moves it to next year.
        testSingleCase(
            chrono.en.casual,
            "March 6",
            REF_DATE,
            { forwardDate: true, defaultTime: { hour: 0 } },
            (result) => {
                expect(result.start).toBeDate(new Date(Date.UTC(2025, 3 - 1, 6, 0, 0, 0)));
            }
        );

        // The same input with a later defaultTime is still in the future this year.
        testSingleCase(
            chrono.en.casual,
            "March 6",
            REF_DATE,
            { forwardDate: true, defaultTime: { hour: 18 } },
            (result) => {
                expect(result.start).toBeDate(new Date(Date.UTC(2024, 3 - 1, 6, 18, 0, 0)));
            }
        );
    });

    test("parseDate() also honors the option", () => {
        expect(chrono.parseDate("March 5", REF_DATE, { defaultTime: { hour: 0 } })).toEqual(
            new Date(Date.UTC(2024, 3 - 1, 5, 0, 0, 0))
        );
    });
});

describe("defaultTime option validation", () => {
    test.each([
        ["hour 24", { hour: 24 }],
        ["negative hour", { hour: -1 }],
        ["minute 60", { hour: 0, minute: 60 }],
        ["negative minute", { hour: 0, minute: -1 }],
        ["non-integer hour", { hour: 1.5 }],
        ["missing hour", { minute: 0 } as unknown as chrono.ParsingOption["defaultTime"]],
    ])("throws for %s", (_label, defaultTime) => {
        expect(() => chrono.en.casual.parse("March 5", REF_DATE, { defaultTime })).toThrow(/defaultTime/);
    });
});
