/*
    Apply the `defaultTime` parsing option to date-only results (start and end).
    A result is considered date-only when its hour is not explicitly mentioned and
    the input does not include a time-of-day word (marked with IMPLIED_TIME_OF_DAY_TAG).

    This refiner runs before ForwardDateRefiner so that the "already past" check
    uses the implied default time.
*/

import { ParsingContext, Refiner } from "../../chrono";
import { ParsingComponents, ParsingResult } from "../../results";
import { IMPLIED_TIME_OF_DAY_TAG } from "../../utils/tags";

export default class DefaultTimeRefiner implements Refiner {
    refine(context: ParsingContext, results: ParsingResult[]): ParsingResult[] {
        const defaultTime = context.defaultTime;
        if (!defaultTime) {
            return results;
        }

        results.forEach((result) => {
            this.applyToComponents(context, result.start);
            if (result.end) {
                this.applyToComponents(context, result.end);
            }
        });

        return results;
    }

    private applyToComponents(context: ParsingContext, components: ParsingComponents) {
        if (components.isCertain("hour")) {
            return;
        }

        if (components.tags().has(IMPLIED_TIME_OF_DAY_TAG)) {
            return;
        }

        const defaultTime = context.defaultTime;
        components.imply("hour", defaultTime.hour);
        components.imply("minute", defaultTime.minute);
        components.imply("second", 0);
        components.imply("millisecond", 0);
        components.delete("meridiem");
        context.debug(() => {
            console.log(
                `${this.constructor.name} implied default time (${defaultTime.hour}:${defaultTime.minute}) into ${components}`
            );
        });
    }
}
