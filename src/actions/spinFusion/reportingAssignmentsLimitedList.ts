import {Action, api, ParamsFrom} from "actionhero";
import {SFAssignment} from "../../models/sfassignment";
import {Types} from "mongoose";

export class ReportingAssignmentsLimitedList extends Action {
    constructor() {
        super();
        this.name = "reportingAssignmentsLimitedList";
        this.description = "reportingAssignmentsLimitedList";
    }

    async run() {
        const asses = api.assignments.useScheduleNames.names;
        return { result: asses}
    }
}
