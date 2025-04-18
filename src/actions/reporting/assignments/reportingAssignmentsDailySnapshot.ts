import {Action, api, log, ParamsFrom} from "actionhero";


export class ReportingAssignmentsDailySnapshot extends Action {
    constructor() {
        super();
        this.name = "reportingAssignmentsDailySnapshot";
        this.description = "reportingAssignmentsDailySnapshot";
        this.inputs = {
            providers: { required: true},
            date: { required: false}
        }
    }

    async run({ params }: { params: ParamsFrom<ReportingAssignmentsDailySnapshot> }) {

    }
}
