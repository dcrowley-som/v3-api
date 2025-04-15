import {Action, api, log, ParamsFrom} from "actionhero";


export class ReportingConcurrency extends Action {
    constructor() {
        super();
        this.name = "reportingConcurrency";
        this.description = "reportingConcurrency";
        this.inputs = {
            selectedRange: { required: true},
            start: { required: false},
            end: { required: false},
            user: { required: true },
            assignment: { required: true },
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingConcurrency> }) {
        const dates = api.helpers.datesFromParams(params);
        const start = dates.start;
        const end = dates.end;
        // return {
        //     params,
        //     start,
        //     end
        // }
        const result = await api.assignments.processConcurrency(start, end, params.user, params.assignment);

        return { result }
    }
}
