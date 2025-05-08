import {Action, api, ParamsFrom} from "actionhero";
import {SFAssignment} from "../models/sfassignment";
import {Types} from "mongoose";

export class ReportingAssignmentsList extends Action {
    constructor() {
        super();
        this.name = "reportingAssignmentsList";
        this.description = "reportingAssignmentsList";
    }

    async run() {
        const asses = await SFAssignment.aggregate([
            {
                $group: {
                    _id: "$aName"
                }
            }, {
                $sort: {
                    _id: 1
                }
            }
        ]);
        return { result: asses}
    }
}
